<!--
 * @Author: colpu
 * @Date: 2025-03-18 21:46:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 09:10:14
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
-->

# 路由/菜单说明

## 格式和说明

```ecmascript 6
export type RouteType = {
  // 对应RouteObject类型字段
  caseSensitive?: boolean; // 是否区分大小写
  index?: boolean; // 是否为默认路由
  path?: string; // 路由路径

  // 扩展RouteObject类型字段
  id?: number; // 路由ID
  fid?: number; // 父级路由ID
  lazy?: string; // 懒加载组件相对路径
  element?: string; // 组件实例字符串名称
  children?: RouteType[]; // 子路由
  handle?: RouteHandle; // 路由控制集合
};

export type MetaType = {
  title: string; // 页面标题
  keywords?: string; // 页面关键词
  description?: string; // 页面描述
};

export type RouteHandle = {
  name?: string; // 菜单名称
  meta?: MetaType; // 页面meta属性
  permissions?: string[]; // 权限列表
  roles?: string[]; // 角色列表
  icon?: string; // 图标
  danger?: boolean; // 是否危险操作
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name disable menu 的 tooltip 菜单选项 */
  disabledTooltip?: boolean;
  fallback?: React.ReactNode;
  translationKey?: string; // 国际化对应健值
  ns?: string; // 国际化对应命名空间
  hideTitle?: boolean; // 隐藏PageContainer组件的标题
  [key: string]: any;
};

```
