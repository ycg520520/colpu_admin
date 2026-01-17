/*
 * @Author: colpu
 * @Date: 2026-01-07 16:13:30
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-15 16:16:46
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const apiSite = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "/api/site",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
