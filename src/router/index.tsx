/*
 * @Author: colpu
 * @Date: 2025-03-18 21:46:37
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-03 14:39:44
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Navigate, Outlet, RouteObject } from "react-router";
import { asyncRouter, baseRouter, noMatchRouter } from "./routes";
import { lazyElement, lazyRouteObject } from "./utils";
import React from "react";
import layouts from "@/layouts";
import InitLayout from "@/layouts/InitLayout";
export type MetaType = {
  title: string; // 页面标题
  keywords?: string; // 页面关键词
  description?: string; // 页面描述
};
export type RouteHandle = {
  name?: string; // 菜单名称
  meta?: MetaType; // 页面meta属性
  permission?: string; // 权限编码
  roles?: string[]; // 角色列表
  icon?: string; // 图标
  danger?: boolean; // 是否危险操作
  hideChildrenInMenu?: boolean; // 在菜单中隐藏子节点
  hideInMenu?: boolean; // 在菜单中隐藏自己和子节点
  disabled?: boolean; // disabled 菜单选项
  disabledTooltip?: boolean; // disabledTooltip menu 的 tooltip 菜单选项
  fallback?: React.ReactNode;
  translationKey?: string; // 国际化对应健值
  isCache?: boolean; // 是否缓存页面
  ns?: string; // 国际化对应命名空间
  hideTitle?: boolean; // 隐藏PageContainer组件的标题
  [key: string]: any;
};

export type RouteType = RouteObject & {
  // // 对应RouteObject类型字段
  // caseSensitive?: boolean; // 是否区分大小写
  // index?: boolean; // 是否为默认路由
  // path?: string; // 路由路径

  // 扩展RouteObject类型字段
  id?: number; // 路由ID
  fid?: number; // 父级路由ID
  lazy?: string; // 懒加载组件相对路径
  element?: string; // 组件实例字符串名称
  children?: RouteType[]; // 子路由
  handle?: RouteHandle; // 路由控制集合
  layout?: string; // 布局组件相对路径
};

/**
 * @function generatorRouter
 * @description
  生成器函数，用于格式化树形结构数据生成router层级路由表。
 * 该函数将接收一个路由配置数组和一个可选的组件映射表，
 * 返回一个格式化后的路由对象数组。
 * 使用场景包括需要将后端返回的路由配置转换为前端可用的路由格式，
 * 例如在React Router中使用。
 * @param {RouteType[]} routers 路由配置数组
 * @returns {RouteObject[]} 返回格式化后的路由对象数组
 * @example
 * const routers = [
 *   {
 */
export function generatorRouter(routers: RouteType[]): RouteObject[] {
  return routers.map((item: RouteType) => {
    const { caseSensitive = true, index, element, lazy, handle } = item;
    let children = item.children || [];
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个反斜杠
    let path = item.path || "";
    if (!/^(https?|\/\/)/.test(path) && path) {
      path = path.replace("//", "/");
    }
    const currentRouter: RouteObject = {
      caseSensitive,
      index,
      handle,
    };
    // 处理layout
    if (handle && handle.layout) {
      currentRouter.path = path;
      currentRouter.element = (layouts as any)[handle.layout] || <Outlet />;
      // 对独立菜单添加子集，原因是存在layout
      if ((element || lazy) && children.length === 0) {
        const childrenHandle = { ...handle };
        delete childrenHandle.layout;
        children = [
          {
            caseSensitive,
            index,
            handle: childrenHandle,
            element,
            lazy,
          },
        ];
      }
    } else {
      // 将字符串lazy路由转换成RouteObject.lazy类型路由(动态加载)
      if (lazy) {
        currentRouter.lazy = lazyRouteObject(lazy, handle);
      }
      if (element) {
        const Element = lazyElement(element, handle);
        currentRouter.element = <Element />;
      }
      if (index === true) {
        currentRouter.element = <Navigate to={path} replace />;
      } else {
        currentRouter.path = path;
      }
    }

    // 是否有子菜单，并递归处理
    if (children.length > 0) {
      currentRouter.children = generatorRouter(children);
    }
    return currentRouter;
  });
}

export const setRouteIndex = (routes: RouteType[]) => {
  if (routes.length) {
    const firstRoute = routes[0];
    if (!firstRoute.index) {
      routes.unshift({
        index: true,
        path: firstRoute.path,
      });
      console.log(firstRoute.path);
      if (firstRoute.children) {
        // delete firstRoute.path;
      }
      if (firstRoute.children) {
        setRouteIndex(firstRoute.children);
      }
    }
  }
};

/**
 * @function generatorAllRouter
 * @description
  生成所有路由，包括基础路由、异步路由和404未匹配路由。
 * 该函数将基础路由、异步路由和404未匹配路由组合成一个完整的路由表，
 * 并返回一个包含所有路由的数组。
 * 使用场景包括需要在React Router中使用动态生成的路由表，
 * 例如在应用程序启动时加载所有路由配置。
 * @returns {RouteObject} 返回包含所有路由的数组
 * @example
 * const routes = generatorAllRouter();
 */
export function generatorAllRouter(routes: RouteType[] = []): RouteObject[] {
  const baseRoutes: RouteObject[] = generatorRouter(baseRouter);
  const noMatchRouters: RouteObject[] = generatorRouter([noMatchRouter]);
  // 解决没有index路由时，默认跳转第一个路由，不然会出现空白页面
  // setRouteIndex(routes);
  const asyncRouterRoot: RouteObject[] = generatorRouter([
    ...asyncRouter,
    ...routes]);
  const routers = [...baseRoutes, ...asyncRouterRoot, ...noMatchRouters];
  return [
    {
      path: "/",
      element: <InitLayout />,
      children: routers,
    },
  ];
}
