/*
 * @Author: colpu
 * @Date: 2025-11-24 21:00:00
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-08 16:58:22
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { ObjectMaps } from "@/types";
import { get, post } from "@/utils/request";
// 获取部门、岗位、角色
export const apiUserParty = () => get("user/party");
export const apiUploadFile = (formData: any, options?: any) =>
  post("upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
export const apiSSEUploadFile = (formData: any, uploadId: string) =>
  post("upload/sse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Upload-Id": uploadId,
    },
  });

export const apiSchedule = (params: ObjectMaps) => {
  return get("schedule", { params });
};
