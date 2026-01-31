/*
 * @Author: colpu
 * @Date: 2025-06-15 14:30:04
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 22:15:42
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ObjectMaps } from "@/types";
import { createThunk } from "@/utils";
import $http, { get, post, RequestMethod } from "@/utils/request";

export const getUserToken = createThunk("token", (data: ObjectMaps) => {
  return post("/api/token", { grant_type: "password", ...data });
});

export const getUserInfo = createThunk<void>("user/info", () =>
  get("/api/user/info"),
);

export const getUserList = (params: any) => {
  return get("/api/user/list", { params });
};

export const getUserById = (id: any) => {
  return get("/api/user", { params: { id } });
};

export const getCheckUser = (params: ObjectMaps) => {
  return get("/api/user/check", { params, extra: { original: true } });
};

export const apiUser = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "/api/user",
    ["get", "delete"].includes(method) ? { params } : params,
  );
};

export const getRoleList = (params: any) => {
  return get("/api/role/list", { params });
};

export const apiLogout = () => {
  return post("/api/logout");
};

export const apiUserSearch = (params: any) =>
  get("/api/user/search", { params });
