/*
 * @Author: colpu
 * @Date: 2025-06-18 08:28:46
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-08 00:01:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface RolesState {
  roles: string[];
  permissions: string[];
}

const initialState: RolesState = {
  roles: [],
  permissions: [],
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addPermission: (state, action: PayloadAction<string>) => {
      if (!state.permissions.includes(action.payload)) {
        state.permissions.push(action.payload);
      }
    },
  },
});

export const { addPermission } = rolesSlice.actions;
export default rolesSlice.reducer;
