/*
 * @Author: colpu
 * @Date: 2026-01-04 14:38:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-16 09:12:22
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import {
  ModalForm,
  ProForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { useEffect } from "react";
import { Col, message, Row } from "antd";
import { colProps, formItemCol, formItemProps } from "@/constants/form";
import RichTextEditor from "@/components/RichTextEditor";
import { useAppSelector } from "@/store/hooks";
import { cloneDeep } from "lodash";
import dayjs from "dayjs";
const NoticeForm = (props: any) => {
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
        label="通知ID"
        formItemProps={{ style: { display: "none" } }}
        fieldProps={{ disabled: true }}
      />

      <ProFormText
        name="title"
        label="通知标题"
        colProps={colProps}
        formItemProps={{
          ...formItemProps,
          rules: [{ required: true, message: "必须输入标签名称" }],
        }}
      />
      <ProFormSelect
        name="type"
        label="公告类型"
        colProps={colProps}
        formItemProps={{
          ...formItemProps,
          rules: [{ required: true, message: "必须选择公告类型" }],
        }}
        initialValue={1}
        fieldProps={{
          placeholder: "请选择栏目类型",
          options: dict.notice_type ? dict.notice_type.options : [],
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
        <ProForm.Item name="content" label="通知内容" {...formItemCol(4)}>
          <RichTextEditor />
        </ProForm.Item>
      </Col>
    </ModalForm>
  );
};

export default NoticeForm;
