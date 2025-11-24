/*
 * @Author: colpu
 * @Date: 2025-03-19 08:59:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-19 08:57:53
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";
const Exception403: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403 - 权限不足"
      subTitle="抱歉, 您没有访问此页面的权限。"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default Exception403;
