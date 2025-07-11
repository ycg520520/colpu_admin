/*
 * @Author: colpu
 * @Date: 2025-02-24 17:35:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 23:10:39
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { LoginUsers, getUsersByPageSize, login } from "./mockdata/user";
import { routes } from "./mockdata/routes";
function verifyToken(token: string) {
  return LoginUsers.find((user) => user.token === token);
}
function responseVerifyToken(callback: any) {
  return (ctx: any) => {
    const { headers } = ctx;
    const token = headers.authorization?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return {
        code: 401,
        message: "Invalid token",
      };
    }
    // 检查admin权限
    if (
      !user.userInfo.roles.filter((item) =>
        ["*", "admin", "editor"].includes(item)
      ).length
    ) {
      return {
        code: 403,
        message: "Forbidden: Admin role required",
      };
    }

    if (typeof callback === "function") {
      return callback(ctx);
    } else {
      return callback;
    }
  };
}

export default [
  {
    url: "/api/login",
    method: "post",
    timeout: 2000,
    response: login,
  },
  {
    url: "/api/user",
    method: "get",
    timeout: 2000,
    response: responseVerifyToken({
      status: 0,
      data: LoginUsers,
    }),
  },
  {
    url: "/api/user/list",
    method: "get",
    timeout: 2000,
    response: ({ query }: any) => {
      return {
        status: 0,
        data: getUsersByPageSize(query.pageSize),
      };
    },
  },
  {
    url: "/api/routes",
    method: "get",
    timeout: 2000,
    response: responseVerifyToken({
      status: 0,
      data: routes,
    }),
  },
];
