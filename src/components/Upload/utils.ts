/*
 * @Author: colpu
 * @Date: 2025-12-28 14:18:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-31 16:08:49
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { UploadFile } from "antd";
import filehash from "./filehash";
export const generateFilename = async (file: File, options: any = {}) => {
  const { rename = false } = options;
  let filename = file.name;
  // 生成文件名
  if (rename) {
    const md5 = await filehash.calculateMD5InChunks(file);
    const fileExt = filename.split(".").pop();
    filename = [md5, fileExt].join(".");
  }
  return filename;
};

// 根据 returnType 返回不同的值
export function returnFilesHanddle(
  fileList: UploadFile<any>[],
  maxCount: number,
  returnType: "url" | "object" | "file" | "fileList"
) {
  switch (returnType) {
    case "url":
      if (maxCount === 1) {
        return fileList[0]?.url || fileList[0]?.response?.url || "";
      } else {
        return fileList
          .filter((file) => file.status === "done")
          .map((file) => file.url || file.response?.url)
          .filter(Boolean);
      }
    case "object":
      if (maxCount === 1) {
        const file = fileList[0];
        return file
          ? {
              uid: file.uid,
              name: file.name,
              url: file.url || file.response?.url,
              size: file.size,
              type: file.type,
            }
          : null;
      } else {
        return fileList.map((file) => ({
          uid: file.uid,
          name: file.name,
          url: file.url || file.response?.url,
          size: file.size,
          type: file.type,
        }));
      }
    case "file":
      if (maxCount === 1) {
        return fileList[0] || null;
      } else {
        return fileList;
      }
    case "fileList":
    default:
      return fileList;
  }
}

export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 将 File 按指定宽高比缩放
 * @param file 原始文件
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 * @returns Promise<Blob> 调整后的图片 Blob
 */
export function resizeImageToRatio(
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        // 创建 Canvas
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // 设置背景色（透明或白色）
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // 计算缩放比例，保持图片比例居中
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let drawWidth = targetWidth;
        let drawHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > targetRatio) {
          // 图片更宽 → 按高度缩放，水平居中
          drawHeight = targetHeight;
          drawWidth = img.width * (targetHeight / img.height);
          offsetX = (targetWidth - drawWidth) / 2;
        } else {
          // 图片更高 → 按宽度缩放，垂直居中
          drawWidth = targetWidth;
          drawHeight = img.height * (targetWidth / img.width);
          offsetY = (targetHeight - drawHeight) / 2;
        }

        // 绘制图片
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // 导出为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg", // 可改为 'image/png' 等
          0.92 // 压缩质量
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
interface ImageWithDimensions {
  base64: string;
  width: number;
  height: number;
  type: string; // 如 'image/jpeg'
  name: string; // 原始文件名
}

export function getImageObjectWithDimensions(
  file: File,
  options: any = {}
): Promise<ImageWithDimensions> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        // 创建 Canvas 重新生成（保持原始尺寸）
        const canvas = document.createElement("canvas");
        const { width, aspect, isThumb } = options || {};
        let _w = img.width;
        let _h = img.height;
        if (isThumb) {
          _w = width;
          _h = Math.round(width / aspect);
        }
        canvas.width = _w;
        canvas.height = _h;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, _w, _h);
        const base64 = canvas.toDataURL(file.type, 0.92);

        resolve({
          base64,
          width: img.width,
          height: img.height,
          type: file.type,
          name: file.name,
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
