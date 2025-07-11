/*
 * @Author: colpu
 * @Date: 2025-06-18 14:13:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 01:25:15
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { logout } from "@/store/slices/user";
import { ParsedUrlQueryInput, stringify } from "querystring";
const env = import.meta.env.VITE_APP_ENV || "development";

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
  err?: { message: string } | undefined
) {
  const method: string = (config.method || "GET").toLocaleUpperCase();
  const startTime: number = config.headers.startTime;
  console[type](
    `${tag} ${type.toLocaleUpperCase()}:: TIME:${
      Date.now() - startTime
    }ms, METHOD:${method}, URL:${installUrl(
      config.url || "",
      config.params
    )} ,DATA:${stringify(config.data)}`,
    err && err.message
  );
}

/**
 *
 * @param instance AxiosInstance
 * @description 设置认证拦截器和日志拦截器
 */
function authInterceptor(instance: AxiosInstance, store: any) {
  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const { token } = store.getState().user;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
}

function logInterceptor(instance: AxiosInstance) {
  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
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
    }
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
    }
  );
}
function responseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use((res) => {
    return res.data;
  });
}

export const setupInterceptors = (instance: AxiosInstance, store?: any) => {
  authInterceptor(instance, store);
  logInterceptor(instance);
  responseInterceptor(instance);
};
