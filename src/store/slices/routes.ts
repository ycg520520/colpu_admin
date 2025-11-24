/*
 * @Author: colpu
 * @Date: 2025-07-02 08:48:54
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 11:59:56
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getRoutes } from "@/api/menus";
import { RouteType } from "@/router";
import { StatusEnum, Status } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface RoutesState {
  routes: RouteType[];
  status: Status;
  error?: string;
}
const initialState: RoutesState = {
  routes: [],
  status: StatusEnum.IDLE,
  error: undefined,
};
const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoutes.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(getRoutes.fulfilled, (state, action) => {
        const payload = action.payload as RouteType[];
        state.routes = payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(getRoutes.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      });
  },
});

export default routesSlice.reducer;
