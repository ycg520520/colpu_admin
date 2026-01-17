/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { message } from "antd";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import TreeExtend from "@/components/TreeExtend";
import { getMenusTree } from "@/api/menus";
import { cloneDeep } from "lodash";

const AddPermForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { dict } = useAppSelector((state) => state.dict);
  const [type, setType] = useState("api");
  const [showDept, setShowDept] = useState(true);
  const treeData = useAppSelector((state) => cloneDeep(state.dept.treeData));
  const [menuTreeData, setMenuTreeData] = useState([]);
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
    setType(editData?.type || "api");
  }, [editData, formRef]);
  useEffect(() => {
    getMenusTree().then((rows) => {
      setMenuTreeData(rows);
    });
  }, []);

  const [halfMenus, setHalfMenus] = useState([]);
  const onHalfChange = (value: any) => {
    setHalfMenus(value);
  };

  const formColumns = [
    {
      title: "ID",
      dataIndex: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "权限类型",
      dataIndex: "type",
      valueType: "select",
      colProps: type === "menu" ? colProps : colPropsFull,
      formItemProps: {
        ...(type === "menu" ? formItemProps : formItemPropsFull),
        rules: [{ required: true, message: "请选择权限类型" }],
      },
      fieldProps: {
        defaultValue: type,
        onChange: (value: any) => {
          setType(value);
        },
        options: dict.perm_type.options.map((item: any) => {
          return {
            label: item.label,
            value: item.code,
          };
        }),
      },
    },
    {
      title: "权限名称",
      dataIndex: "name",
      colProps,
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入权限名称" }],
      },
    },
    // {
    //   title: "分配角色",
    //   dataIndex: "role_ids",
    //   colProps,
    //   formItemProps,
    // },
    // {
    //   title: "分配用户",
    //   dataIndex: "user_ids",
    //   colProps,
    //   formItemProps,
    // },
    ...(type === "menu"
      ? [
          {
            title: "菜单权限",
            dataIndex: "menu_ids",
            valueType: "treeSelect",
            fieldProps: {
              showSearch: true,
              fieldNames: {
                label: "title",
                value: "id",
                children: "children",
              },
            },
            colProps: colPropsFull,
            formItemProps: formItemPropsFull,
            renderFormItem: () => {
              return (
                <TreeExtend
                  onHalfChange={onHalfChange}
                  treeProps={{
                    fieldNames: {
                      title: "title",
                      key: "id",
                      children: "children",
                    },
                    checkable: true,
                    treeData: menuTreeData,
                  }}
                />
              );
            },
          },
        ]
      : []),
    ...(type === "api"
      ? [
          {
            title: "权限编码",
            dataIndex: "perm_code",
            colProps,
            formItemProps: {
              ...formItemProps,
              rules: [{ required: true, message: "请输入权限编码" }],
            },
          },
          {
            title: "接口方法",
            dataIndex: "method",
            colProps,
            formItemProps: {
              ...formItemProps,
              rules: [{ required: true, message: "请选择接口方法" }],
            },
            valueType: "select",
            fieldProps: {
              options: dict.method.options.map((item: any) => ({
                label: item.label,
                value: item.code,
              })),
            },
          },
          {
            title: "接口地址",
            dataIndex: "path",
            colProps,
            formItemProps: {
              ...formItemProps,
              rules: [{ required: true, message: "请输入接口地址" }],
            },
          },
        ]
      : []),
    ...(type === "scope"
      ? [
          {
            title: "权限范围",
            name: "scope_type",
            dataIndex: "scope_type",
            valueType: "select",
            fieldProps: {
              defaultValue: dict.scope_type.defaultValue || 4,
              options: dict.scope_type.options, // 状态字典
              onChange: (value: number) => {
                setShowDept(value === 4);
              },
            },
            colProps,
            formItemProps,
          },
          ...(showDept
            ? [
                {
                  title: "数据权限",
                  name: "config",
                  dataIndex: "config",
                  valueType: "treeSelect",
                  fieldProps: {
                    showSearch: true,
                    fieldNames: {
                      label: "title",
                      value: "id",
                      children: "children",
                    },
                  },
                  colProps: colPropsFull,
                  formItemProps: formItemPropsFull,
                  renderFormItem: () => {
                    return (
                      <TreeExtend
                        initCheckboxValue={[0, 2]}
                        treeProps={{
                          fieldNames: {
                            title: "name",
                            key: "id",
                            children: "children",
                          },
                          treeData,
                        }}
                      />
                    );
                  },
                },
              ]
            : []),
        ]
      : []),
    {
      title: "排序",
      dataIndex: "sort_order",
      valueType: "digit",
      fieldProps: {
        min: 0,
        max: 1e10,
      },
      colProps,
      formItemProps,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "radio",
      fieldProps: {
        defaultValue: 1,
        options: dict.enabled_status.options, // 状态字典
      },
      colProps,
      formItemProps,
    },
    {
      title: "权限描述",
      dataIndex: "remark",
      valueType: "textarea",
      colProps: colPropsFull,
      formItemProps: formItemPropsFull,
    },
  ];

  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      grid
      layout="horizontal"
      shouldUpdate={(newValues, oldValues) => {
        return newValues !== oldValues;
      }}
      modalProps={{
        width: 640,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel: () => {
          formRef.current?.resetFields();
          modalProps.onCancel();
        },
      }}
      open={open}
      layoutType="ModalForm"
      onReset={() => {
        console.log("reset");
      }}
      onFinish={async (values: any) => {
        debugger
        if (halfMenus.length && values.menu_ids) {
          values.menu_ids.push(...halfMenus);
        }
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={formColumns.filter((item) => !!item)}
    />
  );
};

export default AddPermForm;
