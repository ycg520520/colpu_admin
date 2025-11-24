/*
 * @Author: colpu
 * @Date: 2025-03-22 00:13:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-20 13:09:40
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { ProCard } from "@ant-design/pro-components";
import { useLocation } from "react-router";
export default function Example() {
  const location = useLocation();
  return (
    <ProCard>
      这是例子的路由：{location.pathname}
    </ProCard>
  );
}
