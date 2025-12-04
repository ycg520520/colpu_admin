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
import { message } from "antd";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { useAppSelector } from "@/store/hooks";

const PostForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { dict } = useAppSelector((state) => state.dict);
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);

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
      title: "角色名称",
      name: "name",
      colProps: colPropsFull,
      formItemProps: {
        ...formItemPropsFull,
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "岗位编码",
      name: "code",
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
        options: dict.enabled_status.options, // 状态字典
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

export default PostForm;
