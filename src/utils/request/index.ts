/*
 * @Author: colpu
 * @Date: 2025-06-18 14:13:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 16:16:21
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

setupInterceptors($http)
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
