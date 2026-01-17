/*
 * @Author: colpu
 * @Date: 2025-11-03 10:36:35
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-17 15:44:34
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect } from "react";
import { message } from "antd";
import { checkDictData } from "@/api/dict";
import { useAppSelector } from "@/store/hooks";

const DataForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { dict } = useAppSelector((state) => state.dict);
  const colProps = {
    span: 12,
  };
  const formItemProps = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const validateData =
    (key: string, initData: any, msg = "数据标签已存在") =>
    async (value: string) => {
      return new Promise((resolve, reject) => {
        const initValue = initData[key];
        // 如果值没变，跳过远程验证
        if (value === initValue) {
          return resolve(true);
        }
        const params: any = {
          type_code: initData.type_code,
        };
        params[key] = value;
        checkDictData(params).then((res) => {
          if (res) {
            reject(msg);
          } else {
            resolve(true);
          }
        });
      });
    };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      colProps: { span: 24, style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "字典类型",
      dataIndex: "type_code",
      colProps,
      fieldProps: {
        disabled: true,
      },
      formItemProps,
    },
    {
      title: "数据标签",
      dataIndex: "label",
      colProps,
      formItemProps: {
        ...formItemProps,
        validateDebounce: 600, // 防抖
        rules: [
          { required: true, message: "请输入数据标签" },
          ...(isEdit
            ? []
            : [
                {
                  validator: (_: any, value: any) => {
                    return validateData("label", editData)(value);
                  },
                },
              ]),
        ],
      },
    },
    {
      title: "数据键值",
      dataIndex: "value",
      colProps,
      fieldProps: {
        allowClear: true,
      },
      formItemProps: {
        ...formItemProps,
        validateDebounce: 600,
        rules: [
          { required: true, message: "请输入数据键值" },
          ...(isEdit
            ? []
            : [
                {
                  validator: (_: any, value: any) => {
                    return validateData("value", editData)(value);
                  },
                },
              ]),
        ],
      },
    },
    {
      title: "数据编码",
      dataIndex: "code",
      colProps,
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入数据编码" }],
      },
    },
    {
      title: "回显样式",
      dataIndex: "css_class",
      fieldProps: {
        allowClear: true,
      },
      formItemProps,
      colProps,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "radio",
      initialValue: 1,
      fieldProps: {
        optionType: "button",
        options: dict.enabled_status.options,
      },
      formItemProps,
      colProps,
    },
    {
      title: "排序",
      dataIndex: "sort_order",
      valueType: "digit",
      fieldProps: {
        min: 0,
        max: 1e10,
      },
      formItemProps,
      colProps,
    },
    {
      title: "是否默认",
      dataIndex: "is_default",
      valueType: "radio",
      fieldProps: {
        defaultValue: 0,
        options: [
          {
            label: "是",
            value: 1,
          },
          {
            label: "否",
            value: 0,
          },
        ],
      },
      formItemProps,
      colProps,
    },
    {
      title: "备注",
      dataIndex: "remark",
      valueType: "textarea",
      formItemProps: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      colProps: { span: 24 },
    },
  ].filter(Boolean);
  useEffect(() => {
    formRef.current?.setFieldsValue(editData);
  }, [editData, formRef]);
  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      rowProps={{
        gutter: [16, 0],
      }}
      colProps={{
        span: 12,
      }}
      grid
      layout="horizontal"
      shouldUpdate={(newValues, oldValues) => {
        return newValues !== oldValues;
      }}
      modalProps={{
        width: 560,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel: () => {
          formRef.current?.resetFields();
          modalProps.onCancel();
        },
      }}
      open={open}
      layoutType="ModalForm"
      onReset={() => {
        console.log("reset");
      }}
      onFinish={async (values) => {
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={columns}
    />
  );
};

export default DataForm;
