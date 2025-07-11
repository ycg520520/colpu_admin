import type { MenuDataItem, ProSettings } from "@ant-design/pro-components";
import {
  PageContainer,
  ProCard,
  ProLayout,
  SettingDrawer,
} from "@ant-design/pro-components";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import SearchInput from "@/components/Search";
import { useTranslation } from "react-i18next";
import { RouteHandle } from "@/router";
import {
  Navigate,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router";
import { composeMenu } from "@/utils";
import defaultSettings from "@/config/settings";
import MenuFooter from "@/components/MenuFooter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/user";
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { dynamicIcon } from "@/utils/public";
import { User } from "@/store/slices/user/types";
import Lang from "@/components/Lang";

export default function BaseLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userStore = useAppSelector((state) => state.user);
  const user = userStore.user as User;

  // 获取路由信息
  const matches = useMatches();
  const routeHandle = (matches.at(-1)?.handle || {}) as RouteHandle;
  const containerHeader = routeHandle.hiddenTitle
    ? { title: false }
    : undefined;

  // 设置当前pathname
  const location = useLocation();
  const _pathname = location.pathname;
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(_pathname);
  }, [_pathname]);

  // 设置settings
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: defaultSettings.fixSiderbar || true,
    layout: defaultSettings.layout || "mix",
    splitMenus: defaultSettings.splitMenus || false,
  });

  // 加载翻译
  const { t } = useTranslation(["common", "example"]);

  // 获取菜单
  const routes = useAppSelector((state) => state.routes.routes);
  const [menus, setMenus] = useState<MenuDataItem[]>([]);
  useEffect(() => {
    const _menus = composeMenu(routes, t, dynamicIcon);
    setMenus([{ path: "/", children: _menus }]);
  }, [t, routes, _pathname]);
  if (!userStore.isAuthenticated) {
    if (pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  }

  return (
    <ProLayout
      route={menus[0]}
      location={{
        pathname,
      }}
      avatarProps={{
        src: user.src,
        size: "small",
        title: user.nickname,
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{
                onClick: ({ key }) => {
                  if (key === "logout") {
                    dispatch(logout());
                  }
                },
                items: [
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
      headerTitleRender={(_logo, title, _) => {
        const defaultDom = (
          <a>
            <img src={defaultSettings.logo} alt="logo" width={40} />
            {title}
          </a>
        );
        if (typeof window === "undefined") return defaultDom;
        if (document.body.clientWidth < 1400) {
          return defaultDom;
        }
        if (_.isMobile) return defaultDom;
        return <>{defaultDom}</>;
      }}
      menuFooterRender={(props) => <MenuFooter {...props} />}
      menuItemRender={(item, dom) => {
        return (
          <div
            onClick={() => {
              const path = item.path || "";
              setPathname(path);
              navigate(path);
            }}
          >
            {dom}
          </div>
        );
      }}
      {...defaultSettings}
      {...settings}
    >
      <PageContainer
        header={containerHeader}
        token={{
          paddingInlinePageContainerContent: 20,
        }}
      >
        <ProCard
          style={{
            minHeight: 1200,
          }}
        >
          <Outlet />
        </ProCard>
      </PageContainer>
      <SettingDrawer
        pathname={pathname}
        enableDarkTheme
        getContainer={(e: any) => {
          if (typeof window === "undefined") return e;
          return document.getElementById("test-pro-layout");
        }}
        settings={settings}
        onSettingChange={setSetting}
        disableUrlParams={false}
      />
    </ProLayout>
  );
}
