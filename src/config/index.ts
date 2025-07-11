/*
 * @Author: colpu
 * @Date: 2025-03-16 16:52:57
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-08 00:07:58
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

/**
 * @name 使用公共路径
 * @description 部署时的路径，如果部署在非根目录下，需要配置这个变量
 */
const PUBLIC_PATH: string = "/";
export default {
  /**
   * @name 开启 hash 模式
   * @description 让build之后的产物包含hash后缀。通常用于增量发布和避免浏览器加载缓存。
   */
  hash: true,
  publicPath: PUBLIC_PATH,
};
