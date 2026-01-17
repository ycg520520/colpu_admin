/*
 * @Author: colpu
 * @Date: 2025-12-08 22:45:07
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-10 08:44:29
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { createSlice } from "@reduxjs/toolkit";

export type TabItem = {
  path: string;
  name: string;
  closable: boolean;
};

export type TabState = {
  tabs: TabItem[];
  hasTab: boolean;
};
const initialState: TabState = {
  tabs: [
    {
      name: "首页",
      path: "/home",
      closable: false,
    },
  ],
  hasTab: true,
};
const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setHasTab: (state, action) => {
      state.hasTab = action.payload;
    },
    addTab: (state, action) => {
      const newTab = action.payload;
      const exists = state.tabs.some((tab) => tab.path === newTab.path);
      if (!exists) {
        state.tabs.push(newTab);
      }
    },
    removeTab: (state, action) => {
      const pathToRemove = action.payload;
      state.tabs = state.tabs.filter((tab) => tab.path !== pathToRemove);
    },
    clearTabs: (state) => {
      state.tabs = [];
    },
  },
});

export const { addTab, removeTab, clearTabs, setHasTab } = tabsSlice.actions;
export default tabsSlice.reducer;
