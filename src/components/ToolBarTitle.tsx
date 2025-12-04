import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useEffect, useState } from "react";
import { PermissionButton } from "./Permission";

/*
 * @Author: colpu
 * @Date: 2025-11-14 12:24:53
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-02 16:16:14
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
    isExpanded,
    addProps,
    buttons = [],
    permissions = {},
  } = props;
  const [isExpand, setIsExpand] = useState(false); // 是否展开
  useEffect(() => {
    setIsExpand(isExpanded);
  }, [isExpanded]);
  const { text = "新增", ...restAddProps } = addProps || {};
  const addBtnProps = {
    icon: <PlusOutlined />,
    type: "primary",
    onClick: onAdd,
    ...restAddProps,
  };
  return (
    <Space>
      <PermissionButton buttonProps={addBtnProps}>{text}</PermissionButton>
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
            setIsExpand(!isExpand);
            onExpand(e, isExpand);
          }}
        >
          {isExpand ? "收起" : "展开"}
        </Button>
      ) : null}
    </Space>
  );
}
