/*
 * @Author: colpu
 * @Date: 2025-02-24 17:35:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-15 19:28:45
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { users, getUserList, token, getUser } from "../data/user";
import { routes } from "../data/routes";
import { rawResponse } from "../utils";
export default [
  {
    url: "/api/token",
    method: "post",
    timeout: 2000,
    response: token,
  },
  {
    url: "/api/user/info",
    method: "get",
    rawResponse: rawResponse((_req: any, res: any) => {
      const { tokens } = res.locals;
      const uid = tokens.uid;
      const data = users.find((item) => item.uid == uid);
      return {
        status: 0,
        data,
      };
    }, true),
  },
  {
    url: "/api/user/list",
    method: "get",
    timeout: 200,
    rawResponse: rawResponse((req: any) => {
      return {
        status: 0,
        data: {
          current: 1,
          count: req.query.pageSize,
          rows: getUserList(req.query),
        },
      };
    }, true),
  },
  {
    url: "/api/user",
    method: "get",
    timeout: 200,
    rawResponse: rawResponse((req: any) => {
      console.log("req.query");
      return {
        status: 0,
        data: getUser(req.query.id),
      };
    }, true),
  },
  {
    url: "/api/routes",
    method: "get",
    timeout: 200,
    rawResponse: rawResponse(
      {
        status: 0,
        data: routes,
      },
      true
    ),
  },
];
