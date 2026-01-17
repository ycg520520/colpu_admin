/*
 * @Author: colpu
 * @Date: 2025-12-01 22:36:44
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-08 22:21:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
/*
 * @Author: colpu
 * @Date: 2025-11-23 13:02:45
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 20:06:11
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";
export default function InitLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const login = "/login";
  if (!isAuthenticated && location.pathname !== login) {
    return <Navigate to={login} replace />;
  }
  return <Outlet />;
}
