import { RouteType } from "./types";

/*
 * @Author: colpu
 * @Date: 2025-03-18 21:23:51
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 23:50:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const noMatchRouter: RouteType = {
  path: "*",
  handle: {
    name: "notFound",
    meta: {
      title: "404",
    },
    hideTitle: true,
  },
  element: "exception/404",
};

export const baseRouter: RouteType[] = [
  {
    path: "login",
    handle: {
      name: "login",
      meta: {
        title: "用户登录",
      },
      hideTitle: true,
    },
    element: "login/index",
  },
  {
    path: "403",
    handle: {
      name: "403",
      meta: {
        title: "服务错误",
      },
      hideTitle: true,
    },
    element: "exception/403",
  },
  {
    path: "500",
    handle: {
      name: "500",
      meta: {
        title: "服务错误",
      },
      hideTitle: true,
    },
    element: "exception/500",
  },
];

export const asyncRouter: RouteType[] = [
  // {
  //   index: true,
  //   path: "home",
  // },
  // {
  //   path: "home",
  //   element: "example/index",
  //   handle: {
  //     layout: "BasicLayout",
  //     name: "home",
  //     icon: "SpotifyOutlined",
  //     translationKey: "menu.dashboard.name",
  //   },
  // },
];
