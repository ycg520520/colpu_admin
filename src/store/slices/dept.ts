/*
 * @Author: colpu
 * @Date: 2025-11-26 22:23:39
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-30 17:20:43
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { StatusEnum, Status } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { extraReducers } from "../utils";
import { getDepartmentTree } from "@/api/departments";
import { DataNode } from "antd/es/tree";

export interface DictState {
  treeData: DataNode[];
  status: Status;
  error?: string;
}
const initialState: DictState = {
  treeData: [],
  status: StatusEnum.IDLE,
  error: undefined,
};
const dictSlice = createSlice({
  name: "dept",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    extraReducers<DictState>(builder, getDepartmentTree, (state, action) => {
      const payload = action.payload as DataNode[];
      state.treeData = payload;
      state.status = StatusEnum.SUCCEEDED;
    });
  },
});

export default dictSlice.reducer;
