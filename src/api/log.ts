/*
 * @Author: colpu
 * @Date: 2025-11-26 23:01:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:10:05
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import { get } from "@/utils/request";
export const getLogList = (params: any) => get("log/list", { params });
