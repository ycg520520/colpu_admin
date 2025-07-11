/*
 * @Author: colpu
 * @Date: 2025-06-18 00:11:32
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 23:13:44
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

export const checkPermissions = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every((p) => userPermissions.includes(p));
};

export const checkRoles = (
  userRoles: string[],
  requiredRoles: string[]
): boolean => {
  return (
    userRoles.every((p) => requiredRoles.includes(p)) || userRoles.includes("*")
  );
};
