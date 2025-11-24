import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useEffect, useState } from "react";
import { PermissionButton } from "./Permission";

/*
 * @Author: colpu
 * @Date: 2025-11-14 12:24:53
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-16 23:12:07
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
  } = props;
  const [isExpand, setIsExpand] = useState(false); // 是否展开
  useEffect(() => {
    setIsExpand(isExpanded);
  }, [isExpanded]);
  return (
    <Space>
      <PermissionButton
        buttonProps={{
          icon: <PlusOutlined />,
          type: "primary",
          onClick: onAdd,
        }}
      >
        新增
      </PermissionButton>
      {onEdit ? (
        <PermissionButton
          buttonProps={{
            color: "blue",
            variant: "dashed",
            disabled,
            onClick: onEdit,
          }}
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
        >
          删除
        </PermissionButton>
      ) : null}
      {onExport ? (
        <PermissionButton
          buttonProps={{
            color: "pink",
            variant: "dashed",
            onClick: onExport,
          }}
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
