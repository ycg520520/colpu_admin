/*
 * @Author: colpu
 * @Date: 2025-03-18 21:23:51
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-03 22:35:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import logo from "@/assets/logo.svg";
const colorPrimary = "#1890ff";
const settings = {
  // 拂晓蓝
  colorPrimary,
  colorWeak: false,
  fixSiderbar: true,
  fixedHeader: false,
  layout: "mix",
  logo,
  navTheme: "light",
  pwa: true,
  slogan: "一款轻量级CMS管理系统",
  splitMenus: false,
  contentWidth: "Fluid",
  title: "ColpuCMS",
  iconfontUrl: "",
  token: {
    colorPrimary,
    // 全局设置边框圆角
    borderRadius: 3,
    // 也可以单独设置不同尺寸的圆角
    borderRadiusLG: 5,
    borderRadiusSM: 3,
    borderRadiusXS: 1,
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};
export default settings;
