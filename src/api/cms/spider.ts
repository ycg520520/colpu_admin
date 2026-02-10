/*
 * @Author: colpu
 * @Date: 2026-01-14 17:32:23
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 21:20:51
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { get, post, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getSpiderList = (params: any) =>
  get("spider/list", { params });

export const apiSpider = (
  params: ObjectMaps,
  method: RequestMethod = "get",
) => {
  return ($http as any)[method](
    "spider",
    ["get", "delete"].includes(method) ? { params } : params,
  );
};
export const apiSpiderSchedule = (params: ObjectMaps) => {
  return post("spider/schedule", params);
};