/*
 * @Author: colpu
 * @Date: 2025-12-08 22:43:28
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 11:04:39
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
// components/PageTabs.jsx
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTab, removeTab, TabItem, setHasTab } from "@/store/slices/tabs";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

const PageTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { tabs, hasTab } = useAppSelector((state) => state.tabs);
  const { flatMenus } = useAppSelector((state) => state.routes);

  useEffect(() => {
    let currentPath = location.pathname;
    if (currentPath.endsWith("/index")) {
      currentPath = currentPath.replace("/index", "");
    }
    const menu = flatMenus.find((m) => m.path === currentPath);
    if (menu) {
      dispatch(addTab(menu));
    }
    dispatch(setHasTab(!!menu));
  }, [location.pathname, flatMenus, dispatch]);

  const onChange = (key: string) => {
    navigate(key);
  };

  const onEdit = (targetKey: any, action: "add" | "remove") => {
    if (action === "remove" && typeof targetKey === "string") {
      dispatch(removeTab(targetKey));
      // 如果关闭的是当前页，跳转到最后一个 tab
      if (location.pathname === targetKey) {
        const remainingTabs = tabs.filter((t) => t.path !== targetKey);
        if (remainingTabs.length > 0) {
          navigate(remainingTabs[remainingTabs.length - 1].path);
        }
      }
    }
  };

  if (tabs.length <= 1 || !hasTab) return null;
  return (
    <>
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={location.pathname}
        onChange={onChange}
        onEdit={onEdit}
        size="small"
      >
        {tabs.map((tab: TabItem) => (
          <Tabs.TabPane key={tab.path} tab={tab.name} closable={tab.closable} />
        ))}
      </Tabs>
    </>
  );
};

export default PageTabs;
