/*
 * @Author: colpu
 * @Date: 2025-11-23 13:02:45
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 23:56:49
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import {
  MenuDataItem,
  PageContainer,
  ProLayout,
  SettingDrawer,
} from "@ant-design/pro-components";
import { Dropdown, theme } from "antd";
import { useEffect, useState } from "react";
import SearchInput from "@/components/Search";
import { useTranslation } from "react-i18next";
import { RouteHandle } from "@/router/types";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router";
import { composeMenu } from "@/utils";
import MenuFooter from "@/components/MenuFooter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/user";
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { dynamicIcon } from "@/utils/public";
import Lang from "@/components/Lang";
import { setFlatMenus } from "@/store/slices/routes";
import { flatMenu } from "@/router/utils";
import { setSettings } from "@/store/slices/settings";

export default function BasicLayout() {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  // 获取路由信息
  const matches = useMatches();
  const routeHandle = (matches.at(-1)?.handle || {}) as RouteHandle;
  const containerHeader = {
    // title: false,
    title: routeHandle.meta?.title,
    // breadcrumb: undefined,
  };

  // 设置当前pathname
  const location = useLocation();
  const _pathname = location.pathname;
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(_pathname);
  }, [_pathname]);

  // 设置settings
  const settings = useAppSelector((state) => state.settings);
  // 加载翻译
  const { t } = useTranslation(["common", "example"]);

  // 获取菜单
  const { routes } = useAppSelector((state) => state.routes);
  const [menus, setMenus] = useState<any>([]);
  useEffect(() => {
    const _menus = composeMenu<MenuDataItem>(routes, {
      t,
      dynamicIcon,
    });
    const composeMenus = [{ path: "/", name: "首页", children: _menus }];
    setMenus(composeMenus);
    dispatch(setFlatMenus(flatMenu(composeMenus)));
  }, [t, routes, dispatch]);
  return (
    <ProLayout
      route={menus[0]}
      location={{
        pathname,
      }}
      avatarProps={{
        src: user?.avatar,
        size: "small",
        title: user?.nickname,
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{
                onClick: ({ key }) => {
                  if (key === "logout") {
                    dispatch(logout());
                    navigate("/login", { replace: true });
                  }
                  if (key === "account") {
                    navigate("/account");
                  }
                },
                items: [
                  {
                    key: "account",
                    icon: dynamicIcon("UserOutlined"),
                    label: "个人中心",
                  },
                  {
                    key: "logout",
                    icon: dynamicIcon("LogoutOutlined"),
                    label: "退出登录",
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      actionsRender={(props) => {
        if (props.isMobile) return [];
        if (typeof window === "undefined") return [];
        return [
          props.layout !== "side" && document.body.clientWidth > 1400 ? (
            <SearchInput />
          ) : undefined,
          <InfoCircleFilled key="InfoCircleFilled" />,
          <QuestionCircleFilled key="QuestionCircleFilled" />,
          <GithubFilled
            onClick={() => {
              window.location.href = "https://github.com/ycg520520";
            }}
            key="Gith ubFilled"
          />,
          <Lang theme="dark" />,
        ];
      }}
      headerTitleRender={(_logo, _title, props: any) => {
        const defaultDom = (
          <>
            <img
              src={props.logo}
              alt="logo"
              style={{
                width: 32,
              }}
            />
            <div
              style={{
                marginLeft: 5,
              }}
            >
              <div
                style={{
                  marginTop: 2,
                  marginBottom: 3,
                  fontSize: 14,
                  lineHeight: 1,
                  fontWeight: 600,
                  color: token.colorTextBase,
                }}
              >
                {props.title}
              </div>
              <div
                style={{
                  fontSize: 8,
                  lineHeight: 1,
                  color: token.colorTextDescription,
                }}
              >
                {props.slogan}
              </div>
            </div>
          </>
        );

        if (typeof window === "undefined") return defaultDom;
        if (document.body.clientWidth < 1400) {
          return defaultDom;
        }
        if (props.isMobile) return defaultDom;
        return defaultDom;
      }}
      menuFooterRender={(props) => <MenuFooter {...props} />}
      menuItemRender={(item, dom) => {
        const isBlank = item.target === "_blank";
        if (isBlank && /(https?:)?\/\//.test(item.path || "")) {
          return (
            <a
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {dom}
            </a>
          );
        }
        return (
          <div
            onClick={async () => {
              const path = item.path || "";
              setPathname(path);
              if (isBlank) {
                window.open(path, "_blank");
              } else {
                navigate(path);
              }
            }}
          >
            {dom}
          </div>
        );
      }}
      {...settings}
      // 关键配置
      style={{
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <PageContainer
        header={containerHeader}
        // pageHeaderRender={() => {
        //   return (
        //     <div style={{ padding: "10px 20px 0 20px" }}>
        //       <ProBreadcrumb style={{ marginBottom: 10 }} />
        //       <PageTabs />
        //     </div>
        //   );
        // }}
        token={{
          paddingInlinePageContainerContent: 20,
          paddingBlockPageContainerContent: 10,
        }}
        waterMarkProps={{
          fontColor: "rgba(0,0,0,0.1)",
          content: settings.title || "Water",
        }}
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
        childrenContentStyle={{ flex: 1 }}
      >
        <Outlet />
      </PageContainer>
      <SettingDrawer
        pathname={pathname}
        enableDarkTheme
        getContainer={(e: any) => {
          if (typeof window === "undefined") return e;
          return document.getElementById("test-pro-layout");
        }}
        settings={settings}
        onSettingChange={(set) => {
          dispatch(setSettings(set));
        }}
        disableUrlParams={true}
      />
    </ProLayout>
  );
}
