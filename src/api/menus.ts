/*
 * @Author: colpu
 * @Date: 2025-06-18 16:15:05
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:11:47
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { createThunk, installTree } from "@/utils";
import { routerToTree } from "@/router/utils";
import { ObjectMaps } from "@/types";
import { asyncRouter } from "@/router/routes";
export const getRoutes = createThunk<void>("routes/get", () =>
  get("routes").then((data: any) => {
    if (data.length) return routerToTree(data);
    else return asyncRouter;
  }),
);

/**
 * 获取所有菜单数据并转换为树形结构
 * @param params 请求参数，类型为any
 * @returns 返回一个Promise，解析为树形结构的菜单数据
 */
export const getMenusAll = (params: any) =>
  // 发送GET请求获取菜单数据，params作为查询参数
  get("menus/all", { params }).then(({ total, rows }: any) => {
    // 使用installTree函数将数据转换为树形结构，指定parent_id作为父子关联字段
    return { rows: installTree(rows, { key_fid: "parent_id" }), total };
  });

/**
 * 获取菜单树结构数据的API函数
 * 该函数通过调用后端接口获取菜单的层级结构数据
 * @returns {Promise} 返回一个Promise对象，包含菜单树结构数据
 */
export const getMenusTree = (): Promise<any> =>
  get("menus/tree").then((res: any) =>
    installTree(res, { key_fid: "parent_id" }),
  );

export const apiMenus = (params: ObjectMaps, method: RequestMethod = "get") => {
  return ($http as any)[method](
    "menus",
    ["get", "delete"].includes(method) ? { params } : params,
  );
};
