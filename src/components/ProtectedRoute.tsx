/*
 * @Author: colpu
 * @Date: 2025-06-18 08:18:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-08 17:41:48
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { hasPermissions, checkRoles } from "@/utils/permissions";
import { memo } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
  permission?: string;
}

const ProtectedRoute = memo(
  ({ children, roles, permission }: ProtectedRouteProps) => {
    const location = useLocation();
    const userStore = useAppSelector((state) => state.user);
    const isAuthenticated = userStore.isAuthenticated;
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    const hasRole = roles && checkRoles(userStore.user?.roles || [], roles);
    const hasPerms =
      permission &&
      !hasPermissions(userStore.user?.permissions || [], permission);
    if (!hasRole || hasPerms) {
      return <Navigate to="/403" replace />;
    }
    return children;
  }
);

export default ProtectedRoute;
