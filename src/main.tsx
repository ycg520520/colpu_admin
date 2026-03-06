/*
 * @Author: colpu
 * @Date: 2024-11-04 20:44:03
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 14:01:20
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app";
import store from "@/store";
import { Provider } from "react-redux";
import i18n from "@/i18n";
// import "@ant-design/v5-patch-for-react-19"; // 解决react 19版本与antd 5版本冲突
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  addGlobalNetworkListener,
  GLOBAL_NETWORK_TYPE,
  delGlobalNetworkType,
} from "@/utils/request/events";
import { Modal } from "antd";

const redirectToLogin = () => {
  const location = window.location;
  const url = `/login?redirect=${encodeURIComponent(
    location.pathname + location.search,
  )}`;
  location.replace(url);
};
// 监听全局请求错误事件：同类型错误由 events 内部保证只触发一次
addGlobalNetworkListener(({ type }) => {
  if (type === GLOBAL_NETWORK_TYPE.AUTH_EXPIRED) {
    Modal.error({
      title: "登录已过期",
      content: "您的登录状态已失效，请重新登录。",
      okText: "去登录",
      closable: false,
      maskClosable: false,
      keyboard: false,
      onOk: () => {
        delGlobalNetworkType(type);
        redirectToLogin();
      },
    });
  }
  // 刷新失败直接跳转登陆
  if (type === GLOBAL_NETWORK_TYPE.AUTH_REFRESH_FAILED) {
    redirectToLogin();
  }
  // 刷新成功后设置登录状态
  if (type === GLOBAL_NETWORK_TYPE.AUTH_REFRESH_SUCCESS) {
    // todo 设置登录状态
  }
});

const root = document.getElementById("root")! as HTMLElement;
root.style.cssText = "height:100vh;overflow:auto";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟内不重新请求（可选）
      retry: 1,
    },
  },
});
export function Root() {
  return (
    // StrictMode 用于检测不安全的生命周期，过时的API，以及不推荐的事件处理等，会导致请求发送两次
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );
}

// 预加载所有需要的语言
i18n
  .reloadResources(i18n.language, ["example"], () => {
    createRoot(root).render(<Root />);
  })
  .catch((err) => {
    console.error(err);
    createRoot(root).render(<Root />);
  });
