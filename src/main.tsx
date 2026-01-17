/*
 * @Author: colpu
 * @Date: 2024-11-04 20:44:03
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-07 23:33:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app";
import store from "@/store";
import { Provider } from "react-redux";
import i18n from "@/i18n";
import "@ant-design/v5-patch-for-react-19"; // 解决react 19版本与antd 5版本冲突
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
