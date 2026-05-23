import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, type ButtonProps } from "antd";
import { PermissionButton } from "./Permission";

/*
 * @Author: colpu
 * @Date: 2025-11-14 12:24:53
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-05-23 14:26:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export default function ToolBarTitle(props: any) {
  const {
    disabled,
    onAdd,
    onEdit,
    onDel,
    onExport,
    onClose,
    onExpand,
    isExpanded = false,
    addProps,
    buttons = [],
    permissions = {},
  } = props;
  const {
    text = "新增",
    icon: addIcon = <PlusOutlined />,
    ...restAddProps
  } = addProps || {};
  const addBtnProps: ButtonProps = {
    type: "primary",
    onClick: onAdd,
    ...restAddProps,
  };
  if (addIcon !== false && addIcon !== null) {
    addBtnProps.icon = addIcon;
  }
  return (
    <Space>
      <PermissionButton buttonProps={addBtnProps} permission={permissions.add}>
        {text}
      </PermissionButton>
      {onEdit ? (
        <PermissionButton
          buttonProps={{
            color: "blue",
            variant: "dashed",
            disabled,
            onClick: onEdit,
          }}
          permission={permissions.edit}
        >
          修改
        </PermissionButton>
      ) : null}
      {onDel ? (
        <PermissionButton
          buttonProps={{
            color: "danger",
            variant: "dashed",
            disabled,
            onClick: onDel,
          }}
          permission={permissions.del}
        >
          删除
        </PermissionButton>
      ) : null}
      {...buttons}
      {onExport ? (
        <PermissionButton
          buttonProps={{
            color: "pink",
            variant: "dashed",
            onClick: onExport,
          }}
          permission={permissions.export}
        >
          导出
        </PermissionButton>
      ) : null}
      {onClose ? (
        <Button color="cyan" variant="dashed" onClick={onClose}>
          关闭
        </Button>
      ) : null}
      {onExpand ? (
        <Button
          color="cyan"
          variant="dashed"
          onClick={(e) => {
            onExpand(e, isExpanded);
          }}
        >
          {isExpanded ? "收起" : "展开"}
        </Button>
      ) : null}
    </Space>
  );
}
