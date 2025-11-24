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
import { RADIO_STATUS } from "@/constants";
import { formItemCol } from "@/constants/form";
import { getMenusTree } from "@/api/menus";
import TreeExtend from "@/components/TreeExtend";
import { App } from "antd";

const RoleForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);
  const { message } = App.useApp();

  useEffect(() => {
    getMenusTree().then((rows) => {
      setTreeData(rows);
    });
  }, []);

  // form 表单配置
  const formColumns = [
    {
      title: "ID",
      name: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      formItemProps: formItemCol(6),
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "角色名称",
      name: "name",
      formItemProps: {
        ...formItemCol(6),
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "权限字符",
      name: "code",
      formItemProps: {
        ...formItemCol(6),
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "菜单权限",
      name: "menu_ids",
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
      formItemProps: formItemCol(6),
      renderFormItem: () => {
        return (
          <TreeExtend
            treeProps={{
              fieldNames: {
                title: "title",
                key: "id",
                children: "children",
              },
              defaultCheckedKeys: editData?.menu_ids || [],
              treeData,
            }}
          />
        );
      },
    },
    {
      title: "排序",
      name: "sort_order",
      valueType: "digit",
      fieldProps: {
        min: 0,
        max: 1e10,
      },
      formItemProps: formItemCol(6),
    },
    {
      title: "状态",
      name: "status",
      valueType: "radio",
      fieldProps: {
        defaultValue: 1,
        options: RADIO_STATUS,
      },
      formItemProps: formItemCol(6),
    },
    {
      name: "remark",
      title: "备注",
      valueType: "textarea",
      formItemProps: formItemCol(6),
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
      onFinish={async (values) => {
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={formColumns.filter((item) => !!item)}
    />
  );
};

export default RoleForm;
