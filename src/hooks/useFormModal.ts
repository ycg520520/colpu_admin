/*
 * @Author: colpu
 * @Date: 2025-11-06 16:34:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-07 20:30:12
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { useState, useCallback, useRef } from "react";
import { ProFormInstance } from "@ant-design/pro-components";
export default function useModal() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<ProFormInstance>();

  // 打开弹窗
  const onOK = useCallback(() => {
    setOpen(true);
  }, []);

  // 关闭弹窗
  const onCancel = useCallback(() => {
    formRef.current?.resetFields();
    setOpen(false);
  }, []);
  return {
    // 状态
    open,
    // 方法
    onOK,
    onCancel,

    formRef,
  };
}
