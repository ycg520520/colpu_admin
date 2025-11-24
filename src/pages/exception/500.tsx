/*
 * @Author: colpu
 * @Date: 2025-03-19 09:01:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-19 08:57:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";
const Exception500: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="500"
      title="500 - 服务错误"
      subTitle="抱歉，服务器出了点问题。"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default Exception500;
