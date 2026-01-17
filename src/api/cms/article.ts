/*
 * @Author: colpu
 * @Date: 2025-12-15 21:21:01
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-16 23:17:31
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getArticleList = (params: any) =>
  get("/api/article/list", { params });

export const apiArticle = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "/api/article",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
