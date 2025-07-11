/*
 * @Author: colpu
 * @Date: 2025-03-26 20:45:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 00:35:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { configureStore } from "@reduxjs/toolkit";
import reducer from "@/store/reducer";
import { injectStore } from "@/utils/request";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
injectStore(store);
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
