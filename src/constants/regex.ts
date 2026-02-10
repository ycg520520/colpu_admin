/*
 * @Author: colpu
 * @Date: 2025-06-25 15:37:27
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-03 22:45:16
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const emailReg =
  /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
export const passwordReg =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*)(_+}{|:?><]).{8,16}$/;
export const IPReg =
  /^(https?:\/\/)?((([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))\.)((([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))\.){2}(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))(:\d{2,5})?$/;
export const domainReg = /^(-?[1-9]\d*\.\d+|-?0\.\d*[1-9]\d*|0\.0+)$/;
export const phoneReg =
  /^1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/;
export const urlReg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
