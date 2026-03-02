/*
 * @Author: colpu
 * @Date: 2025-06-18 14:13:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:32:14
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ParsedUrlQueryInput, stringify } from "querystring";
const env = import.meta.env.VITE_APP_ENV || "development";
import { TOKEN } from "@/constants";
import { getItem, removeItem, setItem } from "../storage";
import { UserToken } from "@/types";
import { Modal } from "antd";
import { normalizeToken } from "../permissions";

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
 *
 * @param instance AxiosInstance
 * @description 设置认证拦截器和日志拦截器
 */
function authInterceptor(instance: AxiosInstance) {
  // 是否弹出过期对话框
  let isJumpExpire = false;

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

  const request401 = (
    originalRequest: InternalAxiosRequestConfig,
    token: UserToken,
  ) => {
    setAuthorization(originalRequest, token); // 设置token
    return instance(originalRequest);
  };

  const jumpLogin = () => {
    isJumpExpire = false;
    const location = window.location;
    removeItem(TOKEN);
    location.replace(
      `/login?redirect=${encodeURIComponent(
        location.pathname + location.search,
      )}`,
    );
  };
  const redirectToLogin = () => {
    if (isJumpExpire) return;
    isJumpExpire = true;
    // 刷新失败，跳转到登录页
    Modal.error({
      title: "登录已过期",
      content: "您的登录状态已失效，请重新登录。",
      okText: "去登录",
      closable: false,
      maskClosable: false,
      keyboard: false,
      onOk: jumpLogin,
    });
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
      // 处理网络错误或无响应的情况
      if (!error.response) {
        return Promise.reject(error);
      }
      const originalRequest = error.config;
      // 处理请求额外extra参数
      if (!originalRequest.extra) {
        originalRequest.extra = {};
      }
      const extra = originalRequest.extra;

      // 处理401错误
      const is401 = error.response.status === 401;
      // 检查是否是刷新token的请求（通过 URL 或自定义标记）
      const isRefreshRequest = extra.isRefreshRequest;

      // 是否重新请求
      const isRetry = extra.retry;

      // 如果是刷新请求返回 401，直接处理，不再尝试刷新
      if (is401 && isRefreshRequest) {
        isRefreshing = false;
        processQueue({ error }); // 处理队列
        redirectToLogin();
        return Promise.reject(error);
      }

      if (is401 && !isRetry) {
        // 0、如果正在刷新，将其它请求加入队列，这是因第一请求已经发起了刷新token操作，所以后面的请求等待获取到的最新token
        if (isRefreshing) {
          // 如果正在刷新，将请求加入队列
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token: any) => {
              return request401(originalRequest, token);
            })
            .catch((error) => {
              return Promise.reject(error);
            });
        }
        // 1、token过期请求标识重试
        originalRequest.extra.retry = true;
        // 2、设置全局刷新标识为true
        isRefreshing = true;
        // 3、获取刷新登陆token
        try {
          const userToken: UserToken = getItem(TOKEN);
          // 检查是否存在 refreshToken
          if (!userToken) {
            throw new Error("No refresh token available");
          }
          const rawToken: UserToken = await instance.post(
            "/api/token",
            {
              grant_type: "refresh_token",
              refresh_token: userToken.refresh_token,
            },
            {
              extra: {
                isRefreshRequest: true,
              },
            },
          );
          // 4、计算 expires_at 并存储
          const token = normalizeToken(rawToken);
          setItem(TOKEN, token);
          // 5、获取成功后将全局刷新标识置为false
          isRefreshing = false;
          // 6、将获取到的最新token放入到队列中
          processQueue({ token });
          // 7、重新发起当前请求
          return request401(originalRequest, token);
        } catch (error) {
          isRefreshing = false;
          processQueue({ error });
          redirectToLogin();
          return Promise.reject(error);
        }
      }
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
