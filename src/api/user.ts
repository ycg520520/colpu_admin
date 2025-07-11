/*
 * @Author: colpu
 * @Date: 2025-06-15 14:30:04
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 01:35:45
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { User } from "@/store/slices/user/types";
import { createThunk } from "@/utils";
import { post } from "@/utils/request";

export interface UserRequest {
  username: string;
  password: string;
}
export interface UserResponse {
  userInfo: User;
  token: string;
  refreshToken: string;
}
export const apiLogin = createThunk<UserRequest>("user/login", async (data) =>
  post("/api/login", data)
);

export const apiRole = async () => {
  // 模拟登出API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
export const aliLogout = async () => {
  // 模拟登出API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const apiGetUserInfo = async () => {
  // 模拟获取用户信息API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "",
          },
        },
      });
    });
  });
};
