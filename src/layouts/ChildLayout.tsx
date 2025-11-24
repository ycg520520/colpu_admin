/*
 * @Author: colpu
 * @Date: 2025-11-19 23:42:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-23 13:03:15
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
/*
 * @Author: colpu
 * @Date: 2025-11-19 17:36:23
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-19 23:42:16
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React from "react";
import { Alert, Layout, theme } from "antd";
import { Outlet } from "react-router";
const { Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Alert message="这是嵌套子集ChildLayout布局" type="error" />
      <Outlet />·
    </Content>
  );
};

export default App;
