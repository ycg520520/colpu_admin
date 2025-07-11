/*
 * @Author: colpu
 * @Date: 2025-06-30 16:16:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 01:35:04
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import React, { lazy } from "react";
import { Suspense } from "react";

// 动态加载 Ant Design 图标
export function dynamicIcon(iconName: string): React.ReactNode {
  const IconComponent = lazy(() =>
    import(`@ant-design/icons`).then((module: { [key: string]: any }) => {
      const Icon = module[iconName];
      return { default: Icon };
    })
  );

  return <IconComponent />;
}
