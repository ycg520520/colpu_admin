/*
 * @Author: colpu
 * @Date: 2025-07-02 08:48:54
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 16:28:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createSlice } from "@reduxjs/toolkit";
import settings from "@/config/settings";
import { LAYOUT_SETTINGS } from "@/constants";
import { getItem, setItem } from "@/utils/storage";
const initialState = {
  ...settings,
  ...getItem(LAYOUT_SETTINGS),
};
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, { payload }) {
      const { colorPrimary } = payload;
      const newState = {
        ...payload,
        ...{
          token: {
            ...payload.token,
            colorPrimary: colorPrimary || state.colorPrimary,
          },
        },
      };
      setItem(LAYOUT_SETTINGS, newState);
      Object.assign(state, newState);
    },
  },
});
export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
