/*
 * @Author: colpu
 * @Date: 2025-03-16 16:48:05
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-25 22:24:09
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
      title="404"
      subTitle="Sorry, you don't have access to this page."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoFoundPage;
