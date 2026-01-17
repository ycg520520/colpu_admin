/*
 * @Author: colpu
 * @Date: 2025-12-27 10:56:47
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-28 21:54:04
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { generateFilename } from "./utils";
import { apiSSEUploadFile } from "@/api/common";
export type SSERequestType = {
  url?: string;
  request?: (formData: FormData, uuid: string) => void;
  delay?: number;
  options?: EventSourceInit;
  ismd5?: boolean;
};
export interface SSEUploadTypes {
  file: File;
  filename?: string;
  onSuccess?: (res: any) => void;
  onProgress?: (res: any) => void;
  onError?: (error: any) => void;
  sseOptions?: SSERequestType;
}
export const sseUpload = async (options: SSEUploadTypes) => {
  const {
    file,
    filename,
    onSuccess,
    onProgress,
    onError,
    sseOptions = {},
  } = options;
  const sseRequest = sseOptions.request;
  let sseUri = sseOptions.url;
  if (sseRequest && !sseUri) {
    throw new Error(
      "sseOptions.url is required when sseOptions.request is provided"
    );
  }
  if (!sseUri) {
    sseUri = "/api/upload/sse";
  }
  const formData: FormData = new FormData();
  console.log("正在计算 MD5...");
  if (sseOptions.ismd5) {
    // 计算文件 MD5
    let md5: string = "";
    try {
      md5 = await generateFilename(file, { rename: true });
    } catch (error) {
      console.error("计算 MD5 失败:", error);
      if (onError) {
        onError(error);
      }
    }
    // 添加文件和 MD5 到表单数据
    formData.append("md5", md5);
  }
  formData.append(filename || "file", file as File);
  const uploadId = Date.now().toString();

  // 连接上传SSE
  const sse = new EventSource(`${sseUri}?upload_id=${uploadId}`, {
    withCredentials: true,
    ...sseOptions,
  });
  sse.addEventListener("progress", (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (onProgress) {
        onProgress(data.percent);
      }
    } catch (err) {
      console.error("上传进度解析错误:", err);
      if (onError) {
        onError(err);
      }
    }
  });
  sse.addEventListener("completed", (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (onProgress) {
        onProgress(data.percent);
      }
    } catch (err) {
      console.error("上传完成解析错误:", err);
      if (onError) {
        onError(err);
      }
    }
    sse.close();
  });
  sse.addEventListener("error", (evt) => {
    console.error("上传错误:", evt);
    if (onError) {
      onError(evt);
    }
    sse.close();
  });
  setTimeout(() => {
    sse.onopen = () => {
      console.log("上传SSE连接已打开");
    };
  }, sseOptions.delay || 200);
  const uploadRequest = async () => {
    if (sseRequest) {
      return sseRequest(formData, uploadId);
    } else {
      return apiSSEUploadFile(formData, uploadId);
    }
  };

  try {
    const res = await uploadRequest();
    if (onSuccess) {
      onSuccess(res);
    }
    return res;
  } catch (error) {
    console.error("上传失败:", error);
    if (onError) {
      onError(error);
    }
  }
};
