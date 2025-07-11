/*
 * @Author: colpu
 * @Date: 2025-06-15 12:01:36
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 00:20:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { RouteType } from "@/router";
import { MenuDataItem } from "@ant-design/pro-components";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TFunction } from "i18next";
export type IconFunction = (icon: string) => React.ReactNode;
export function composeMenu(
  routes: RouteType[],
  translation?: TFunction,
  iconFunction?: IconFunction
): MenuDataItem[] {
  if (!routes) return [];
  const list = routes
    .map((route: RouteType): MenuDataItem | undefined => {
      const { index, children = [], path, handle = {} } = route;
      const { hidden, icon, translationKey, ns, name } = handle;
      if (index || hidden || !path) return;
      const item: MenuDataItem = {
        path,
        icon: icon && iconFunction ? iconFunction(icon) : undefined,
        name,
      };
      if (children.length) {
        item.children = composeMenu(children, translation, iconFunction);
      }

      if (translation && translationKey) {
        item.name = translation(translationKey, { ns });
      }
      return item;
    })
    .filter((item): item is MenuDataItem => !!item);
  if (list.length === 1 && Array.isArray(list[0])) {
    return list[0];
  }
  return list;
}

export function createThunk<T>(
  typePrefix: string,
  callback: (params: T) => Promise<unknown>
) {
  return createAsyncThunk(
    typePrefix,
    async (params: T, thunkAPI): Promise<unknown> => {
      try {
        // 模拟登录API请求
        return callback(params);
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
      }
    }
  );
}

/**
 * @function installTree 组装树
 * @param {Array} data 要处理的树数组
 * @param {Object} options 默认配置
 */
export function installTree(
  data: Array<any> = [],
  options: {
    id?: number;
    mode?: string;
    key_id?: string;
    key_fid?: string;
  } = {}
) {
  const {
    id = 0,
    mode = "tree", // mode: tree, object, array
    key_id = "id",
    key_fid = "fid",
  } = options;
  if (id === 0 && mode === "array") {
    return data;
  }
  const dict: { [key: string]: any } = {},
    filterItem = [];

  // 组装到字典
  data.forEach((item) => {
    dict[item[key_id]] = item;
  });
  if (id === 0 && mode === "object") {
    return dict;
  }
  for (const i in dict) {
    const item = dict[i];
    const father = item[key_fid];
    const fatherData = dict[father];
    if (father > 0 && fatherData) {
      if (!fatherData.children) {
        fatherData.children = [];
      }
      fatherData.children.push(item);
    }
  }

  const result: any[] = [];
  for (const i in dict) {
    const item = dict[i];
    if (item[key_fid] === id || item[key_id] === id) {
      filterItem.push(item);
      result.push(item);
    }
  }
  const loop = (arr: any, res: any) => {
    arr.forEach((v: any) => {
      const k = v[id];
      const item = dict[k];
      if (item.children) {
        loop(item.children, res);
      }

      delete item.children;
      if (mode === "object") {
        res[k] = item;
      } else if (mode === "array") {
        res.push(item);
      }
    });
  };
  if (mode !== "tree") {
    const res = mode === "object" ? {} : [];
    loop(filterItem, res);
    return res;
  }

  return result;
}
