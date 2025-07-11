/*
 * @Author: colpu
 * @Date: 2025-06-18 16:15:05
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 01:48:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { RouteType } from "@/router";
import { get } from "@/utils/request";
import { createThunk } from "@/utils";
import { routerToTree } from "@/router/utils";
export interface RoutesResponse {
  data: RouteType[];
  status: number;
}

export const apiRoutes = createThunk("routes/get", () =>
  get("/api/routes").then((res) => {
    res.data = routerToTree(res.data, 0);
    return res;
  })
);
