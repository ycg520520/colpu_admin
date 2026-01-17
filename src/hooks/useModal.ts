/*
 * @Author: colpu
 * @Date: 2026-01-04 17:12:12
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-04 17:12:13
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
/*
 * @Author: colpu
 * @Date: 2025-11-06 16:34:14
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-04 15:28:01
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { useState } from "react";
export default function useModal() {
  const [open, setOpen] = useState(false);

  // 打开弹窗
  const onOK = () => {
    setOpen(true);
  };

  // 关闭弹窗
  const onCancel = () => {
    setOpen(false);
  };
  return {
    open,
    onOK,
    onCancel,
  };
}
