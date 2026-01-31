/*
 * @Author: colpu
 * @Date: 2025-06-17 23:33:15
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 16:29:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export enum StatusEnum {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}
export type Status =
  | StatusEnum.IDLE
  | StatusEnum.LOADING
  | StatusEnum.SUCCEEDED
  | StatusEnum.FAILED;

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: Status;
}

export interface IconMaps {
  [key: string]: React.ReactNode;
}
export interface ObjectMaps {
  [key: string]: any;
}
export interface UserToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}
