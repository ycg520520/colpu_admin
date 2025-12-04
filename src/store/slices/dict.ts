/*
 * @Author: colpu
 * @Date: 2025-11-14 12:11:27
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-26 22:23:39
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getDict } from "@/api/dict";
import { StatusEnum, Status } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { extraReducers } from "../utils";

export type DictValues = {
  label: string;
  value: any;
  data_code?: string;
  is_default?: number;
  [key: string]: any;
};
export type DictTypes = {
  name: string;
  options: DictValues[];
  [key: string]: any;
};
export type DictObjTypes = {
  [key: string]: DictTypes;
};
export interface DictState {
  dict: DictObjTypes;
  status: Status;
  error?: string;
}
const initialState: DictState = {
  dict: {},
  status: StatusEnum.IDLE,
  error: undefined,
};
const dictSlice = createSlice({
  name: "dict",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    extraReducers<DictState>(builder, getDict, (state, action) => {
      const payload = action.payload as DictTypes;
      state.dict = payload;
      state.status = StatusEnum.SUCCEEDED;
    });
  },
});

export default dictSlice.reducer;
