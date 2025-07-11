/*
 * @Author: colpu
 * @Date: 2025-06-17 23:33:15
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-09 14:25:32
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
