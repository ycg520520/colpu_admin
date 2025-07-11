/*
 * @Author: colpu
 * @Date: 2025-06-14 16:05:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 12:51:56
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiLogin, UserResponse } from "@/api/user";
import { StatusEnum, Status } from "@/types";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { REFRESH_TOKEN, TOKEN, USER } from "@/constants";
import { User } from "./types";
import { RootState } from "@/store";

interface UserState {
  user?: User;
  token?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
  status?: Status;
  error?: string;
}
const token = getItem(TOKEN);
const initialState: UserState = {
  user: getItem(USER),
  token,
  refreshToken: getItem(REFRESH_TOKEN),
  isAuthenticated: token ? true : false,
  status: StatusEnum.IDLE,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      removeItem(TOKEN);
      removeItem(REFRESH_TOKEN);
      removeItem(USER);
      state.user = undefined;
      state.token = undefined;
      state.refreshToken = undefined;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiLogin.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(apiLogin.fulfilled, (state, action) => {
        const { userInfo, token, refreshToken } = action.payload as UserResponse;
        state.status = StatusEnum.SUCCEEDED;
        state.user = userInfo;
        state.token = token;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        setItem(TOKEN, token);
        setItem(REFRESH_TOKEN, refreshToken);
        setItem(USER, userInfo);
      })
      .addCase(apiLogin.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const roles = createSelector(
  [selectUser],
  (user) => user.user?.roles || []
);
export const permissions = createSelector(
  [selectUser],
  (user) => user.user?.permissions || []
);

export const { logout } = userSlice.actions;
export default userSlice.reducer;
