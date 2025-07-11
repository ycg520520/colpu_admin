/*
 * @Author: colpu
 * @Date: 2025-03-19 09:01:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-25 22:24:29
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
      title="500"
      subTitle="Sorry, the server is reporting an error."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default Exception500;
