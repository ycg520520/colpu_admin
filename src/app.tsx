/*
 * @Author: colpu
 * @Date: 2025-03-21 23:33:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-04 11:49:45
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router";
import "@/assets/styles/global.scss";
import { RootState } from "@/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ProConfigProvider } from "@ant-design/pro-components";
import { AliveScope } from "react-activation";
import { createRouter } from "@/router/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generatorAllRouter, RouteType } from "@/router";
import { useEffect, useState } from "react";
import { getRoutes } from "./api/menus";
import { getDict } from "@/api/dict";
import { getDepartmentTree } from "./api/departments";
import { cloneDeep } from "lodash";
import { getUserInfo } from "./api/user";
const initRouter = createRouter(generatorAllRouter());
export default function AppMain() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state: RootState) => state.locale);
  const settings = useAppSelector((state: RootState) => state.settings);
  const { isLogin } = useAppSelector((state: RootState) => state.user);
  const [router, setRouter] = useState(initRouter);
  useEffect(() => {
    if (isLogin) {
      dispatch(getRoutes()).then(({ payload }) => {
        setRouter(
          createRouter(generatorAllRouter(cloneDeep(payload as RouteType[]))),
        );
      });
      dispatch(getUserInfo());
      dispatch(getDict());
      dispatch(getDepartmentTree());
    }
  }, [dispatch, isLogin]); // 仅登录状态变化时重拉路由，避免 token 刷新触发 router 重建导致闪烁
  return (
    <I18nextProvider i18n={i18n}>
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          locale={locale}
          theme={{
            token: settings.token,
          }}
        >
          {/* App 解决message等弹窗全局问题 */}
          <AliveScope>
            <RouterProvider router={router} />
          </AliveScope>
        </ConfigProvider>
      </ProConfigProvider>
    </I18nextProvider>
  );
}
