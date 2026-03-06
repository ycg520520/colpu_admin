/*
 * @Author: colpu
 * @Date: 2025-03-16 16:44:34
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 13:26:22
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { apiUser } from "@/api/user";
import ModifyPassword from "@/components/ModifyPassword";
import CustomUpload from "@/components/Upload";
import { formItemProps } from "@/constants/form";
import { submitter } from "@/constants/public";
import { useAppSelector } from "@/store/hooks";
import { urlToFileList } from "@/utils";
import { dynamicIcon } from "@/utils/public";
import { BetaSchemaForm, ProFormInstance } from "@ant-design/pro-components";
import { Col, Row, Card, Flex, Tabs, TabsProps, message } from "antd";
import { useEffect, useRef, useState } from "react";

const BaseInfo = () => {
  const formRef = useRef<ProFormInstance>(null);
  const { user } = useAppSelector((state) => state.user);
  const { dict } = useAppSelector((state) => state.dict);
  const [formData] = useState({
    id: user?.id,
    nickname: user?.nickname,
    phone: user?.phone,
    email: user?.email,
    gender: user?.gender,
    remark: user?.remark,
  });
  useEffect(() => {
    formRef.current?.setFieldsValue(formData);
  }, [formRef, formData]);

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
      valueType: "select",
      fieldProps: {
        options: dict.gender.options,
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
    const params = { ...formData, ...values }; // 这里用户可能重置表单，导致id丢失，所以需要重新赋值
    await apiUser(params, "put");
    message.success("修改成功");
    return true;
  }
  async function onReset() {
    formRef.current?.setFieldsValue(formData);
  }

  return (
    <BetaSchemaForm
      formRef={formRef}
      style={{ width: 500 }}
      layout="horizontal"
      submitter={submitter}
      onFinish={onFinish}
      onReset={onReset}
      columns={columns}
    />
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
  const [avatar, setAvatar] = useState<any>([]);
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(
        urlToFileList({ url: user?.avatar, uid: "-1", status: "done" }),
      );
    }
  }, [user]);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "基本资料",
      children: <BaseInfo />,
    },
    {
      key: "2",
      label: "修改密码",
      children: <ModifyPassword dataSource={user} />,
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
            <CustomUpload
              isAvatar
              fileList={avatar}
              onChange={({ fileList }) => {
                setAvatar(fileList);
              }}
              uploadProps={{
                listType: "picture-circle",
                style: { width: 100, height: 100 },
              }}
              uploadType="single"
            />
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
