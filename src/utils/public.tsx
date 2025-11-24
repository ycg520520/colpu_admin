/*
 * @Author: colpu
 * @Date: 2025-06-30 16:16:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-15 12:33:58
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { Suspense } from "react";
import * as AntdIcons from "@ant-design/icons";

// 动态加载 Ant Design 图标
export function dynamicIcon(iconName: string, props?: any): React.ReactNode {
  // const IconComponent = lazy(() =>
  //   import(`@ant-design/icons`).then((module: { [key: string]: any }) => {
  //     const Icon = module[iconName];
  //     return { default: Icon };
  //   })
  // );
  const IconComponent = (AntdIcons as any)[iconName];
  return <IconComponent {...props} />;
}

// 感觉有点吃内存，慢，暂时不用
export const suspenseDynamicIcon = ({ iconName, props }: any) => {
  const IconComponent = dynamicIcon(iconName, props);
  return (
    <Suspense
      fallback={
        <span
          style={{
            width: "1em",
            height: "1em",
            fontSize: props?.style?.fontSize || 16,
            display: "inline-block",
          }}
        />
      }
    >
      {IconComponent}
    </Suspense>
  );
};
