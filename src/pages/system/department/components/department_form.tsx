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
import { RADIO_STATUS } from "@/constants";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { getDepartmentTree } from "@/api/departments";

const DepartmentForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);
  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    getDepartmentTree().then((res) => {
      setTreeData(res);
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
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "上级菜单",
      dataIndex: "parent_id",
      valueType: "treeSelect",
      formItemProps: formItemPropsFull,
      colProps: colPropsFull,
      treeData,
      fieldProps: {
        showSearch: true,
        placeholder: "请选择上级菜单",
        fieldNames: {
          label: "name",
          value: "id",
          children: "children",
        },
        treeData,
      },
    },
    {
      title: "部门名称",
      name: "name",
      colProps: colPropsFull,
      formItemProps: {
        ...formItemPropsFull,
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "部门编码",
      name: "code",
      colProps: colPropsFull,
      formItemProps: {
        ...formItemPropsFull,
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "负责人",
      name: "leader_id",
      colProps: colPropsFull,
      formItemProps: {
        ...formItemPropsFull,
        rules: [{ required: true, message: "请输入用户昵称" }],
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
      colProps,
      formItemProps,
    },
    {
      title: "状态",
      name: "status",
      valueType: "radio",
      fieldProps: {
        defaultValue: 1,
        options: RADIO_STATUS,
      },
      colProps,
      formItemProps,
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

export default DepartmentForm;
