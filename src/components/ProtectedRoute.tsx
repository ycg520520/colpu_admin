/*
 * @Author: colpu
 * @Date: 2025-06-18 08:18:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 10:57:45
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
  permissions?: string[];
}

const ProtectedRoute = memo(({
  children,
  roles,
  permissions,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const userStore = useAppSelector((state) => state.user);
  const isAuthenticated = userStore.isAuthenticated;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const hasRole = roles && checkRoles(userStore.user?.roles || [], roles);
  const hasPermissions =
    permissions &&
    !hasPermissions(userStore.user?.permissions || [], permissions);
  if (!hasRole || hasPermissions) {
    return <Navigate to="/403" replace />;
  }
  return children;
});

export default ProtectedRoute;
