/*
 * @Author: colpu
 * @Date: 2026-01-04 14:38:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-07 15:23:51
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { useEffect } from "react";
import { message } from "antd";
import {
  formItemCol
} from "@/constants/form";
const TagForm = (props: any) => {
  const { title, open, isEdit, editData, modalProps, formRef } = props;
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);

  const onCancel = () => {
    formRef.current?.resetFields();
    modalProps.onCancel();
  };
  const onFinish = async (values: any) => {
    await props.onFinish(values);
    message.success("提交成功");
    return true;
  };
  return (
    <ModalForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      grid
      {...formItemCol(6)}
      layout="horizontal"
      modalProps={{
        width: 480,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel,
      }}
      open={open}
      onFinish={onFinish}
    >
      <ProFormText
        name="id"
        label="栏目ID"
        formItemProps={{ style: { display: "none" } }}
        fieldProps={{ disabled: true }}
      />
      <ProFormText
        name="name"
        label="标签名称"
        formItemProps={{
          rules: [{ required: true, message: "必须输入标签名称" }],
        }}
      />
      <ProFormText
        name="code"
        label="标签标识"
        formItemProps={{
          rules: [{ required: true, message: "必须输入标签标识" }],
        }}
      />
    </ModalForm>
  );
};

export default TagForm;
