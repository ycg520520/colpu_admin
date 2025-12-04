/*
 * @Author: colpu
 * @Date: 2025-12-01 22:36:44
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-03 08:23:01
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
import { StatusEnum } from "@/types";
export default function InitLayout() {
  const location = useLocation();
  const { status } = useAppSelector((state) => state.routes);
  const login = "/login";
  if (status === StatusEnum.FAILED && location.pathname !== login) {
    return <Navigate to={login} replace />;
  }
  return <Outlet />;
}
