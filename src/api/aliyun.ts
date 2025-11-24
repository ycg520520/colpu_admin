/*
 * @Author: colpu
 * @Date: 2025-10-31 21:09:06
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-03 16:00:56
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { get } from "@/utils/request";
export const getAliyunSTS = (params?: any) => {
  return get("/api/aliyun/ststoken", { params });
};
