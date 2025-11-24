/*
 * @Author: colpu
 * @Date: 2025-11-09 18:23:28
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-09 18:47:27
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useState, useRef } from "react";

// Deep Reset State
export default function useResetState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const initialStateRef = useRef<T>(
    typeof initialState === "object" && initialState !== null
      ? JSON.parse(JSON.stringify(initialState))
      : initialState
  );

  const resetState = () => {
    if (
      typeof initialStateRef.current === "object" &&
      initialStateRef.current !== null
    ) {
      setState(JSON.parse(JSON.stringify(initialStateRef.current)));
    } else {
      setState(initialStateRef.current);
    }
  };

  return { state, setState, resetState };
}
