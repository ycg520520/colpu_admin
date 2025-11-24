/*
 * @Author: colpu
 * @Date: 2025-11-20 19:17:17
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-23 00:03:15
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";
import { installTree } from "@/utils";
export const getDepartmentTree = (): Promise<any> =>
  get("/api/department/tree").then((res: any) =>
    installTree(res, { key_fid: "parent_id" })
  );
export const getDepartmentList = (params: any) =>
  get("/api/department/list", { params }).then(
    ({ count: total, rows }: any) => {
      return { rows: installTree(rows, { key_fid: "parent_id" }), total };
    }
  );

export const apiDepartment = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "/api/department",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
