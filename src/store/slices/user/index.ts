/*
 * @Author: colpu
 * @Date: 2025-06-14 16:05:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 19:56:28
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getUserToken, getUserInfo, apiLogout } from "@/api/user";
import { StatusEnum, Status, UserToken } from "@/types";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { TOKEN, USER } from "@/constants";
import { User } from "./types";
import { RootState } from "@/store";
import { isTokenExpire, normalizeToken } from "@/utils/permissions";
interface UserState {
  user?: User;
  userToken?: UserToken;
  status?: Status;
  error?: string;
}
const userToken: UserToken = getItem(TOKEN);
const initialState: UserState = {
  user: getItem(USER),
  userToken: isTokenExpire() ? undefined : userToken,
  status: StatusEnum.IDLE,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      apiLogout().finally(() => {
        removeItem(TOKEN);
        removeItem(USER);
      });
      state.user = undefined;
      state.userToken = undefined;
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
        state.userToken = normalizeToken(action.payload as UserToken);
        setItem(TOKEN, state.userToken);
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
        setItem(USER, state.user);
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

export const selectUser = (state: RootState) => state.user;
export const roles = createSelector(
  [selectUser],
  (user) => user.user?.roles || [],
);
export const permissions = createSelector(
  [selectUser],
  (user) => user.user?.permissions || [],
);
export const { logout } = userSlice.actions;
export default userSlice.reducer;
