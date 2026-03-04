/*
 * @Author: colpu
 * @Date: 2026-03-02 17:18:13
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-04 16:15:23
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
/*
 * 请求全局网络事件总线
 * 通过事件解耦网络层与 UI，并对同类型网络做一次性触发
 */

export const GLOBAL_NETWORK_TYPE = {
  AUTH_EXPIRED: 1, // 授权过期
  AUTH_REFRESH: 2, // 授权刷新中
  AUTH_REFRESH_SUCCESS: 3, // 授权刷新成功
  AUTH_REFRESH_FAILED: 4, // 授权刷新失败
  NETWORK_REQUEST: 5, // 网络请求
  NETWORK_BUSY: 6, // 网络繁忙
  NETWORK_ERROR: 7, // 网络错误
} as const;
export type GlobalNetworkType =
  (typeof GLOBAL_NETWORK_TYPE)[keyof typeof GLOBAL_NETWORK_TYPE];

// 仅对这些类型做“同类型只触发一次”去重，成功/进度类事件每次都会触发
const DEDUP_TYPES = new Set<GlobalNetworkType>([
  GLOBAL_NETWORK_TYPE.AUTH_EXPIRED,
  GLOBAL_NETWORK_TYPE.AUTH_REFRESH_FAILED,
  GLOBAL_NETWORK_TYPE.NETWORK_ERROR, // 如果不希望对网络错误做去重，可以取消掉
]);

export interface GlobalNetworkEvent {
  type: GlobalNetworkType;
  message?: unknown;
  error?: unknown;
}

type GlobalNetworkListener = (event: GlobalNetworkEvent) => void;

const listeners = new Set<GlobalNetworkListener>();
const firedTypes = new Set<GlobalNetworkType>();

export const addGlobalNetworkListener = (listener: GlobalNetworkListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const delGlobalNetworkType = (type?: GlobalNetworkType) => {
  if (type) {
    firedTypes.delete(type);
  } else {
    firedTypes.clear();
  }
};

export const emitGlobalNetwork = (event: GlobalNetworkEvent) => {
  const eventType = event.type;
  const isDedupType = DEDUP_TYPES.has(eventType);

  if (isDedupType && firedTypes.has(eventType)) return;
  if (isDedupType) firedTypes.add(eventType);
  // 将 Set 转换为数组，避免遍历过程中修改集合导致的问题
  const snapshot = [...listeners];
  for (const listener of snapshot) {
    try {
      listener(event);
    } catch (error) {
      console.error(error); // 处理监听器抛出的错误
    }
  }
};
