/*
 * @Author: colpu
 * @Date: 2025-06-25 14:04:44
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-04 15:39:28
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const setItem = (key: string, data: object | string) => {
  localStorage.setItem(
    key,
    typeof data === "object" ? JSON.stringify(data) : data
  );
};

export const getItem = (key: string) => {
  const data = localStorage.getItem(key);
  if (data && /^{/.test(data)) {
    return JSON.parse(data);
  } else {
    return data;
  }
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
