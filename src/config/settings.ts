/*
 * @Author: colpu
 * @Date: 2025-03-18 21:23:51
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-09-17 08:15:26
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import type { ProLayoutProps } from "@ant-design/pro-components";
import logo from "@/assets/logo.svg";
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  splitMenus: false,
  navTheme: "light",
  // 拂晓蓝
  colorPrimary: "#1890ff",
  layout: "mix",
  contentWidth: "Fluid",
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: "印点信息后台",
  pwa: true,
  logo,
  iconfontUrl: "",
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};
export default Settings;
