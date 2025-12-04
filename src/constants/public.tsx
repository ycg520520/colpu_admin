import { SubmitterProps } from "@ant-design/pro-components";
import { Button, Form, Space } from "antd";

/*
 * @Author: colpu
 * @Date: 2025-11-24 23:00:34
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-25 13:03:17
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const submitter: SubmitterProps = {
  render: (_, dom) => (
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Space>
        {dom[0]}
        {dom[1]}
      </Space>
    </Form.Item>
  ),
};

export const renderStatus =
  (props?: any) => (dom: React.ReactNode, record: any) => {
    const composeProps = {
      color: "green",
      variant: "outlined",
      disabled: record.status === 0,
      style: { fontSize: 12 },
      size: "small",
      ...props,
    };
    return <Button {...composeProps}>{dom}</Button>;
  };

export const renderWhether = (props?: any) => (value: any) => {
  const composeProps = {
    color: "primary",
    variant: "link",
    size: "small",
    ...props,
  };
  return <Button {...composeProps}>{value ? "是" : "否"}</Button>;
};
