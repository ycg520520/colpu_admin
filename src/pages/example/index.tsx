/*
 * @Author: colpu
 * @Date: 2025-03-22 00:13:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-20 16:03:04
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useLocation } from "react-router";
export default function Example() {
  const location = useLocation();
  return <>这是例子 {location.pathname}</>;
}
