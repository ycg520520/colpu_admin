import { UserToken } from "@/types";
import { getItem } from "./storage";
import { TOKEN } from "@/constants";

/** 提前多少毫秒视为过期（缓冲），便于提前刷新 token，默认 60 秒 */
const TOKEN_EXPIRE_BUFFER_MS = 60 * 1000;

/** 存储 token 时计算 expires_at（OAuth2 expires_in 为剩余秒数） */
export const normalizeToken = (token: UserToken): UserToken => ({
  ...token,
  expires_at: Date.now() + (token.expires_in || 0) * 1000,
});

/*
 * @Author: colpu
 * @Date: 2025-06-18 00:11:32
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 16:40:31
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const PERMISSIONS = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_ROLES: "MANAGE_ROLES",
  EDIT_PROFILE: "EDIT_PROFILE",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const hasPermissions = (
  userPermissions: string[],
  permission?: string,
): boolean => {
  // 没指定权限
  if (!permission) return true;
  // 所有权限
  if (userPermissions.includes("*:*:*")) return true;
  // 指定权限
  return userPermissions.includes(permission);
};

export const checkRoles = (
  userRoles: string[],
  requiredRoles: string[],
): boolean => {
  return (
    userRoles.every((p) => requiredRoles.includes(p)) || userRoles.includes("*")
  );
};

/**
 * 判断 token 是否过期（含缓冲：提前 buffer 时间即视为过期）
 * expires_in 为 OAuth2 剩余秒数，存储时已转换为 expires_at（毫秒时间戳）
 */
export const isTokenExpire = () => {
  const userToken: UserToken = getItem(TOKEN) || {};
  const expiresAt = userToken.expires_at;
  if (expiresAt) {
    return Date.now() >= expiresAt - TOKEN_EXPIRE_BUFFER_MS;
  }
  return true;
};
