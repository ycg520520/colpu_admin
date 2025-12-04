/*
 * @Author: colpu
 * @Date: 2025-11-10 15:20:40
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-03 23:14:30
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect } from "react";
import { message } from "antd";
import { checkDictTypes } from "@/api/dict";
import { useAppSelector } from "@/store/hooks";
const TypeForm = (props: any) => {
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
    (key: string, msg = "数据标签已存在") =>
    async (value: string) => {
      return new Promise((resolve, reject) => {
        const initValue = formRef.current?.getFieldValue(key);
        // 如果值没变，跳过远程验证
        if (value === initValue) {
          return resolve(true);
        }
        const params: any = {};
        params[key] = value;
        checkDictTypes(params).then((res) => {
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
      name: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      colProps: { span: 24, style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "字典名称",
      name: "name",
      colProps,
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入字典名称" }],
      },
    },
    {
      title: "字典类型",
      name: "type_code",
      colProps,
      formItemProps: {
        ...formItemProps,
        validateDebounce: 600,
        rules: [
          {
            required: true,
            message: "请输入字典类型",
          },
          {
            validator: async (_: any, value: any) => {
              return validateData("type_code")(value);
            },
          },
        ],
      },
    },
    {
      name: "status",
      title: "状态",
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
      name: "sort_order",
      valueType: "digit",
      fieldProps: {
        min: 0,
        max: 1e10,
      },
      formItemProps,
      colProps,
    },
    {
      name: "remark",
      title: "备注",
      valueType: "textarea",
      formItemProps: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      colProps: { span: 24 },
    },
  ];
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

export default TypeForm;
