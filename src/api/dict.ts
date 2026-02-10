/*
 * @Author: colpu
 * @Date: 2025-11-03 12:35:57
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:11:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ObjectMaps } from "@/types";
import { createThunk } from "@/utils";
import $http, { get, type RequestMethod } from "@/utils/request";

export const getAllDictData = () => {
  return get("dict/all");
};

export const apiDictTypes = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "dict/types",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
export const checkDictTypes = (params: ObjectMaps) => {
  return get("dict/types/check", { params });
};

export const apiDictData = (
  params: ObjectMaps,
  method: RequestMethod = "get"
) => {
  return ($http as any)[method](
    "dict/data",
    ["get", "delete"].includes(method) ? { params } : params
  );
};
export const checkDictData = (params: ObjectMaps) => {
  return get("dict/data/check", { params });
};

export const getDict = createThunk<void>("dict", () => get("dict"));
