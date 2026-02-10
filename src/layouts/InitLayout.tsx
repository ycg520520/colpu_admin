/*
 * @Author: colpu
 * @Date: 2025-12-08 22:21:27
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-02 20:48:07
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";
export default function InitLayout() {
  const location = useLocation();
  const { userToken } = useAppSelector((state) => state.user);
  const login = "/login";
  if (!userToken && location.pathname !== login) {
    return <Navigate to={login} replace />;
  }
  return <Outlet />;
}
