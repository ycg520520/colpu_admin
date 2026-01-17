/*
 * @Author: colpu
 * @Date: 2025-11-26 23:01:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-17 14:57:21
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";
import { installTree } from "@/utils";

export const getClassifyAll = (params: any) =>
  get("/api/classify/all", { params }).then(({ total, rows }: any) => {
    // 使用installTree函数将数据转换为树形结构，指定parent_id作为父子关联字段
    return { rows: installTree(rows, { key_fid: "parent_id" }), total };
  });

export const getClassifyTree = (handdle?: any): Promise<any> =>
  get("/api/classify/tree").then((res: any) => {
    return {
      data: res,
      tree: installTree(res, {
        key_fid: "parent_id",
        handdle,
      }),
    };
  });

export const apiClassify = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "/api/classify",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
