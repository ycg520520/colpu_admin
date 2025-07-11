/*
 * @Author: colpu
 * @Date: 2025-06-17 23:31:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 09:20:51
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  src?: string;
  createdAt?: string;
  updatedAt?: string;
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
