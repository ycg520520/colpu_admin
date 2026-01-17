/*
 * @Author: colpu
 * @Date: 2025-11-24 21:00:00
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-28 22:22:22
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { get, post } from "@/utils/request";
// 获取部门、岗位、角色
export const apiUserParty = () => get("/api/user/party");
export const apiUploadFile = (formData: any, options?: any) =>
  post("/api/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
export const apiSSEUploadFile = (formData: any, uploadId: string) =>
  post("/api/upload/sse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Upload-Id": uploadId,
    },
  });
