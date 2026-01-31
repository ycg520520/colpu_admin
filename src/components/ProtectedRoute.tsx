/*
 * @Author: colpu
 * @Date: 2025-06-18 08:18:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 09:04:39
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { hasPermissions, checkRoles } from "@/utils/permissions";
import { memo } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permission?: string;
}
const ProtectedRoute = memo(
  ({ children, roles, permission }: ProtectedRouteProps) => {
    const { user } = useAppSelector((state) => state.user);
    const hasRole = roles && checkRoles(user?.roles || [], roles);
    const hasPerms =
      permission && !hasPermissions(user?.permissions || [], permission);
    if (!hasRole || hasPerms) {
      return <Navigate to="/403" replace />;
    }
    return children;
  },
);

export default ProtectedRoute;
