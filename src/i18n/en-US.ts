/*
 * @Author: colpu
 * @Date: 2025-03-18 20:41:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-03-28 15:50:10
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import menu from "./en-US/menu";
import pages from "./en-US/pages";
import pwa from "./en-US/pwa";
import settingDrawer from "./en-US/settingDrawer";
import settings from "./en-US/settings";
import { CustomLocale } from "./types";

const enUS: CustomLocale = {
  lang: "Languages",
  welcome: "Welcome",
  user: {
    help: "Help{{name}}",
    privacy: "Privacy",
    terms: "Terms",
  },
  pages,
  menu,
  settingDrawer,
  settings,
  pwa,
};

export default enUS;
