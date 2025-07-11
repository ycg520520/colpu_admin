import { RouteType } from ".";

/*
 * @Author: colpu
 * @Date: 2025-03-18 21:23:51
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 00:27:31
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
    hiddenTitle: true,
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
      hiddenTitle: true,
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
      hiddenTitle: true,
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
      hiddenTitle: true,
    },
    element: "exception/500",
  },
];

export const asyncRouter: RouteType[] = [
  // {
  //   index: true,
  //   path: "dashboard",
  // },
  // {
  //   path: "dashboard",
  //   handle: {
  //     name: "dashboard",
  //     icon: "SpotifyOutlined",
  //     translationKey: "menu.dashboard.name",
  //   },
  //   children: [
  //     {
  //       index: true,
  //       path: "desk",
  //     },
  //     {
  //       path: "desk",
  //       handle: {
  //         name: "desk",
  //         translationKey: "menu.dashboard.desk",
  //         roles: ["admin", "editor"],
  //       },
  //       lazy: "dashboard/desk",
  //     },
  //     {
  //       path: "analysis",
  //       handle: {
  //         name: "analysis",
  //         translationKey: "menu.dashboard.analysis",
  //         roles: ["editor"],
  //       },
  //       lazy: "dashboard/analysis",
  //     },
  //     {
  //       path: "monitor",
  //       handle: {
  //         name: "monitor",
  //         translationKey: "menu.dashboard.monitor",
  //         roles: ["admin"],
  //       },
  //       lazy: "dashboard/monitor",
  //     },
  //   ],
  // },
];
