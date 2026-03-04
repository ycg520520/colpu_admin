/*
 * @Author: colpu
 * @Date: 2025-11-16 10:26:35
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-02 10:34:47
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useLocation, useOutlet } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
interface KeepAliveProps {
  include?: string[];
  exclude?: string[];
}
const KeepAlive: React.FC<KeepAliveProps> = ({
  include = [],
  exclude = [],
}) => {
  const location = useLocation();
  const element = useOutlet();
  const [cacheComponents, setCacheComponents] = useState(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // 检查路径是否应该缓存
  const shouldCache = useCallback((path: string) => {
    if (exclude.includes(path)) return false;
    if (include.length === 0) return true;
    return include.includes(path);
  }, [exclude, include]);

  useEffect(() => {
    const pathname = location.pathname;

    if (!shouldCache(pathname)) {
      // 不缓存的页面，清空容器
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      return;
    }

    // 缓存组件
    setCacheComponents((prev) => {
      const newCache = new Map(prev);
      if (!newCache.has(pathname) && element) {
        newCache.set(pathname, element);
      }
      return newCache;
    });
  }, [location.pathname, element, shouldCache, setCacheComponents]);

  // // 清除特定缓存
  // const clearCache = (pathname: any) => {
  //   setCacheComponents((prev) => {
  //     const newCache = new Map(prev);
  //     newCache.delete(pathname);
  //     return newCache;
  //   });
  // };

  // // 清除所有缓存
  // const clearAllCache = () => {
  //   setCacheComponents(new Map());
  // };

  return (
    <div ref={containerRef}>
      {Array.from(cacheComponents.entries()).map(([pathname, component]) => (
        <div
          key={pathname}
          style={{
            display: pathname === location.pathname ? "block" : "none",
          }}
        >
          {component}
        </div>
      ))}
      {/* 当前页面，如果不在缓存中则直接显示 */}
      {!cacheComponents.has(location.pathname) && element}
    </div>
  );
};

export default KeepAlive;
