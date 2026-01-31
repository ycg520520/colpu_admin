/*
 * @Author: colpu
 * @Date: 2025-03-26 20:45:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 16:20:42
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { configureStore } from "@reduxjs/toolkit";
import reducer from "@/store/reducer";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
