/*
 * @Author: colpu
 * @Date: 2025-06-18 14:13:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-04 16:20:00
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ParsedUrlQueryInput, stringify } from "querystring";
const env = import.meta.env.VITE_APP_ENV || "development";
import { TOKEN } from "@/constants";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { UserToken } from "@/types";
import { emitGlobalNetwork, GLOBAL_NETWORK_TYPE } from "@/utils/request/events";

function installUrl(url: string, params: ParsedUrlQueryInput) {
  return `${url}${
    params && Object.keys(params).length
      ? `${url.indexOf("?") > -1 ? "&" : "?"}${stringify(params)}`
      : ""
  }`;
}

function consoleLog(
  type: "log" | "error" | "warn" | "info",
  tag: string,
  config: InternalAxiosRequestConfig,
  err?: { message: string } | undefined,
) {
  const method: string = (config.method || "GET").toLocaleUpperCase();
  const startTime: number = config.headers?.startTime;
  console[type](
    `${tag} ${type.toLocaleUpperCase()}:: TIME:${
      Date.now() - startTime
    }ms, METHOD:${method}, URL:${installUrl(config.url || "", config.params)} ${
      config.data ? `,DATA:${stringify(config.data)}` : ""
    }`,
    err && err.message,
  );
}

/**
 * @param instance AxiosInstance
 * @param store Redux store，用于刷新 token 后同步 state（避免循环依赖，由 main 传入）
 */
function authInterceptor(instance: AxiosInstance) {
  // 是否浏览器刷新
  let isBrowserReflush = true;
  // 是否刷新token
  let isRefreshing = false;
  // 刷新token时，请求失败队列
  const failedQueue: any[] = [];
  const processQueue = ({
    error,
    token,
  }: {
    error?: unknown;
    token?: UserToken;
  }) => {
    failedQueue.forEach((p) => {
      if (error) {
        p.reject(error);
      }
      if (token) {
        p.resolve(token);
      }
    });
    failedQueue.length = 0;
  };
  const setAuthorization = (
    config: InternalAxiosRequestConfig,
    token: UserToken,
  ) => {
    config.headers.Authorization = `${token.token_type} ${token.access_token}`;
  };

  const retryRequest = (
    originalRequest: InternalAxiosRequestConfig,
    token: UserToken,
  ) => {
    setAuthorization(originalRequest, token); // 设置token
    return instance(originalRequest);
  };

  const getErrorStatus = (error: AxiosError): number | undefined => {
    return error.response?.status || error.status;
  };
  const getErrorMessage = (error: AxiosError): string | undefined => {
    return (error.response?.data as any)?.message || error.message;
  };
  const refreshTokenFailed = async (error: AxiosError, isEmit?: boolean) => {
    isRefreshing = false;
    removeItem(TOKEN); // 清除token
    processQueue({ error }); // 处理队列
    console.log(isEmit);
    if (isEmit) {
      const type =
        getErrorStatus(error) === 401 && !isBrowserReflush
          ? GLOBAL_NETWORK_TYPE.AUTH_EXPIRED
          : GLOBAL_NETWORK_TYPE.AUTH_REFRESH_FAILED;

      console.log("GLOBAL_NETWORK_TYPE", type);
      emitGlobalNetwork({
        type,
        message: getErrorMessage(error),
        error,
      });
    }
    isBrowserReflush = false; // 防止浏览器刷新时，弹出弹窗
    return Promise.reject(error);
  };

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token: UserToken = getItem(TOKEN);
      // 设置token
      if (token) setAuthorization(config, token);
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // 处理请求额外extra参数
      if (!originalRequest.extra) {
        originalRequest.extra = {};
      }
      const extra = originalRequest.extra;

      // 是否是401授权错误
      const is401 = getErrorStatus(error) === 401;
      // 是否重新请求
      const isRetry = extra.retry;
      // 检查是否是刷新token的请求（通过 URL 或自定义标记）
      const isRefreshRequest = extra.isRefreshRequest;
      // 如果是401授权错误
      if (is401) {
        // 如果是刷新token请求返回 401，则将将正在刷新设置false，并将错误加入列队，并返回错误；
        if (isRefreshRequest) {
          return refreshTokenFailed(error, isRefreshRequest);
        }
        if (!isRetry) {
          // 4、如果正在做刷新token请求，将其它请求加入队列，因第一请求已经发起了刷新token操作，所以后面的请求等待获取到的最新token
          if (isRefreshing) {
            // 如果正在刷新，将请求加入队列
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token: any) => {
              return retryRequest(originalRequest, token);
            });
          }
          console.info("401重新请求URL：", originalRequest.url);
          // 1、401时设置请求重试标识，设置全局刷新标识为true，表示需要刷新token；
          isRefreshing = true;
          originalRequest.extra.retry = true;
          // 2、获取storage中的token，如果不存在，将全局刷新标识设置为false，直接抛出错误和事件,不在做后续刷新token操作；
          const storeToken = getItem(TOKEN) as UserToken;
          if (!storeToken) {
            isRefreshing = false;
            emitGlobalNetwork({
              type: GLOBAL_NETWORK_TYPE.AUTH_REFRESH_FAILED,
              message: "storage中不存在token，请重新登录。",
              error,
            });
            return Promise.reject(error);
          }
          // 3、如果存在storage中的token，进行刷新token请求，获取新的token;
          emitGlobalNetwork({
            type: GLOBAL_NETWORK_TYPE.AUTH_REFRESH,
            message: "storage中存在token，正在刷新token...",
          });
          let token: UserToken;
          try {
            // 3.1、等待获取新的token，
            token = await instance.post(
              "token",
              {
                grant_type: "refresh_token",
                refresh_token: storeToken.refresh_token,
              },
              { extra: { isRefreshRequest: true } },
            );
          } catch (error: unknown) {
            // 3.6、刷新失败，将错误信息放入到队列中，将全局刷新标识置为false
            return refreshTokenFailed(error as AxiosError);
          }
          setItem(TOKEN, token);
          // 3.2、将全局刷新标识置为false
          isRefreshing = false;
          //
          isBrowserReflush = false;

          // 3.3、将新的token一同发给全局网络事件监听器；；
          emitGlobalNetwork({
            type: GLOBAL_NETWORK_TYPE.AUTH_REFRESH_SUCCESS,
            message: token,
          });
          // 3.4、将最新token放入到队列中
          processQueue({ token });
          // 3.5、最后重新发起当前请求
          return retryRequest(originalRequest, token);
        }
      }
      // 非401错误直接返回
      emitGlobalNetwork({
        type: GLOBAL_NETWORK_TYPE.NETWORK_ERROR,
        error,
      });
      return Promise.reject(error);
    },
  );
}

function logInterceptor(instance: AxiosInstance) {
  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 记录开始时间
      config.headers.startTime = Date.now();
      if (env === "development") {
        consoleLog("log", "REQUEST", config);
      }
      return config;
    },
    (error) => {
      if (env === "development") {
        consoleLog("error", "REQUEST", error.config, error);
      }
      return Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    (res) => {
      if (env === "development") {
        consoleLog("log", "RESPONSE", res.config);
      }
      return res;
    },
    (err) => {
      consoleLog("error", "RESPONSE", err.config, err);
      return Promise.reject(err);
    },
  );
}
function responseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use((res) => {
    const { data, config } = res;
    const { extra = {} } = config;
    if (extra.original) {
      return data;
    }
    if (data.status === 0) {
      return data.data;
    }
    return data;
  });
}

export const setupInterceptors = (instance: AxiosInstance) => {
  logInterceptor(instance);
  responseInterceptor(instance);
  authInterceptor(instance);
};
