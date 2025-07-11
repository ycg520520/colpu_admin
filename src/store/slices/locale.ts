/*
 * @Author: colpu
 * @Date: 2025-03-26 20:47:30
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-01 23:12:41
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { createSlice } from "@reduxjs/toolkit";
import { setAntLocale } from "@/i18n";
import { Locale } from "antd/es/locale";
const initialState: Locale = {
  ...setAntLocale(),
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLang: (state, action) => {
      Object.assign(state, setAntLocale(action.payload));
    },
  },
});

export const { setLang } = localeSlice.actions;
export default localeSlice.reducer;
