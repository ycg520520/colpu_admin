/*
 * @Author: colpu
 * @Date: 2025-06-25 15:37:27
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-16 16:39:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const emailReg =
  /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
export const passwordReg =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*)(_+}{|:?><]).{8,16}$/;
export const IPReg =
  /^(https?:\/\/)?((([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))\.)((([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))\.){2}(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))(:\d{2,5})?$/;
export const domainReg =
  /^(https?:\/\/)?(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}(:\d{2,5})?$/;
export const phoneReg =
  /^(https?:\/\/)?(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}(:\d{2,5})?$/;
