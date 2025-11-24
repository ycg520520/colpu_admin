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
    parentId: 0,
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
    parentId: 1,
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
    parentId: 1,
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
    parentId: 1,
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
    parentId: 0,
    path: "example",
    handle: {
      name: "example",
      translationKey: "example.name",
      ns: "example",
    },
  },
  {
    id: 6,
    parentId: 5,
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
    parentId: 5,
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
    parentId: 5,
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
    parentId: 8,
    index: true,
    path: "sub/index",
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
    parentId: 8,
    path: "sub",
    handle: {
      name: "sub",
      translationKey: "menu.example.redux.sub",
      meta: {
        title: "redux-sub列子",
        keywords: "关键词设置",
        description: "页面描述",
      },
    },
    lazy: "example/redux_sub",
  },
  {
    id: 11,
    parentId: 0,
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
    parentId: 0,
    path: "account",
    handle: {
      name: "account",
      translationKey: "menu.account.name",
    },
  },
  {
    id: 13,
    parentId: 12,
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
    parentId: 12,
    path: "settings",
    handle: {
      name: "settings",
      translationKey: "menu.account.settings",
      roles: ["admin"],
    },
    lazy: "account/settings",
  },
  {
    id: 15,
    parentId: 0,
    path: "system",
    handle: {
      name: "system",
      translationKey: "menu.system.name",
    },
  },
  {
    id: 16,
    parentId: 15,
    path: "user",
    index: true,
    handle: {
      name: "user",
      translationKey: "menu.system.user.name",
      hideChildrenInMenu: true,
    },
  },
  {
    id: 17,
    parentId: 16,
    path: "list",
    index: true,
    handle: {
      name: "list",
      translationKey: "menu.system.user.list",
    },
    lazy: "system/user/index",
  },
  {
    id: 18,
    parentId: 16,
    path: "add",
    handle: {
      hideInMenu: true,
      name: "add",
      translationKey: "menu.system.user.add",
    },
    lazy: "system/user/add_edit",
  },
  {
    id: 19,
    parentId: 16,
    path: "edit",
    handle: {
      hideInMenu: true,
      hideTitle: true,
      name: "edit",
      translationKey: "menu.system.user.edit",
    },
    lazy: "system/user/add_edit",
  },
  {
    id: 20,
    parentId: 15,
    path: "role",
    handle: {
      name: "role",
      translationKey: "menu.system.role.name",
      hideChildrenInMenu: true,
    },
  },
  {
    id: 21,
    parentId: 20,
    path: "list",
    index: true,
    handle: {
      name: "list",
      translationKey: "menu.system.role.list",
    },
    lazy: "system/role/index",
  },

];
