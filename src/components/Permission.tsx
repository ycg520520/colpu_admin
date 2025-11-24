/*
 * @Author: colpu
 * @Date: 2025-07-11 10:59:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-16 23:21:57
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useAppSelector } from "@/store/hooks";
import { checkPermissions } from "@/utils/permissions";
import { Button, type ButtonProps } from "antd";

export function Permission({
  children,
  permissions = ["*:*:*"],
}: {
  children?: React.ReactNode;
  permissions?: string[];
}) {
  const userStore = useAppSelector((state) => state.user);
  const hasPermission = checkPermissions(
    userStore.user?.permissions || ["*:*:*"],
    permissions
  );
  return hasPermission ? children : undefined;
}
export function PermissionButton({
  children,
  showChildren = true,
  permissions = ["*:*:*"],
  buttonProps = {},
}: {
  children?: React.ReactNode;
  showChildren?: boolean;
  permissions?: string[];
  buttonProps?: ButtonProps;
}) {
  const userStore = useAppSelector((state) => state.user);
  const hasPermission = checkPermissions(
    userStore.user?.permissions || ["*:*:*"],
    permissions
  );
  let disabled: boolean | undefined = false;
  if (hasPermission) {
    disabled = buttonProps.disabled;
  } else {
    disabled = true;
  }
  return hasPermission || showChildren ? (
    <Button
      {...{
        ...buttonProps,
        disabled,
      }}
    >
      {children}
    </Button>
  ) : null;
}
