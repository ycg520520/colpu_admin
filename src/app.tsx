/*
 * @Author: colpu
 * @Date: 2025-03-21 23:33:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 15:19:01
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ConfigProvider, App } from "antd";
import { Navigate, RouterProvider } from "react-router";
import "@/assets/styles/global.scss";
import { RootState } from "@/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ProConfigProvider } from "@ant-design/pro-components";
import Loading from "@/components/Loading";
import { AliveScope } from "react-activation";
import { createRouter } from "@/router/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StatusEnum } from "@/types";
import { generatorAllRouter } from "@/router";
import { useEffect, useState } from "react";
import { getRoutes } from "@/api/menus";
export default function AppMain() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state: RootState) => state.locale);
  const { routes, status } = useAppSelector((state) => state.routes);
  const [router, setRouter] = useState(createRouter(generatorAllRouter()));
  useEffect(() => {
    try {
      dispatch(getRoutes(undefined));
    } catch (err) {
      console.error("Failed to initialize routes:", err);
    }
  }, [dispatch]);
  useEffect(() => {
    setRouter(createRouter(generatorAllRouter(routes)));
  }, [routes]);

  if (status === StatusEnum.LOADING) {
    return <Loading />;
  }
  if (status === StatusEnum.FAILED) {
    return <Navigate to="/" replace />;
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
          <AliveScope>
            <App>
              <RouterProvider
                future={{
                  v7_startTransition: true,
                }}
                router={router}
                fallbackElement={<Loading />}
              />
            </App>
          </AliveScope>
        </ConfigProvider>
      </ProConfigProvider>
    </I18nextProvider>
  );
}
