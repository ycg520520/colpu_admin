/*
 * @Author: colpu
 * @Date: 2025-03-18 20:41:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-08 00:09:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */


import menu from "./zh-CN/menu";
import pages from "./zh-CN/pages";
import pwa from "./zh-CN/pwa";
import settingDrawer from "./zh-CN/settingDrawer";
import settings from "./zh-CN/settings";
import { CustomLocale } from "./types";

const zhCN: CustomLocale = {
  lang: "语言",
  welcome: "欢迎",
  user: {
    help: "帮助{{name}}",
    privacy: "隐私",
    terms: "条款",
  },
  pages,
  menu,
  settingDrawer,
  settings,
  pwa,
};

export default zhCN;
