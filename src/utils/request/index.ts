/*
 * @Author: colpu
 * @Date: 2025-06-18 14:13:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-11 00:04:29
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import axios, { AxiosInstance } from "axios";
import { setupInterceptors } from "./interceptors";

const $http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 截器依赖redux，需要在configureStore完成后注入store
export const injectStore = (store: any) => setupInterceptors($http, store);
export default $http;
export const get = $http.get;
export const post = $http.post;
export const put = $http.put;
export const del = $http.delete;
export const patch = $http.patch;
export const request = $http.request;
export type RequestMethod =
  | "delete"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "request";
