/*
 * @Author: colpu
 * @Date: 2025-06-15 14:30:04
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:11:19
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ObjectMaps } from "@/types";
import { createThunk } from "@/utils";
import $http, { get, post, RequestMethod } from "@/utils/request";

export const getUserToken = createThunk("token", (data: ObjectMaps) => {
  return post("token", { grant_type: "password", ...data });
});

export const getUserInfo = createThunk<void>("user/info", () =>
  get("user/info"),
);

export const getUserList = (params: any) => {
  return get("user/list", { params });
};

export const getUserById = (id: any) => {
  return get("user", { params: { id } });
};

export const getCheckUser = (params: ObjectMaps) => {
  return get("user/check", { params, extra: { original: true } });
};

export const apiUser = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "user",
    ["get", "delete"].includes(method) ? { params } : params,
  );
};

export const getRoleList = (params: any) => {
  return get("role/list", { params });
};

export const apiLogout = () => {
  return post("logout");
};

export const apiUserSearch = (params: any) =>
  get("user/search", { params });
