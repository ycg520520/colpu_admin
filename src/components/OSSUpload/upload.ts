/*
 * @Author: colpu
 * @Date: 2023-02-08 19:25:01
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-12 21:43:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getAliyunSTS } from "@/api/aliyun";
import OSS from "ali-oss";
import filehash from "./filehash";

export const generateFilename = async (file: File, options: any = {}) => {
  const { rename = false, filepath, onMD5Calculated } = options;
  // 计算 MD5
  if (onMD5Calculated) {
    onMD5Calculated("calculating", 0);
  }
  const md5 = await filehash.calculateMD5InChunks(file);
  if (onMD5Calculated) {
    onMD5Calculated("completed", md5);
  }
  let filename = file.name;
  // 生成文件名
  if (rename) {
    const fileExt = filename.split(".").pop();
    filename = [md5, fileExt].join(".");
  }
  return [filepath, filename].join("/");
};
// 阿里云上传
export async function ossUpload(options: any) {
  const { file, query, onSuccess, onProgress, onError, onMD5Calculated } =
    options;
  let sign = options.sign;
  if (!sign) {
    throw new Error("没有配置签名");
  }

  // 阿里云的OSS上传
  const { credentials, bucket, filepath } = sign;
  let filename = sign.filename;
  if (!filename) {
    filename = await generateFilename(file, {
      rename: true,
      filepath,
      onMD5Calculated,
    });
  }
  if (/^\//.test(filename)) {
    filename = filename.substring(1);
  }

  // 初始化 OSS 客户端
  const response = await new OSS({
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    stsToken: credentials.securityToken,
    bucket: bucket,
    refreshSTSToken: async () => {
      sign = await getAliyunSTS(query);
      const { credentials } = sign;
      return {
        accessKeyId: credentials.accessKeyId,
        accessKeySecret: credentials.accessKeySecret,
        stsToken: credentials.securityToken,
      };
    },
    refreshSTSTokenInterval: 300000,
  })
    .multipartUpload(filename, file, {
      progress(percentage: any, files: any) {
        const percent = Math.floor(percentage * 100);
        // 对外抛出进度
        if (typeof onProgress === "function") {
          onProgress(percent, files);
        }
      },
    })
    .then((res: any) => {
      if (res.res.status === 200) {
        res.url = [sign.domain, res.name].join("/");
        if (typeof onSuccess === "function") {
          onSuccess(res, file);
        }
      }
      return res;
    })
    .catch((err) => {
      if (typeof onError === "function") {
        onError(err, file);
      }
      throw err;
    });
  return { ...response, sign };
}

export default async function upload(options: any = {}) {
  const { query } = options;
  const sign = await getAliyunSTS(query);
  return ossUpload({
    ...options,
    sign,
  });
}
