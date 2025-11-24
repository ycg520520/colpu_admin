/*
 * @Author: colpu
 * @Date: 2025-11-03 01:15:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-03 01:45:45
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import SparkMD5 from "spark-md5";

class FileHashCalculator {
  chunkSize: number;
  constructor() {
    this.chunkSize = 2 * 1024 * 1024; // 2MB 分片
  }

  // 计算文件 MD5（适合小文件）
  /**
   * 计算文件的MD5哈希值
   * @param file 需要计算MD5的文件对象
   * @returns 返回一个Promise，解析为文件的MD5哈希值
   */
  async calculateMD5(file: File) {
    return new Promise((resolve, reject) => {
      // 创建SparkMD5实例，用于计算ArrayBuffer的MD5
      const spark = new SparkMD5.ArrayBuffer();
      // 创建FileReader实例，用于读取文件内容
      const reader = new FileReader();

      // 文件读取完成时的回调函数
      reader.onload = function (e: any) {
        // 将读取的文件内容追加到SparkMD5计算器
        spark.append(e.target.result);
        // 完成MD5计算并获取结果
        const hash = spark.end();
        // 解析Promise，返回计算得到的MD5值
        resolve(hash);
      };

      // 文件读取失败时的回调函数
      reader.onerror = reject;
      // 以ArrayBuffer格式读取文件内容
      reader.readAsArrayBuffer(file);
    });
  }

  // 分片计算 MD5（适合大文件）
  async calculateMD5InChunks(file: File, onProgress?: any) {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      const chunks = Math.ceil(file.size / this.chunkSize);
      let currentChunk = 0;

      const loadNext = () => {
        const start = currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, file.size);
        const chunk = file.slice(start, end);
        fileReader.readAsArrayBuffer(chunk);
      };

      fileReader.onload = function (e: any) {
        spark.append(e.target.result);
        currentChunk++;

        // 进度回调
        if (onProgress) {
          onProgress(currentChunk / chunks);
        }

        if (currentChunk < chunks) {
          loadNext();
        } else {
          const hash = spark.end();
          resolve(hash);
        }
      };

      fileReader.onerror = reject;

      loadNext();
    });
  }

  getFileSignature(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }
}

export default new FileHashCalculator();
