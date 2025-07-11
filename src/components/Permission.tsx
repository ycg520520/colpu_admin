/*
 * @Author: colpu
 * @Date: 2025-07-11 10:59:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 11:09:21
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useAppSelector } from "@/store/hooks";
import { checkPermissions } from "@/utils/permissions";

export function Permission({
  children,
  permissions,
}: {
  children: JSX.Element;
  permissions: string[];
}) {
  const userStore = useAppSelector((state) => state.user);
  const hasPermission = checkPermissions(
    userStore.user?.permissions || ["*:*"],
    permissions
  );
  return hasPermission ? children : null;
}
