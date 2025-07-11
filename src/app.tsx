/*
 * @Author: colpu
 * @Date: 2025-03-21 23:33:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 12:55:41
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ConfigProvider } from "antd";
import { Navigate, RouterProvider } from "react-router";
import "@/assets/styles/global.scss";
import store, { RootState } from "@/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ProConfigProvider } from "@ant-design/pro-components";
import Loading from "@/components/Loading";
import { createRouter } from "@/router/utils";
import { useAppSelector } from "@/store/hooks";
import { StatusEnum } from "@/types";
import { generatorAllRouter } from "@/router";
import { useEffect, useState } from "react";
import { apiRoutes } from "@/api/routes";
export default function App() {
  const locale = useAppSelector((state: RootState) => state.locale);
  const { routes, status } = useAppSelector((state) => state.routes);
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);
  const [router, setRouter] = useState(
    createRouter(generatorAllRouter(routes))
  );

  useEffect(() => {
    const initRoutesHandle = async () => {
      if (isAuthenticated) {
        try {
          store.dispatch(apiRoutes(undefined));
        } catch (err) {
          console.error("Failed to initialize routes:", err);
        }
      }
    };
    initRoutesHandle();
  }, [isAuthenticated]);
  useEffect(() => {
    setRouter(createRouter(generatorAllRouter(routes)));
  }, [routes]);

  if (status === StatusEnum.LOADING) {
    return <Loading />;
  }
  if (status === StatusEnum.FAILED) {
    return <Navigate to="/" replace />
  }
  return (
    <I18nextProvider i18n={i18n}>
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          locale={locale}
          theme={{
            token: {
              colorPrimary: "red",
            },
          }}
        >
          <RouterProvider
            future={{
              v7_startTransition: true,
            }}
            router={router}
            fallbackElement={<Loading />}
          />
        </ConfigProvider>
      </ProConfigProvider>
    </I18nextProvider>
  );
}
