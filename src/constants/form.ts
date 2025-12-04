/*
 * @Author: colpu
 * @Date: 2025-11-16 21:07:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-25 15:00:48
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

export const colSpan = (span = 24) => ({
  span: span,
});
export const formItemCol = (lablelSpan = 4, col = 24) => ({
  labelCol: { span: lablelSpan },
  wrapperCol: { span: col - lablelSpan },
});
export const colProps = colSpan(12);
export const formItemProps = formItemCol(8);
export const colPropsFull = colSpan();
export const formItemPropsFull = formItemCol();
