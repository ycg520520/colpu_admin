/*
 * @Author: colpu
 * @Date: 2025-03-16 16:48:05
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-19 08:57:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";

const NoFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404 - 页面丢失了"
      subTitle="抱歉，你访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoFoundPage;
