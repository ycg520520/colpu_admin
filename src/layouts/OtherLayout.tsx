/*
 * @Author: colpu
 * @Date: 2025-11-19 17:36:23
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-23 14:11:26
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { IconFunction } from "@/utils";
import { dynamicIcon } from "@/utils/public";
import { TFunction } from "i18next";
import { RouteType } from "@/router";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
function composeMenu(
  routes: RouteType[],
  translation?: TFunction,
  iconFunction?: IconFunction
): MenuItem[] {
  if (!routes.length) return [];
  const menuList: MenuItem[] = [];
  for (let idx = 0; idx < routes.length; idx++) {
    const route: RouteType = routes[idx];
    const { index, children = [], path: key = "", handle = {} } = route;
    const {
      icon,
      translationKey,
      ns,
      name: label,
      hideChildrenInMenu,
      hideInMenu,
    } = handle;
    if (hideChildrenInMenu && hideInMenu) continue;
    if ((index || !key || hideInMenu) && !handle.layout) continue;
    const item: MenuItem = {
      key,
      icon: icon && iconFunction ? iconFunction(icon) : undefined,
      label,
    };
    if (children.length && !hideChildrenInMenu) {
      (item as any).children = composeMenu(children, translation, iconFunction);
    }
    if (translation && translationKey) {
      item.label = translation(translationKey, { ns });
    }
    menuList.push(item);
  }
  return menuList;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 加载翻译
  const { t } = useTranslation(["common", "example"]);

  // 获取菜单
  const routes = useAppSelector((state) => state.routes.routes);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  useEffect(() => {
    const _menus = composeMenu(routes, t, dynamicIcon);
    setMenus(_menus);
  }, [t, routes]);

  // 设置当前pathname
  const navigate = useNavigate();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={menus}
          onClick={({ key, keyPath }) => {
            const isBlank = "_blank";
            if (isBlank && /(https?:)?\/\//.test(key)) {
              window.location.href = key;
            } else {
              const path = "/" + keyPath.reverse().join("/");
              if (isBlank) {
                window.open(path, "_blank");
              } else {
                navigate(path);
              }
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
