/*
 * @Author: colpu
 * @Date: 2025-06-18 08:55:08
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-30 17:07:59
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { combineReducers } from "@reduxjs/toolkit";
import locale from "@/store/slices/locale";
import user from "@/store/slices/user/index";
import routes from "@/store/slices/routes";
import dict from "@/store/slices/dict";
import dept from "@/store/slices/dept";
const rootReducer = combineReducers({
  locale,
  routes,
  user,
  dict,
  dept,
  // Add other slices here as needed
});
export default rootReducer;
