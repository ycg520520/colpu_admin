/*
 * @Author: colpu
 * @Date: 2023-02-08 19:25:01
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-29 09:01:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getAliyunSTS } from "@/api/aliyun";
import OSS from "ali-oss";
import { generateFilename } from "./utils";
// 阿里云上传
export async function ossUpload(options: any) {
  const { file, query, onSuccess, onProgress, onError } = options;
  let sign = options.sign;
  if (!sign) {
    throw new Error("没有配置签名");
  }

  // 阿里云的OSS上传
  const { credentials, bucket } = sign;
  let filename = sign.filename;
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
  const { query, file } = options;
  const md5name = await generateFilename(file, {
    rename: true,
  });
  // md5重命名
  if (!query.ismd5) {
    query.filename = md5name;
  }
  const sign: any = await getAliyunSTS(query);
  if (!sign.filename) {
    sign.filename = md5name;
  }
  return ossUpload({
    ...options,
    sign,
  });
}
