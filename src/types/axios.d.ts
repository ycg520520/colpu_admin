/*
 * @Author: colpu
 * @Date: 2025-11-11 22:09:15
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-11 22:19:12
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    extra?: {
      // 请求标识
      requestId?: string;
      // 重试相关
      retryCount?: number;
      maxRetries?: number;
      // 优先级
      priority?: "low" | "normal" | "high";
      // 认证相关
      skipAuth?: boolean;
      requireAuth?: boolean;
      // 缓存相关
      useCache?: boolean;
      cacheKey?: string;
      cacheTimeout?: number;
      // 性能监控
      startTime?: number;
      endTime?: number;
      // 取消相关
      cancelPrevious?: boolean;
      // 业务相关
      metadata?: Record<string, any>;
      // 其他自定义属性
      [key: string]: any;
    };
  }
}
