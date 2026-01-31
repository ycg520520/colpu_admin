/*
 * @Author: colpu
 * @Date: 2025-06-25 15:37:27
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 10:09:57
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

// 加载状态文本配置
export const statusText = {
  contentrefresh: "正在加载…",
  contentdown: "上拉显示更多",
  contentnomore: "没有更多数据啦",
};

export const PLATFORM = "@PLATFORM"; // 当前平台标识
export const CONFIG = "@CONFIG"; // 全局配置
export const USER = "@USER_INFO"; // 用户信息
export const TOKEN = "@USER_TOKEN"; // 用户TOKEN
export const I18NEXTLNG = "@I18NEXTLNG"; // 用户刷新
export const LAYOUT_SETTINGS = "@LAYOUT_SETTINGS"; // 布局设置

export const FILE_TYPE_CODE = {
  0: "dir",
  1: "txt",
  2: "doc",
  3: "docx",
  4: "xls",
  5: "xlsx",
  6: "ppt",
  7: "pptx",
  8: "pdf",
  9: "swf",
  10: "jpg",
  11: "image",
  12: "jpeg",
  13: "bmp",
  14: "gif",
  15: "avi",
  16: "wmv",
  17: "flv",
  18: "video",
};

export const defaultLoaderData = (extend = {}) => {
  return {
    status: "more",
    pageSize: 10,
    pageNo: 0,
    total: 0,
    list: [],
    ...extend,
  };
};

// 全屏图标Map
export const FULLSCREEN_ICONS = {
  fullscreen: FullscreenExitOutlined,
  exitFullScreen: FullscreenOutlined,
};
export const LAYOUT_OPTIONS = [
  { value: "MainLayout", label: "主体布局" },
  { value: "OtherLayout", label: "其他布局" },
  { value: "ChildLayout", label: "嵌套布局" },
];
