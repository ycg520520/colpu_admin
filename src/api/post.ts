/*
 * @Author: colpu
 * @Date: 2025-11-22 20:29:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-26 23:01:19
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getPostList = (params: any) => get("/api/post/list", { params });

export const apiPost = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "/api/post",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
