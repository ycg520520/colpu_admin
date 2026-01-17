import { SubmitterProps } from "@ant-design/pro-components";
import { Button, Form, Space } from "antd";

/*
 * @Author: colpu
 * @Date: 2025-11-24 23:00:34
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-16 16:04:56
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
    const { callback, ...rest } = props || {};
    let callbackRes;
    if (callback) {
      callbackRes = callback(record);
    }
    const composeProps = {
      color: "green",
      variant: "outlined",
      disabled: record.status === 0,
      style: { fontSize: 12 },
      size: "small",
      ...rest,
      ...callbackRes,
    };
    return <Button {...composeProps}>{dom}</Button>;
  };

export const renderWhether =
  (props?: any, texts: string[] = ["是", "否"]) =>
  (value: any) => {
    let valueStr = value ? texts[0] : texts[1];
    if (texts.length > 2) {
      valueStr = texts[value];
    }
    const composeProps = {
      color: "primary",
      variant: "link",
      size: "small",
      ...props,
    };
    return <Button {...composeProps}>{valueStr}</Button>;
  };
