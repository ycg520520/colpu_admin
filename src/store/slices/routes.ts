/*
 * @Author: colpu
 * @Date: 2025-07-02 08:48:54
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-17 13:38:43
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getRoutes } from "@/api/menus";
import { RouteType } from "@/router";
import { StatusEnum, Status } from "@/types";
import { MenuDataItem } from "@ant-design/pro-components";
import { createSlice } from "@reduxjs/toolkit";

interface RoutesState {
  routes: RouteType[];
  flatMenus: MenuDataItem[];
  status: Status;
  error?: string;
}
const initialState: RoutesState = {
  routes: [],
  flatMenus: [],
  status: StatusEnum.IDLE,
  error: undefined,
};
const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setFlatMenus(state, action) {
      if (action.payload && action.payload.length > 0) {
        state.flatMenus.push(...action.payload);
      }
    },
  },
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
        console.log("addCase", action.payload);
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      });
  },
});
export const { setFlatMenus } = routesSlice.actions;
export default routesSlice.reducer;
