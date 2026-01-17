/*
 * @Author: colpu
 * @Date: 2025-07-11 10:59:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-07 18:29:25
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useAppSelector } from "@/store/hooks";
import { hasPermissions } from "@/utils/permissions";
import { Button, Tooltip, type ButtonProps } from "antd";

export function Permission({
  children,
  permission,
}: {
  children?: React.ReactNode;
  permission?: string;
}) {
  const userStore = useAppSelector((state) => state.user);
  const flag = hasPermissions(userStore.user?.permissions || [], permission);
  return flag ? children : undefined;
}

export function PermissionButton({
  children,
  show = true,
  permission,
  buttonProps = {},
}: {
  children?: React.ReactNode;
  show?: boolean; // 是否显示按钮，默认显示
  permission?: string;
  buttonProps?: ButtonProps;
}) {
  const { user } = useAppSelector((state) => state.user);
  const flag = hasPermissions(user?.permissions || [], permission);
  let disabled = buttonProps.disabled;
  if (!flag) {
    disabled = true;
  }
  const buttonNode = (
    <Button
      {...{
        ...buttonProps,
        disabled,
      }}
    >
      {children}
    </Button>
  );
  return flag || show ? (
    flag ? (
      buttonNode
    ) : (
      <Tooltip title="暂无权限">{buttonNode}</Tooltip>
    )
  ) : null;
}
