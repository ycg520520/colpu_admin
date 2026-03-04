/*
 * @Author: colpu
 * @Date: 2025-06-18 08:55:08
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-02 16:55:22
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { combineReducers } from "@reduxjs/toolkit";
import locale from "@/store/slices/locale";
import user from "@/store/slices/user";
import routes from "@/store/slices/routes";
import dict from "@/store/slices/dict";
import dept from "@/store/slices/dept";
import tabs from "@/store/slices/tabs";
import settings from "@/store/slices/settings";
const rootReducer = combineReducers({
  locale,
  routes,
  user,
  dict,
  dept,
  tabs,
  settings,
  // Add other slices here as needed
});
export default rootReducer;
