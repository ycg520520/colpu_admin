import { apiUploadFile } from "@/api/common";
import { generateFilename } from "./utils";

/*
 * @Author: colpu
 * @Date: 2025-12-28 21:32:33
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-28 22:41:11
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export async function singleUpload(options: any) {
  const { file, filename, onProgress, onSuccess, onError, query } = options;

  const formData: FormData = new FormData();
  if (!query.ismd5) {
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
  try {
    const res = await apiUploadFile(formData, {
      onUploadProgress: (progressEvent: any) => {
        if (onProgress) {
          onProgress(Math.floor(progressEvent.progress * 100));
        }
      },
    });
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
}
