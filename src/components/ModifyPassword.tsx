import { apiUser } from "@/api/user";
import { formItemProps } from "@/constants/form";
import { submitter } from "@/constants/public";
import { BetaSchemaForm, ProFormInstance } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";

/*
 * @Author: colpu
 * @Date: 2025-11-24 22:57:22
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-03 22:14:51
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

const ModifyPassword = (props: any) => {
  const { dataSource, style, onSubmit } = props;
  const formRef = useRef<ProFormInstance>(null);
  useEffect(() => {
    if (dataSource?.id) {
      formRef.current?.setFieldsValue({
        id: dataSource.id,
      });
    }
  }, [dataSource]);
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
    delete values.confirm_password; // 删除确认密码
    const params = { ...values, id: dataSource?.id || values.id  }; // 这里用户可能重置表单，导致id丢失，所以需要重新赋值
    await apiUser(params, "put");
    formRef.current?.resetFields();
    if (onSubmit) {
      onSubmit(params);
    }
    message.success("修改成功");
    return true;
  }
  return (
    <>
      <BetaSchemaForm
        formRef={formRef}
        style={{ width: 500, ...style }}
        layout="horizontal"
        submitter={submitter}
        onFinish={onFinish}
        columns={columns}
      />
    </>
  );
};

export default ModifyPassword;
