/*
 * @Author: colpu
 * @Date: 2026-01-07 16:13:30
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-15 22:23:04
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getNoticeList = (params: any) => get("/api/notice/list", { params });

export const apiNotice = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "/api/notice",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
