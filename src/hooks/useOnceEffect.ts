/*
 * @Author: colpu
 * @Date: 2025-11-15 23:23:26
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-15 23:38:55
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { useCallback, useEffect, useRef } from "react";

interface EffectCallback {
  ():  void;
}

export default function useOnceEffect(
  effect: EffectCallback,
  deps: React.DependencyList
) {
  const initialized = useRef(false);
  const memoizedEffect = useCallback(effect, deps);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return memoizedEffect();
    }
  }, [memoizedEffect]);
}
