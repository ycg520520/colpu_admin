import { ActionReducerMapBuilder, CaseReducer } from "@reduxjs/toolkit";

/*
 * @Author: colpu
 * @Date: 2025-07-02 11:27:09
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-02 11:45:27
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export function extraReducers<T>(
  builder: ActionReducerMapBuilder<any>,
  thunk: any,
  reducer: CaseReducer<T, any>
) {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    })
    .addCase(thunk.fulfilled, reducer)
    .addCase(thunk.rejected, (state, action) => {
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : JSON.stringify(action.payload);
      state.loading = false;
    });
}
