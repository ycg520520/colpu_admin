/*
 * @Author: colpu
 * @Date: 2025-06-17 23:31:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 16:29:27
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export interface User {
  id: number;
  username: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  gender?: number;
  remark?: string;
  created_at?: string;
  updated_at?: string;
  roles?: string[];
  permissions?: string[];
}

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;
