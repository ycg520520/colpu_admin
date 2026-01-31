/*
 * @Author: colpu
 * @Date: 2025-11-19 17:36:23
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 22:37:05
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React, { useMemo, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { composeMenu } from "@/utils";
import { dynamicIcon } from "@/utils/public";
const { Header, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 加载翻译
  const { t } = useTranslation(["common", "example"]);

  // 获取菜单
  const { routes } = useAppSelector((state) => state.routes);
  const menus = useMemo(() => {
    const _menus = composeMenu<MenuItem>(routes, {
      t,
      dynamicIcon,
      convert: (item) => {
        const { path, name, ...reset } = item;
        return {
          key: path,
          label: name,
          ...reset,
        };
      },
    });
    return _menus;
  }, [t, routes]);

  // 设置当前pathname
  const navigate = useNavigate();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          style={{
            height: "100%", // 填满父容器
            overflowY: "auto", // Y轴滚动
            maxHeight: "100%",
          }}
          mode="vertical"
          items={menus}
          onClick={({ key, keyPath }) => {
            if (/(https?:)?\/\//.test(key)) {
              window.location.href = key;
            } else {
              const path = "/" + keyPath.reverse().join("/");
              navigate(path);
            }
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
