/*
 * @Author: colpu
 * @Date: 2025-06-17 09:14:12
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 08:47:47
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
  option: RouteHandle = {}
): React.FC<React.ComponentProps<T>> => {
  const LazyComponent = lazy(importPage(path));
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={option.fallback || <Loading />}>
      {option.roles || option.permissions ? (
        <ProtectedRoute roles={option.roles} permissions={option.permissions}>
          <LazyComponent {...props} />
        </ProtectedRoute>
      ) : (
        <LazyComponent {...props} />
      )}
    </Suspense>
  );
};

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
  option: RouteHandle = {}
): LazyRouteFunction<RouteObject> {
  return async () => {
    const res = (await importPage(path)()) || {};
    const { default: defaultComponent } = res;
    let Component = res.Component;
    if (defaultComponent && !Component) {
      Component = defaultComponent;
    }

    const routeObject = {
      ...res,
      element:
        option.roles || option.permissions ? (
          <ProtectedRoute roles={option.roles} permissions={option.permissions}>
            <Component />
          </ProtectedRoute>
        ) : (
          <Component />
        ),
    };
    return routeObject;
  };
}

export function routerToTree(data: RouteType[], id: number = 0) {
  data = JSON.parse(JSON.stringify(data)); // 解决对象应用地址一样导致数据重复
  const dict: { [key: string]: any } = {};

  // 组装到字典
  data.forEach((item) => {
    const id = item.id;
    if (id) {
      dict[id] = item;
    }
  });

  const result: RouteType[] = [];
  for (const i in dict) {
    const item = dict[i];
    const fid = item.fid;
    const fatherItem = dict[fid];
    if (fid > id && fatherItem) {
      if (!fatherItem.children) {
        fatherItem.children = [];
      }
      const { index, path } = item;
      if (index) {
        fatherItem.children.push({
          index,
          path,
        });
        delete item.index;
      }

      fatherItem.children.push(item);
    }
    if (item.fid === id) {
      const { index, path } = item;
      if (index) {
        result.push({
          index,
          path,
        });
        delete item.index;
      }
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
export function createRouter(routes: RouteObject) {
  return createBrowserRouter([routes], {
    future: {
      v7_relativeSplatPath: true,
    },
  });
}
