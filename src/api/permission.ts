/*
 * @Author: colpu
 * @Date: 2025-11-26 23:01:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-07 23:20:56
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, post, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getPermissionList = (params: any) =>
  get("/api/permission/list", { params });
export const getPermissionGroup = () => get("/api/permission/tree");

// 权限分配
export const apiPermissionGive = (params: any) =>
  post("/api/permission/give", params);

export const apiPermission = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "/api/permission",
    ["get", "delete"].includes(method) ? { params } : params
  );
};

export const apiPermissionUsers = (params: any) =>
  get("/api/permission/users", { params });

