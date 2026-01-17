/*
 * @Author: colpu
 * @Date: 2025-03-21 23:33:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-17 13:40:04
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
import Loading from "@/components/Loading";
import { AliveScope } from "react-activation";
import { createRouter } from "@/router/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generatorAllRouter } from "@/router";
import { useEffect, useState } from "react";
import { getRoutes } from "./api/menus";
import { getDict } from "./api/dict";
import { getDepartmentTree } from "./api/departments";
import { cloneDeep } from "lodash";
import { StatusEnum } from "./types";
export default function AppMain() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state: RootState) => state.locale);
  const { status } = useAppSelector((state) => state.routes);
  const { routes } = useAppSelector((state) => state.routes);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [router, setRouter] = useState(createRouter(generatorAllRouter()));
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getRoutes(undefined));
      dispatch(getDict(undefined));
      dispatch(getDepartmentTree(undefined));
    }
  }, [dispatch, isAuthenticated]);
  useEffect(() => {
    setRouter(createRouter(generatorAllRouter(cloneDeep(routes))));
  }, [routes]);
  if (status === StatusEnum.LOADING) {
    return <Loading />;
  }
  return (
    <I18nextProvider i18n={i18n}>
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          locale={locale}
          theme={{
            token: {
              colorPrimary: "red",
              // 全局设置边框圆角
              borderRadius: 3,
              // 也可以单独设置不同尺寸的圆角
              borderRadiusLG: 5,
              borderRadiusSM: 3,
              borderRadiusXS: 1,
            },
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
