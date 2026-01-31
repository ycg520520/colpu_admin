/*
 * @Author: colpu
 * @Date: 2025-06-15 12:01:36
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 16:28:10
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { RouteType } from "@/router";
import { MenuDataItem } from "@ant-design/pro-components";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UploadFile } from "antd";
import { TFunction } from "i18next";
export type IconFunction = (icon: string) => React.ReactNode;
export function composeMenu(
  routes: RouteType[],
  translation?: TFunction,
  iconFunction?: IconFunction,
): MenuDataItem[] {
  if (!routes.length) return [];
  const menuList: MenuDataItem[] = [];
  for (let idx = 0; idx < routes.length; idx++) {
    const route: RouteType = routes[idx];
    const { index, children = [], path, handle = {} } = route;
    const {
      icon,
      translationKey,
      ns,
      name,
      hideChildrenInMenu,
      hideInMenu,
      hideTitle,
      target,
    } = handle;
    if ((index || !path) && !handle.layout) continue;
    const item: MenuDataItem = {
      path,
      icon: icon && iconFunction ? iconFunction(icon) : undefined,
      name,
      hideChildrenInMenu,
      hideInMenu,
      hideTitle,
      target,
    };

    if (children.length) {
      item.children = composeMenu(children, translation, iconFunction);
    }

    if (translation && translationKey) {
      item.name = translation(translationKey, { ns });
    }
    if (!hideInMenu) {
      menuList.push(item);
    }
  }
  return menuList;
}

export function createThunk<T>(
  typePrefix: string,
  callback: (params: T) => Promise<unknown>,
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
    },
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
    handdle?: (item: any) => void;
  } = {},
) {
  const {
    id = 0,
    mode = "tree", // mode: tree, object, array
    key_id = "id",
    key_fid = "fid",
    handdle,
  } = options;
  if (id === 0 && mode === "array") {
    return data;
  }
  const dict: { [key: string]: any } = {},
    filterItem = [];

  // 组装到字典
  data.forEach((item) => {
    if (handdle) {
      handdle(item);
    }
    dict[item[key_id]] = item;
  });
  if (id === 0 && mode === "object") {
    return dict;
  }
  for (const i in dict) {
    const item = dict[i];
    const father = item[key_fid] || 0;
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
    const father = item[key_fid] || 0;
    if (father === id || item[key_id] === id) {
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
export function treeToPlan(data: any, arr: any[] = []) {
  data.forEach((item: any) => {
    arr.push(item);
    if (item.children) {
      treeToPlan(item.children, arr);
    }
  });
  return arr;
}
export function filterParentId(treeData: any[], ids: any[] = [], key = "key") {
  const filterIds: any[] = [];
  treeData.forEach((item: any) => {
    if (item.children) {
      const childFilterIds = filterParentId(item.children, ids, key);
      filterIds.push(...childFilterIds);
    } else if (ids.includes(item[key])) {
      filterIds.push(item[key]);
    }
  });
  return filterIds;
}

/**
 * 筛选出复合条件的数据，并保留其子节点
 * 用于筛选树形数据
 * eg: const predicate = (item: any) => item.status === 1; // 筛选出 status 为 1 的数据
 * @param tree
 * @param predicate
 * @param childrenKey
 * @returns
 */
export function filterTree(
  tree: any[],
  predicate: (item: any) => any,
  childrenKey: string = "children",
) {
  return tree
    .map((item) => ({ ...item }))
    .filter((item) => {
      if (item[childrenKey] && item.children.length) {
        item[childrenKey] = filterTree(item.children, predicate, childrenKey);
      }
      return (
        predicate(item) || (item[childrenKey] && item[childrenKey].length > 0)
      );
    });
}

export function pagination(pages: any, options?: any): any {
  const { defaultPageSize = 10, showTotal } = options || {};
  const pageSizeOptions = [10, 20, 30, 40, 50, 100];
  if (pageSizeOptions.indexOf(defaultPageSize) === -1) {
    pageSizeOptions.push(defaultPageSize);
    pageSizeOptions.sort((a, b) => a - b);
  }
  const { page: current, pageSize, total } = pages;
  return {
    current,
    pageSize,
    total,
    size: "small",
    defaultPageSize,
    pageSizeOptions,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: showTotal
      ? showTotal
      : (total: number, range: any) =>
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  };
}

/**
 * 获取元素距离文档顶部的距离
 * @param {HTMLElement} element - 目标元素
 * @param {boolean} includeMargin - 是否包含外边距
 * @returns {number} 距离顶部的像素值
 */
export function getOffsetTop(
  element: HTMLElement | null,
  includeMargin: boolean = false,
): number {
  if (!element) return 0;

  let top = 0;

  // 方法1: 使用 getBoundingClientRect (推荐)
  if (element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    top = rect.top + scrollTop;

    // 如果包含外边距
    if (includeMargin) {
      const styles = window.getComputedStyle(element);
      const marginTop = parseFloat(styles.marginTop) || 0;
      top -= marginTop;
    }
  }
  // 方法2: 传统 offsetTop 方法
  else {
    top = element.offsetTop;
    let parent: any = element.offsetParent;

    while (parent) {
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }
  }

  return top;
}

export const sleep = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export function filterValues(data: any) {
  if (Array.isArray(data)) {
    return data.filter((item) => item !== null && item !== undefined);
  }
  const result: any = {};
  Object.keys(data).forEach((key: string) => {
    if (data[key] !== null && data[key] !== undefined) {
      result[key] = data[key];
    }
  });
  return result;
}
// 工具函数：URL→UploadFile
export function urlToFileList(options: any = {}): UploadFile[] {
  const { url, uid = "-1", name, status = "done" } = options;
  if (!url) return [];
  return [
    {
      uid, // 必须有uid
      name: name ? name : url.substring(url.lastIndexOf("/") + 1),
      status, // 必须是'done'才会显示为已上传
      url,
    },
  ];
}

