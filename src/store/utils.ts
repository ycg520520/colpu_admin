import { StatusEnum } from "@/types";
import { ActionReducerMapBuilder, CaseReducer } from "@reduxjs/toolkit";

/*
 * @Author: colpu
 * @Date: 2025-07-02 11:27:09
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 17:10:35
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
      state.status = StatusEnum.LOADING;
      state.error = undefined;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.status = StatusEnum.SUCCEEDED;
      reducer(state, action);
    })

    .addCase(thunk.rejected, (state, action) => {
      state.status = StatusEnum.FAILED;
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : JSON.stringify(action.payload);
    });
}
