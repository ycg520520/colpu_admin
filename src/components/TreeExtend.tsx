/*
 * @Author: colpu
 * @Date: 2025-11-18 21:59:07
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-06 23:45:36
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useTreeStyle } from "@/hooks/useTreeStyle";
import { filterParentId, treeToPlan } from "@/utils";
import { GroupProps, ProFormCheckbox } from "@ant-design/pro-components";
import { Card, CardProps, TreeProps } from "antd";
import React, { useEffect, useState } from "react";
import TreeSearch from "./TreeSearch";
import { composeTreeFieldNames } from "@/utils/public";

type TreeExtendProps = {
  cardProps?: CardProps;
  onChange?: (value: any) => void;
  onHalfChange?: (value: any) => void;
  treeProps: TreeProps;
  checkBoxProps?: GroupProps;
  value?: any[];
  initCheckboxValue?: number[];
  hasHalfCheckedKeys?: boolean;
};
const OPTIONS = [
  { label: "展开/折叠", value: 0 },
  { label: "全选/全不选", value: 1 },
  { label: "父子联动", value: 2 },
];
const TreeExtend: React.FC<TreeExtendProps> = (props: TreeExtendProps) => {
  const treeStyles = useTreeStyle();
  const {
    onChange,
    onHalfChange,
    treeProps,
    cardProps,
    value,
    initCheckboxValue = [2],
  } = props || {};
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [defaultExpandAll] = useState<boolean>(true);
  const [checkStrictly, setCheckStrictly] = useState<boolean>(true);
  const [allKey, setAllKey] = useState<any[]>([]);
  const [checkboxValue, setCheckboxValue] =
    useState<number[]>(initCheckboxValue);
  const onChangeCheckBox = (value: number[]) => {
    console.log("prev", checkboxValue, "new", value);
    // 当折叠时，将折叠Keys置空
    if (checkboxValue.includes(0) && !value.includes(0)) {
      setExpandedKeys([]);
    }
    // 当全不选时，将选择Keys置空
    if (checkboxValue.includes(1) && !value.includes(1)) {
      setCheckedKeys([]);
    }
    // 父子联动
    if (checkboxValue.includes(2) && !value.includes(2)) {
      setCheckStrictly(true);
    }

    // 展开/折叠
    if (value.includes(0)) {
      setExpandedKeys(allKey);
    }
    // 全选
    if (value.includes(1)) {
      setCheckedKeys(allKey);
    }
    // 父子联动
    if (value.includes(2)) {
      setCheckStrictly(false);
    }
    // 当全不选时，将选择Keys置空
    if (checkboxValue.includes(1) && !value.includes(1)) {
      onChange!([]);
    }
    // 全选
    if (value.includes(1)) {
      onChange!(allKey);
    }
    // 设置checked的值
    setCheckboxValue(value);
  };

  // 设置checkbox选择框的值
  const setCheckedboxSelected = (checkedKeys: any[], allKey: any[]) => {
    if (checkedKeys && checkedKeys.length === allKey.length) {
      setCheckboxValue((prev) => {
        if (prev.includes(1)) {
          return prev;
        } else {
          return [...prev, 1];
        }
      });
    } else {
      setCheckboxValue((prev) => {
        if (prev.includes(1)) {
          return [...prev.filter((item) => item !== 1)];
        } else {
          return prev;
        }
      });
    }
  };
  // 1、初始化值
  useEffect(() => {
    const fieldNames = composeTreeFieldNames(treeProps.fieldNames);
    const allIds = treeToPlan(treeProps.treeData)
      .map((item: any) => {
        if (item[fieldNames.disabled]) return undefined;
        return item[fieldNames.key];
      })
      .filter(Boolean);
    setAllKey(allIds);
    setCheckedboxSelected(value || [], allIds);
    const filterKeys = filterParentId(
      treeProps.treeData || [],
      value || [],
      fieldNames.key
    );
    setCheckedKeys(filterKeys);
    if (checkboxValue.includes(0)) {
      setExpandedKeys(allIds);
    }
    if (checkboxValue.includes(2)) {
      setCheckStrictly(false);
    }
  }, [checkboxValue, treeProps, value]);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps["onCheck"] = (
    checkedKeysValue: any,
    { halfCheckedKeys }
  ) => {
    // 父子联动模式下，checkedKeysValue为数组，否则为对象
    const checkedKeys = !checkStrictly
      ? checkedKeysValue
      : checkedKeysValue.checked;
    setCheckedboxSelected(checkedKeys, allKey);
    setCheckedKeys(checkedKeys);
    if (onChange) {
      onChange(checkedKeys);
    }
    if (onHalfChange) {
      onHalfChange(halfCheckedKeys);
    }
  };

  const composeCardProps: CardProps = {
    size: "small",
    title: (
      <ProFormCheckbox.Group
        layout="horizontal"
        noStyle
        fieldProps={{
          value: checkboxValue,
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
    onExpand,
    expandedKeys,
    autoExpandParent,
    onCheck,
    checkedKeys,
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
