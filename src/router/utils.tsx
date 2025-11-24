/*
 * @Author: colpu
 * @Date: 2025-06-17 09:14:12
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-20 17:06:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import Loading from "@/components/Loading";
import { ComponentType, lazy, Suspense } from "react";
import { LazyRouteFunction, RouteObject } from "react-router";
import { RouteHandle, RouteType } from ".";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { ObjectMaps } from "@/types";
import KeepAlive from "react-activation";
/**
 * @function _getPagesMap 私有方法获取所有的页面map
 * @description
 * 通过import.meta.glob获取到pages下所有的pages页面，
 * 并排除掉页面级的components组件
 * @returns {Object}
 */
function _getPagesMap(): ObjectMaps {
  const pages = import.meta.glob("@/pages/**/*.(j|t)sx");
  const map: ObjectMaps = Object.create(null);
  Object.keys(pages).map((file: string) => {
    if (!file.includes("/components")) {
      const pagePath = file
        .replace(/\.(j|t)sx$/, "")
        .replace("/src/pages/", "");
      map[pagePath] = pages[file];
    }
  });
  return map;
}

const pages = _getPagesMap();
/**
 * @function importPage 导入页面
 * @param {string} path
 * @returns () => Promise<any>
 */
export function importPage(path: string): () => Promise<any> {
  if (pages[path]) {
    return pages[path];
  }
  return () => import("@/pages/exception/404");
}

/**
 * @function lazyElement
 * @description: 懒加载组件，使用场景包括需要按需加载的组件或路由
 * 例如：在路由配置中使用懒加载组件，或在页面中使用懒加载组件来优化性能。
 * @param {String} path 组件相对pages目录位置
 * @param {RouteHandle} [option] 可选的routeHandle配置
 * @template T 组件类型
 * @return {React.FC<React.ComponentProps<T>>} 返回一个懒加载组件
 * @example
 * const LazyComponent = lazyElement('example/index');
 * return <LazyComponent someProp={value} />;
 * @example
 * const LazyComponent = lazyElement('example/index', {callback: <Loading />});
 * return <LazyComponent someProp={value} />;
 * @example
 * const LazyComponent = lazyElement('example/index', {callback: <div>Loading...</div>});
 * return <LazyComponent someProp={value} />;
 */
export const lazyElement = <T extends ComponentType<any>>(
  path: string,
  handle: RouteHandle = {}
): React.FC<React.ComponentProps<T>> => {
  const LazyComponent = lazy(importPage(path));
  return (props: React.ComponentProps<T>) => {
    return (
      <Suspense fallback={handle.fallback || <Loading />}>
        {handle.roles || handle.permissions ? (
          <ProtectedRoute roles={handle.roles} permissions={handle.permissions}>
            {_keepAliveComponent(<LazyComponent {...props} />, handle.isCache)}
          </ProtectedRoute>
        ) : (
          _keepAliveComponent(<LazyComponent {...props} />, handle.isCache)
        )}
      </Suspense>
    );
  };
};
function _keepAliveComponent(children: any, isCache: boolean | undefined) {
  if (isCache) {
    return <KeepAlive>{children}</KeepAlive>;
  }
  return children;
}

/**
 * @function lazyRouteObject
 * @description: 懒加载路由对象函数，使用场景包括需要按需加载的路由配置，
 * 例如：在路由配置中使用懒加载路由对象来优化性能。
 * @param {string} path 组件相对pages目录位置
 * @param {RouteHandle} [option] 可选的routeHandle配置
 * @return {LazyRouteFunction<RouteObject>} 返回一个懒加载路由对象函数
 * @example
 * const lazyRoute = lazyRouteObject("example/index");
 * const routeObject = await lazyRoute();
 * return <Route {...routeObject} />;
 */
export function lazyRouteObject(
  path: string,
  handle: RouteHandle = {}
): LazyRouteFunction<RouteObject> {
  return async () => {
    const res = (await importPage(path)()) || {};
    const { default: defaultComponent } = res;
    let Component = res.Component;
    if (defaultComponent && !Component) {
      Component = defaultComponent;
    }
    const element = _keepAliveComponent(<Component />, handle.isCache);
    const routeObject = {
      ...res,
      element:
        handle.roles || handle.permissions ? (
          <ProtectedRoute roles={handle.roles} permissions={handle.permissions}>
            {element}
          </ProtectedRoute>
        ) : (
          element
        ),
    };
    return routeObject;
  };
}
export function routerToTree(data: RouteType[]) {
  data = JSON.parse(JSON.stringify(data)); // 解决对象应用地址一样导致数据重复
  const dict: { [key: string]: any } = {};

  // 组装到字典
  data.forEach((item) => {
    const id = item.id;
    if (id) {
      dict[id] = item;
    }
  });
  const addRedirectIndex = (item: any, where: any[], isdel: boolean = true) => {
    const { index, path } = item;
    if (index) {
      where.unshift({
        index,
        path,
      });
      if (isdel) {
        delete item.index;
      }
    }
  };

  const result: RouteType[] = [];
  for (const key in dict) {
    const item = dict[key];
    const fid = item.parentId;

    const fatherItem = dict[fid];
    if (fatherItem) {
      if (!fatherItem.children) {
        fatherItem.children = [];
      }

      if (fatherItem.index) {
        const { handle } = fatherItem;
        const { hideChildrenInMenu } = handle || {};
        const newHandle = { ...handle };
        const fatherItemToChildItem = {
          ...fatherItem,
          path: `index`,
          handle: newHandle,
        };

        if (hideChildrenInMenu) {
          addRedirectIndex(fatherItemToChildItem, fatherItem.children);
          delete newHandle.hideChildrenInMenu;
          delete fatherItem.lazy;
        }
        delete fatherItemToChildItem.children;
        fatherItem.children.push(fatherItemToChildItem);
        fatherItem.index = false;
      }

      const { index, handle } = item;
      const { hideChildrenInMenu } = handle || {};
      if (index && !hideChildrenInMenu) {
        addRedirectIndex(item, fatherItem.children);
      }
      fatherItem.children.push(item);
    } else {
      addRedirectIndex(item, result);
      result.push(item);
    }
  }
  return result;
}

/**
 * @function 创建阅览器Router
 * @param routes
 * @returns
 */
export function createRouter(routes: RouteObject[]) {
  return createBrowserRouter(routes, {
    future: {
      v7_relativeSplatPath: true,
    },
  });
}
