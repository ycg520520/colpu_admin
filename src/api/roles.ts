/*
 * @Author: colpu
 * @Date: 2025-11-20 11:59:18
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:11:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, post, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getRoleList = (params: any) => get("role/list", { params });

export const apiRole = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "role",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
export const apiRoleUser = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "role/user",
    ["get", "delete"].includes(method) ? { params } : params
  );
};

export const apiDataScope = (params: any) =>
  post("role/data_scope", params);
export const apiRoleSelect = () => get("role/select");

export const apiRolePermission = (params: any) =>
  post("role/permission", params);
