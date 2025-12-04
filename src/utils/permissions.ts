/*
 * @Author: colpu
 * @Date: 2025-06-18 00:11:32
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-02 11:59:30
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
  permission?: string
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
  requiredRoles: string[]
): boolean => {
  return (
    userRoles.every((p) => requiredRoles.includes(p)) || userRoles.includes("*")
  );
};
