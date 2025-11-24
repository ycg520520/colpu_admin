/*
 * @Author: colpu
 * @Date: 2025-11-06 22:20:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 15:27:47
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import DynamicForm from "./index";
import { DynamicField, DynamicFormRef } from "./types";
import { App, Modal } from "antd";
import { useImperativeHandle, useRef, forwardRef, useEffect } from "react";

export interface ModalFromProps {
  visible?: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  isEdit?: boolean;
  initialValues?: any[];
  fields: DynamicField[];
}
const ModalForm = forwardRef<any, ModalFromProps>((props, ref) => {
  const { visible, isEdit, initialValues, onCancel, onSubmit, title, fields } =
    props;
  const { message } = App.useApp();

  const formRef = useRef<DynamicFormRef>(null);
  useImperativeHandle(ref, () => formRef.current!); // 暴露方法给父组件

  // 监听visible变化，重置表单
  useEffect(() => {
    if (!visible) {
      formRef.current?.reset();
    }
  }, [formRef, visible]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.submit();
      console.log("表单数据:", values);
      await onSubmit(values); // 提交数据
      message.success("提交成功！");
    } catch {
      message.error("请检查表单填写是否正确");
    }
  };

  // 关闭弹窗时重置
  const handleCancel = () => {
    formRef.current?.reset();
    message.info("表单已重置");
    onCancel();
  };

  return (
    <Modal
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={560}
      styles={{
        body: { paddingTop: 10 },
        footer: { textAlign: "center" },
      }}
    >
      <DynamicForm
        ref={formRef}
        fields={fields}
        initialValues={initialValues}
        onFieldsChange={(fields: any, allFields: any) => {
          console.log("字段变化:", fields, allFields);
        }}
        onValuesChange={(value: any, values: any) => {
          console.log("值变化:", value, values);
        }}
        onFinish={handleSubmit}
        formProps={{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }}
      />
    </Modal>
  );
});

export default ModalForm;
