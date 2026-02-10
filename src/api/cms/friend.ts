/*
 * @Author: colpu
 * @Date: 2025-12-18 21:52:20
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:12:33
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getFriendList = (params: any) =>
  get("friend/list", { params });

export const apiFriend = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "friend",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
