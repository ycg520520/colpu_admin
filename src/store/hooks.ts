/*
 * @Author: colpu
 * @Date: 2025-06-15 12:21:25
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-09 21:35:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import {
  TypedUseSelectorHook,
  UseDispatch,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "@/store";

export const useAppDispatch: UseDispatch<AppDispatch> = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
