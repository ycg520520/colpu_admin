/*
 * @Author: colpu
 * @Date: 2025-06-15 12:21:25
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-18 08:56:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
