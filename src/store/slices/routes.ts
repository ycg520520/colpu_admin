/*
 * @Author: colpu
 * @Date: 2025-07-02 08:48:54
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 01:14:03
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { apiRoutes, RoutesResponse } from "@/api/routes";
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
      .addCase(apiRoutes.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(apiRoutes.fulfilled, (state, action) => {
        const payload = action.payload as RoutesResponse;
        state.routes = payload.data;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(apiRoutes.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      });
  },
});

export default routesSlice.reducer;
