/*
 * @Author: colpu
 * @Date: 2025-10-28 15:06:22
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-28 15:09:15
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getRoleList } from "../data/roles";
import { rawResponse } from "../utils";
export default [
  {
    url: "/api/role/list",
    method: "get",
    timeout: 200,
    rawResponse: rawResponse((req: any) => {
      return {
        status: 0,
        data: getRoleList(req.query),
      };
    }, true),
  },
];
