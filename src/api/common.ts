/*
 * @Author: colpu
 * @Date: 2025-11-24 21:00:00
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 21:04:53
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { get } from "@/utils/request";
// 获取部门、岗位、角色
export const apiUserParty = () => get("/api/user/party");
