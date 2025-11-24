/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect } from "react";
import { useDebouncedValidation } from "@/hooks/useDebounce";
import { RADIO_STATUS } from "@/constants";
import OSSUpload from "@/components/OSSUpload";
import { getCheckUser } from "@/api/user";
import { App } from "antd";

const UserForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { debouncedValidator } = useDebouncedValidation();
  const { message } = App.useApp();

  const colProps = {
    span: 12,
  };
  const formItemProps = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const colPropsFull = {
    span: 24,
  };
  const formItemPropsFull = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const validateData =
    (key: string, msg = "注册用户名已存在") =>
    async (value: string) => {
      return new Promise((resolve, reject) => {
        const params: any = {
          type_code: editData.type_code,
        };
        params[key] = value;
        getCheckUser(params).then(({ data }: any) => {
          if (data) {
            reject(msg);
          } else {
            resolve(true);
          }
        });
      });
    };

  const usernameRules: any = [
    { required: true, message: "必须输入注册用户名" },
  ];
  if (!isEdit) {
    usernameRules.push({
      validator: debouncedValidator(
        "username",
        validateData("username", "用户名已存在"),
        600
      ),
    });
  }
  const columns = [
    {
      title: "用户ID",
      name: "id",
      fieldProps: {
        disabled: true,
      },
      colProps: { span: 24 },
      formItemProps: {
        style: { display: "none" }, // 隐藏掉不占用空间
      },
    },
    {
      title: "用户名",
      name: "username",
      colProps,
      fieldProps: {
        disabled: isEdit,
      },
      formItemProps: {
        ...formItemProps,
        rules: usernameRules,
      },
    },
    {
      title: "归属部门",
      name: "dept_ids",
      colProps,
      formItemProps: {
        ...formItemProps,
        rules: usernameRules,
      },
    },
    {
      title: "用户昵称",
      name: "nickname",
      colProps,
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户昵称" }],
      },
    },
    isEdit
      ? undefined
      : {
          name: "password",
          title: "用户密码",
          colProps,
          fieldProps: {
            type: "password",
            allowClear: true,
          },
          formItemProps: {
            ...formItemProps,
            hasFeedback: true,
            rules: [{ required: true, message: "必须输入密码" }],
          },
        },
    isEdit
      ? undefined
      : {
          title: "确认密码",
          colProps,
          name: "confirm_password",
          fieldProps: {
            type: "password",
            allowClear: true,
          },
          formItemProps: {
            ...formItemProps,
            dependencies: ["password"],
            hasFeedback: true,
            rules: [
              { required: true, message: "请确认用户密码" },
              {
                validator(_: any, value: string) {
                  if (
                    !value ||
                    formRef.current.getFieldValue("password") === value
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码不一致"));
                },
              },
            ],
          },
        },
    isEdit
      ? undefined
      : {
          name: "avatar",
          title: "用户头像",
          renderFormItem: () => {
            return <OSSUpload isAvatar returnType="url"></OSSUpload>;
          },
          formItemProps: {
            ...formItemPropsFull,
            extra: "用户头像，图片不能小于5K且不能大于100K!",
            // rules: [
            //   {
            //     required: true,
            //     validator: (_: any, value: string) => {
            //       if (value && value.length > 0) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject("请上传用户头像");
            //     },
            //   },
            // ],
          },
          colProps: colPropsFull,
        },
    {
      name: "status",
      title: "状态",
      valueType: "radio",
      initialValue: 1,
      fieldProps: {
        optionType: "button",
        options: RADIO_STATUS,
      },
      formItemProps: formItemPropsFull,
      colProps: colPropsFull,
    },
    {
      name: "remark",
      title: "备注",
      valueType: "textarea",
      formItemProps: formItemPropsFull,
      colProps: colPropsFull,
    },
  ];
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);

  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      rowProps={{
        gutter: [16, 16],
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

export default UserForm;
