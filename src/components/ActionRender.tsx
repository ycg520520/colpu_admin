/*
 * @Author: colpu
 * @Date: 2025-11-17 22:13:52
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-02 12:53:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Dropdown, MenuProps, Space } from "antd";
import { PermissionButton } from "./Permission";
import { MouseEventHandler } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
export interface ActionPermissions {
  add?: string; // 添加权限
  edit?: string; // 编辑权限
  del?: string; // 删除权限
}
export interface ActionDisableds {
  add?: boolean | undefined; // 添加权限
  edit?: boolean | undefined; // 编辑权限
  del?: boolean | undefined; // 删除权限
  dropdown?: boolean | undefined;
}
export interface ActionRenderProps {
  onAdd?: MouseEventHandler<HTMLElement> | undefined;
  onEdit?: MouseEventHandler<HTMLElement> | undefined;
  onDel?: MouseEventHandler<HTMLElement> | undefined;
  menuProps?: MenuProps;
  disableds?: ActionDisableds;
  permissions?: ActionPermissions;
  children?: React.ReactNode;
}
export default function ActionRender({
  onAdd,
  onEdit,
  onDel,
  menuProps,
  disableds = {},
  permissions = {},
  children,
}: ActionRenderProps) {
  return (
    <Space
      align="start"
      split={<span style={{ color: "#eee" }}>|</span>}
      size={0}
    >
      {onAdd ? (
        <PermissionButton
          buttonProps={{
            size: "small",
            color: "primary",
            variant: "link",
            onClick: onAdd,
            disabled: disableds.add,
          }}
          permission={permissions.add}
        >
          添加
        </PermissionButton>
      ) : null}
      <PermissionButton
        buttonProps={{
          size: "small",
          color: "primary",
          variant: "link",
          onClick: onEdit,
          disabled: disableds.edit,
        }}
        permission={permissions.edit}
      >
        编辑
      </PermissionButton>
      <PermissionButton
        buttonProps={{
          size: "small",
          color: "primary",
          variant: "link",
          onClick: onDel,
          disabled: disableds.del,
        }}
        permission={permissions.del}
      >
        删除
      </PermissionButton>
      {children}
      {menuProps ? (
        <Dropdown
          disabled={disableds.dropdown}
          menu={menuProps}
          placement="bottomRight"
          arrow
        >
          <Button size="small" color="primary" variant="link">
            <EllipsisOutlined />
          </Button>
        </Dropdown>
      ) : null}
    </Space>
  );
}
