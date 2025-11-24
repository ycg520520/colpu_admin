import OSSUpload from "@/components/OSSUpload";
import { GENDER_TYPE } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { dynamicIcon } from "@/utils/public";
import {
  BetaSchemaForm,
  ProFormInstance,
  SubmitterProps,
} from "@ant-design/pro-components";
import { Col, Row, Card, Flex, Tabs, TabsProps, Form, Space, App } from "antd";
import useMessage from "antd/lib/message/useMessage";
import { useRef, useState } from "react";

/*
 * @Author: colpu
 * @Date: 2025-03-16 16:44:34
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 15:02:06
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
const formItemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const submitter: SubmitterProps = {
  render: (_, dom) => (
    <Form.Item
      wrapperCol={{
        offset: 6,
        span: 18,
      }}
    >
      <Space>
        {dom[0]}
        {dom[1]}
      </Space>
    </Form.Item>
  ),
};
const BaseInfo = () => {
  const { message } = App.useApp();
  const formRef = useRef<ProFormInstance>(null);
  const { user } = useAppSelector((state) => state.user);
  const [formData] = useState({
    id: user?.id,
    nickname: user?.nickname,
    phone: user?.phone,
    email: user?.email,
    gender: user?.gender,
    remark: user?.remark,
  });
  formRef.current?.setFieldsValue(formData);
  const columns = [
    {
      title: "用户ID",
      name: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      formItemProps: {
        ...formItemProps,
        style: { display: "none" },
      },
    },

    {
      title: "用户昵称",
      name: "nickname",
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    {
      title: "手机号",
      name: "phone",
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户手机号" }],
      },
    },
    {
      title: "用户邮箱",
      name: "email",
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户邮箱" }],
      },
    },
    {
      title: "性别",
      name: "gender",
      valueType: "radio",
      fieldProps: {
        options: GENDER_TYPE,
      },
      formItemProps,
    },
    {
      name: "remark",
      title: "个性签名",
      valueType: "textarea",
      formItemProps,
    },
  ];
  async function onFinish(values: any) {
    console.log(values);
  }

  return (
    <BetaSchemaForm
      formRef={formRef}
      style={{ width: 500 }}
      layout="horizontal"
      submitter={submitter}
      onFinish={async (values) => {
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={columns}
    />
  );
};
const ModifyPassword = () => {
  const { message } = App.useApp();
  const formRef = useRef<ProFormInstance>(null);
  const { user } = useAppSelector((state) => state.user);
  const [formData] = useState({
    id: user?.id,
  });
  formRef.current?.setFieldsValue(formData);
  const columns = [
    {
      title: "用户ID",
      name: "id",
      fieldProps: {
        disabled: true,
      },
      formItemProps: {
        style: { display: "none" }, // 隐藏掉不占用空间
      },
    },
    {
      name: "password",
      title: "用户密码",
      fieldProps: {
        type: "password",
        allowClear: true,
      },
      formItemProps: {
        ...formItemProps,
        hasFeedback: true,
        rules: [{ required: true, message: "必须输入密码" }],
      },
    },
    {
      title: "确认密码",
      name: "confirm_password",
      fieldProps: {
        type: "password",
        allowClear: true,
      },
      formItemProps: {
        ...formItemProps,
        dependencies: ["password"],
        hasFeedback: true,
        rules: [
          { required: true, message: "请确认用户密码" },
          {
            validator(_: any, value: string) {
              if (
                !value ||
                formRef.current?.getFieldValue("password") === value
              ) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次密码不一致"));
            },
          },
        ],
      },
    },
  ];
  async function onFinish(values: any) {
    console.log(values);
  }

  return (
    <>
      {JSON.stringify(formData)}
      <BetaSchemaForm
        formRef={formRef}
        style={{ width: 500 }}
        layout="horizontal"
        submitter={submitter}
        onFinish={async (values) => {
          await onFinish(values);
          message.success("提交成功");
          return true;
        }}
        columns={columns}
      />
    </>
  );
};

export default function Account() {
  const { user } = useAppSelector((state) => state.user);
  const dataSource = [
    { icon: "UserOutlined", label: "用户名称", value: user?.username },
    { icon: "PhoneOutlined", label: "手机号码", value: user?.phone },
    { icon: "MailOutlined", label: "用户邮箱", value: user?.email },
    {
      icon: "ApartmentOutlined",
      label: "所属部门",
      value: "研发部门 / 董事长",
    },
    { icon: "TeamOutlined", label: "所属角色", value: "超级管理员" },
    { icon: "FieldTimeOutlined", label: "创建日期", value: user?.created_at },
  ];
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "基本资料",
      children: <BaseInfo />,
    },
    {
      key: "2",
      label: "修改密码",
      children: <ModifyPassword />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card
          variant="borderless"
          title="个人信息"
          styles={{
            body: { padding: "16px 0" },
          }}
        >
          <Flex justify="center" style={{ marginBottom: 16 }}>
            <OSSUpload isAvatar returnType="url" style={{ margin: "0 auto" }} />
          </Flex>
          {...dataSource.map((item, index) => (
            <Flex
              style={{ padding: "8px 16px", borderTop: "1px solid #f0f0f0" }}
              key={index}
              justify="space-between"
              align="center"
            >
              <div>
                {dynamicIcon(item.icon)}&nbsp;
                {item.label}
              </div>
              <div style={{ color: "#999" }}>{item.value}</div>
            </Flex>
          ))}
        </Card>
      </Col>
      <Col span={18}>
        <Card variant="borderless" title="基本资料">
          <Tabs
            defaultActiveKey="1"
            size="small"
            items={items}
            onChange={onChange}
          />
        </Card>
      </Col>
    </Row>
  );
}
