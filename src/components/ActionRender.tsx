/*
 * @Author: colpu
 * @Date: 2025-11-17 22:13:52
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-22 00:16:40
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Dropdown, MenuProps, Space } from "antd";
import { PermissionButton } from "./Permission";
import { MouseEventHandler } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
export default function ActionRender({
  onEdit,
  onDel,
  values,
  menuProps,
}: {
  onEdit?: MouseEventHandler<HTMLElement> | undefined;
  onDel?: MouseEventHandler<HTMLElement> | undefined;
  values: any;
  menuProps?: MenuProps;
}) {
  return (
    <Space
      align="start"
      split={<span style={{ color: "#eee" }}>|</span>}
      size={0}
    >
      <PermissionButton
        buttonProps={{
          size: "small",
          color: "primary",
          variant: "link",
          onClick: onEdit,
          disabled: !!values.editable,
        }}
      >
        编辑
      </PermissionButton>
      <PermissionButton
        buttonProps={{
          size: "small",
          color: "primary",
          variant: "link",
          onClick: onDel,
          disabled: values.editable,
        }}
      >
        删除
      </PermissionButton>
      {menuProps ? (
        <Dropdown
          disabled={values.editable}
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
