/**
 * @Author: colpu
 * @Date: 2025-07-09 15:00:59
 * @Lasteditorors: colpu ycg520520@qq.com
 * @LasteditorTime: 2025-07-10 13:05:28
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const routes = [
  {
    id: 1,
    fid: 0,
    path: "dashboard",
    index: true,
    handle: {
      name: "dashboard",
      icon: "SpotifyOutlined",
      translationKey: "menu.dashboard.name",
    },
  },
  {
    id: 2,
    fid: 1,
    index: true,
    path: "desk",
    handle: {
      name: "desk",
      translationKey: "menu.dashboard.desk",
      roles: ["admin", "editor"],
    },
    lazy: "dashboard/desk",
  },
  {
    id: 3,
    fid: 1,
    path: "analysis",
    handle: {
      name: "analysis",
      translationKey: "menu.dashboard.analysis",
      roles: ["admin", "editor"],
    },
    lazy: "dashboard/analysis",
  },
  {
    id: 4,
    fid: 1,
    path: "monitor",
    handle: {
      name: "monitor",
      translationKey: "menu.dashboard.monitor",
      roles: ["admin"],
    },
    lazy: "dashboard/monitor",
  },
  {
    id: 5,
    fid: 0,
    path: "example",
    handle: {
      name: "example",
      translationKey: "example.name",
      ns: "example",
    },
  },
  {
    id: 6,
    fid: 5,
    index: true,
    path: "mock",
    handle: {
      name: "mock",
      translationKey: "example.mock",
      ns: "example",
      roles: ["editor"],
      meta: {
        title: "Mock数据获取",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/index",
  },
  {
    id: 7,
    fid: 5,
    path: "search",
    handle: {
      name: "search",
      translationKey: "example.search",
      ns: "example",
      roles: ["admin"],
      meta: {
        title: "搜索列表",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/index",
  },
  {
    id: 8,
    fid: 5,
    path: "redux",
    handle: {
      name: "redux",
      translationKey: "example.redux.name",
      ns: "example",
      roles: ["admin"],
    },
  },
  {
    id: 9,
    fid: 8,
    index: true,
    path: "sub-index",
    handle: {
      name: "subIndex",
      translationKey: "example.redux.subIndex",
      ns: "example",
      meta: {
        title: "redux-sub列子-index",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/index",
  },
  {
    id: 10,
    fid: 8,
    path: "sub",
    handle: {
      name: "sub",
      translationKey: "example.redux.sub",
      ns: "example",
      meta: {
        title: "redux-sub列子",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/index",
  },
  {
    id: 11,
    fid: 0,
    path: "example_nochild",
    handle: {
      name: "nochild",
      translationKey: "nochild",
      ns: "example",
      roles: ["admin"],
      meta: {
        title: "列子",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/index",
  },
  {
    id: 12,
    fid: 0,
    path: "account",
    handle: {
      name: "account",
      translationKey: "menu.account.name",
    },
  },
  {
    id: 13,
    fid: 12,
    index: true,
    path: "center",
    handle: {
      name: "center",
      translationKey: "menu.account.center",
      roles: ["admin"],
    },
    lazy: "account/index",
  },
  {
    id: 14,
    fid: 12,
    path: "settings",
    handle: {
      name: "settings",
      translationKey: "menu.account.settings",
      roles: ["admin"],
    },
    lazy: "account/settings",
  },
];
