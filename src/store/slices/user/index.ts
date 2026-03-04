/*
 * @Author: colpu
 * @Date: 2025-06-14 16:05:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-04 16:17:15
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getUserToken, getUserInfo, apiLogout } from "@/api/user";
import { StatusEnum, Status, UserToken } from "@/types";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { TOKEN } from "@/constants";
import { User } from "./types";
import { normalizeToken } from "@/utils/permissions";
interface UserState {
  user?: User;
  userToken?: UserToken;
  isLogin?: boolean;
  status?: Status;
  error?: string;
}
const userToken: UserToken = getItem(TOKEN);
const initialState: UserState = {
  user: undefined,
  userToken,
  isLogin: !!userToken,
  status: StatusEnum.IDLE,
};
const _resetUserState = (state: UserState) => {
  state.user = undefined;
  state.userToken = undefined;
  state.isLogin = false;
  state.status = StatusEnum.IDLE;
  state.error = undefined;
};
const _setUserToken = (state: UserState, token: UserToken) => {
  state.userToken = normalizeToken(token);
  state.isLogin = true;
  setItem(TOKEN, token);
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (state, action) => _setUserToken(state, action.payload),
    resetUser: _resetUserState,
    logout: (state) => {
      apiLogout().finally(() => {
        removeItem(TOKEN);
      });
      _resetUserState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserToken.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(getUserToken.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        _setUserToken(state, action.payload as UserToken);
      })
      .addCase(getUserToken.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      })
      // Get user profile cases - 在登录成功后自动触发
      .addCase(getUserInfo.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.user = action.payload as User;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.status = StatusEnum.FAILED;
      });
  },
});

export const selectUser = (state: { user: UserState }) => state.user;
export const roles = createSelector(
  [selectUser],
  (user) => user.user?.roles || [],
);
export const permissions = createSelector(
  [selectUser],
  (user) => user.user?.permissions || [],
);
export const { logout, setUserToken, resetUser } = userSlice.actions;
export default userSlice.reducer;
