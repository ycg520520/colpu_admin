/*
 * @Author: colpu
 * @Date: 2026-01-07 16:13:30
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:12:28
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";
export const getFragsList = (params: any) => get("frags/list", { params });

export const apiFrags = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "frags",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
