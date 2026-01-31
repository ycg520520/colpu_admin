/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect } from "react";
import { colProps, formItemCol } from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import { message } from "antd";

const RoleForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { dict } = useAppSelector((state) => state.dict);
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);
  const formColumns = [
    {
      title: "ID",
      dataIndex: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      formItemProps: formItemCol(6),
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "角色名称",
      dataIndex: "name",
      formItemProps: {
        ...formItemCol(6),
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "角色编码",
      dataIndex: "code",
      formItemProps: {
        ...formItemCol(6),
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "排序",
      dataIndex: "sort_order",
      valueType: "digit",
      fieldProps: {
        min: 0,
        max: 1e10,
      },
      colProps: colProps,
      formItemProps: formItemCol(12),
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "radio",
      fieldProps: {
        defaultValue: 1,
        options: dict.enabled_status.options, // 状态字典
      },
      colProps: colProps,
      formItemProps: {
        ...formItemCol(5),
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
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
      onFinish={async (values: any) => {
        // 将办选加入到设置中
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={formColumns.filter((item) => !!item)}
    />
  );
};

export default RoleForm;
