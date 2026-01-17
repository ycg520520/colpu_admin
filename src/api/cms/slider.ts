/*
 * @Author: colpu
 * @Date: 2026-01-14 16:53:56
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-14 17:32:03
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getSliderList = (params: any) =>
  get("/api/slider/list", { params });

export const apiSlider = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "/api/slider",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
