/*
 * @Author: colpu
 * @Date: 2025-11-20 11:59:18
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-20 19:17:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getRoleList = (params: any) =>
  get("/api/role/list", { params }).then(({ count: total, rows }: any) => {
    return { rows, total };
  });

export const apiRole = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "/api/role",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
