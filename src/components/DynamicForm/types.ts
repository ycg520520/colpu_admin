/*
 * @Author: colpu
 * @Date: 2025-11-05 14:45:02
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-06 20:20:00
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { FormItemProps, FormProps } from "antd";
export interface DynamicField extends FormItemProps {
  name: string;
  type?:
    | "input"
    | "select"
    | "number"
    | "textarea"
    | "date"
    | "switch"
    | "treeSelect"
    | "checkbox"
    | "radio"
    | undefined;

  options?: Array<{ label: string; value: any; [key: string]: any }>;
  rules?: any[];
  componentProps?: Record<string, any>;
  render?: (field: DynamicField, props: FormProps) => JSX.Element | null; // 自定义渲染
  disabled?: boolean; // 是否禁用
  group?: string | number; // 新增 group 属性,用于分组排版使用
  placeholder?: string;
  formItemProps?: FormItemProps;
}

export interface DynamicFormRef {
  submit: () => Promise<Record<string, any>>;
  reset: () => void;
  validate: () => Promise<Record<string, any>>;
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
  addField: (field: DynamicField) => void;
  removeField: (fieldName: string) => void;
  updateField: (fieldName: string, updates: Partial<DynamicField>) => void;
}
export interface DynamicFormProps extends FormProps {
  fields: DynamicField[];
  showOperate?: boolean;
  disabled?: boolean;
  formProps?: FormProps;
}
