/*
 * @Author: colpu
 * @Date: 2025-11-16 21:07:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-18 12:27:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const colProps = {
  span: 12,
};
export const formItemProps = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export const colPropsFull = {
  span: 24,
};
export const formItemPropsFull = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export const formItemCol = (lablelSpan = 4, col = 24) => ({
  labelCol: { span: lablelSpan },
  wrapperCol: { span: col - lablelSpan },
});
