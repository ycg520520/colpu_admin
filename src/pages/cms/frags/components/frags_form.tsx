/*
 * @Author: colpu
 * @Date: 2026-01-27 16:34:25
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-10 16:52:50
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useEffect } from "react";
import { Col, message } from "antd";
import { colProps, formItemCol, formItemProps } from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
const FragsForm = (props: any) => {
  const { title, open, isEdit, editData, modalProps, formRef } = props;
  const { dict } = useAppSelector((state) => state.dict);

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
      {...formItemCol(4)}
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
        label="碎片ID"
        formItemProps={{ style: { display: "none" } }}
        fieldProps={{ disabled: true }}
      />

      <ProFormText
        name="title"
        label="碎片标题"
        colProps={colProps}
        formItemProps={{
          ...formItemProps,
          rules: [{ required: true, message: "必须输入碎片标题" }],
        }}
      />
      <ProFormDateTimePicker
        name="published_at"
        label="发布时间"
        colProps={colProps}
        formItemProps={formItemProps}
        initialValue={dayjs().format("YYYY-MM-DD HH:mm:ss")}
        fieldProps={{ style: { width: "100%" } }}
      />
      <ProFormText
        name="type"
        label="碎片类型"
        colProps={colProps}
        formItemProps={{
          ...formItemProps,
          rules: [
            {
              pattern: /^[A-Za-z][A-Za-z0-9_]*$/,
              required: true,
              message: "必须输入碎片类型",
            },
          ],
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        colProps={colProps}
        formItemProps={formItemProps}
        fieldProps={{
          defaultValue: 1,
          options: dict.enabled_status.options,
        }}
      />
      <Col span={24}>
        <ProFormTextArea
          name="content"
          label="碎片内容"
          fieldProps={{
            rows: 4,
            showCount: true,
            maxLength: 500,
          }}
          {...formItemCol(4)}
        />
      </Col>
    </ModalForm>
  );
};

export default FragsForm;
