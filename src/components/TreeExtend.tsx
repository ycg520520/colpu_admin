/*
 * @Author: colpu
 * @Date: 2025-11-18 21:59:07
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 12:59:58
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useTreeStyle } from "@/hooks/useTreeStyle";
import { treeToPlan } from "@/utils";
import { GroupProps, ProFormCheckbox } from "@ant-design/pro-components";
import { Card, CardProps, TreeProps } from "antd";
import React, { useEffect, useState } from "react";
import TreeSearch from "./TreeSearch";

/*
 * @Author: colpu
 * @Date: 2025-11-18 15:59:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-18 21:59:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
type TreeExtendProps = {
  cardProps?: CardProps;
  onChange?: (value: any) => void;
  treeProps: TreeProps;
  checkBoxProps?: GroupProps;
  value?: any[];
};
const OPTIONS = [
  { label: "展开/折叠", value: 0 },
  { label: "全选/全不选", value: 1 },
  { label: "父子联动", value: 2 },
];
const TreeExtend: React.FC<TreeExtendProps> = (props: TreeExtendProps) => {
  const treeStyles = useTreeStyle();

  const { onChange, treeProps, cardProps, value } = props || {};
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [defaultExpandAll] = useState<boolean>(true);
  const [checkStrictly, setCheckStrictly] = useState<boolean>(true);
  const [allKey, setAllKey] = useState<any[]>([]);
  const [chekedValue, setChekedValue] = useState<any[]>([2]);
  useEffect(() => {
    const allKey = treeToPlan(treeProps.treeData).map((item: any) => item.id);
    setAllKey(allKey);
  }, [treeProps.treeData]);
  useEffect(() => {
    _setChechedValue(value || [], allKey);
    setCheckedKeys(value || []);
  }, [allKey, value]);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const _setChechedValue = (checkedKeys: any[], allKey: any[]) => {
    // 不是全选时，更改全选/全不选
    if (checkedKeys.length === allKey.length) {
      setChekedValue((prev) => {
        if (prev.includes(1)) return prev;
        return [...prev, 1];
      });
    } else {
      setChekedValue((prev) => {
        if (prev.includes(1)) return [...prev.filter((item) => item !== 1)];
        return prev;
      });
    }
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue: any) => {
    const checkedKeys = !checkStrictly
      ? checkedKeysValue
      : checkedKeysValue.checked;
    _setChechedValue(checkedKeys, allKey);
    setCheckedKeys(checkedKeys);
    onChange!(checkedKeys);
  };

  const onSelect: TreeProps["onSelect"] = () => {};

  const onChangeCheckBox = (value: number[]) => {
    // 设置checked的值
    setChekedValue(value);

    // 展开/折叠
    if (value.includes(0)) {
      setExpandedKeys(allKey);
    } else {
      setExpandedKeys([]);
    }

    // 全选/全不选
    if (value.includes(1)) {
      setCheckedKeys(allKey);
      onChange!(allKey);
    } else {
      onChange!([]);
      setCheckedKeys([]);
    }

    // 父子联动
    setCheckStrictly(!value.includes(2));
  };

  const composeCardProps: CardProps = {
    size: "small",
    title: (
      <ProFormCheckbox.Group
        layout="horizontal"
        noStyle
        fieldProps={{
          defaultValue: chekedValue,
          value: chekedValue,
          onChange: onChangeCheckBox,
        }}
        style={{ padding: 10 }}
        options={OPTIONS}
      />
    ),
    styles: {
      header: {
        padding: "0 0 0 10px",
      },
      body: {
        padding: 10,
      },
    },
    ...cardProps,
  };
  const composeTreeProps: TreeProps = {
    className: treeStyles,
    rootStyle: { maxHeight: "200px", overflowY: "auto" },
    style: { margin: 0 },
    blockNode: true,
    checkable: true,
    showLine: true,
    defaultExpandedKeys: expandedKeys,
    onExpand,
    expandedKeys,
    autoExpandParent,
    onCheck,
    checkedKeys,
    onSelect,
    selectedKeys,
    multiple: true,
    checkStrictly,
    defaultExpandAll,
    ...treeProps,
  };

  return (
    <>
      <Card {...composeCardProps}>
        <TreeSearch treeProps={{ ...composeTreeProps }} />
      </Card>
    </>
  );
};
export default TreeExtend;
