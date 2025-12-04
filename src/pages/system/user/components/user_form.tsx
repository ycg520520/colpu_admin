/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { getCheckUser } from "@/api/user";
import { App } from "antd";
import { useAppSelector } from "@/store/hooks";
import { apiUserParty } from "@/api/common";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { cloneDeep } from "lodash";

const UserForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const { dict } = useAppSelector((state) => state.dict);
  const treeData = useAppSelector((state) => cloneDeep(state.dept.treeData));
  const { message } = App.useApp();
  const [userPart, setUserPart] = useState({ depts: [], roles: [], posts: [] });
  useEffect(() => {
    fetchUserPart();
  }, []);
  const fetchUserPart = async () => {
    apiUserParty().then((data: any) => {
      setUserPart(data);
    });
  };

  const validateData =
    (key: string, msg = "注册用户名已存在") =>
    async (value: string) => {
      return new Promise((resolve, reject) => {
        const initValue = formRef.current?.getFieldsValue(key);
        // 如果值没变，跳过远程验证
        if (value === initValue) {
          return resolve(true);
        }
        const params: any = {};
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
      validator: (_: any, value: any) => {
        return validateData("username", "用户名已存在")(value);
      },
    });
  }
  const columns = [
    {
      title: "用户ID",
      name: "id",
      dataIndex: "id",
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
      dataIndex: "username",
      colProps,
      fieldProps: {
        disabled: isEdit,
      },
      formItemProps: {
        ...formItemProps,
        validateDebounce: 600, // 防抖
        rules: usernameRules,
      },
    },
    {
      title: "手机号",
      name: "phone",
      dataIndex: "phone",
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户手机号" }],
      },
    },
    {
      title: "用户邮箱",
      name: "email",
      dataIndex: "email",
      formItemProps: {
        ...formItemProps,
        rules: [{ required: true, message: "请输入用户邮箱" }],
      },
    },
    isEdit
      ? undefined
      : {
          name: "password",
          dataIndex: "password",
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
    {
      title: "性别",
      name: "gender",
      dataIndex: "gender",
      valueType: "select",
      fieldProps: {
        options: dict.gender.options,
      },
      formItemProps,
    },
    {
      name: "status",
      dataIndex: "status",
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
      title: "归属部门",
      name: "dept_ids",
      dataIndex: "dept_ids",
      valueType: "treeSelect",
      fieldProps: {
        multiple: true,
        maxCount: 5,
        maxTagCount: 3,
        treeData,
        fieldNames: {
          label: "name",
          value: "id",
          children: "children",
        },
      },
      colProps: colPropsFull,
      formItemProps: formItemPropsFull,
    },
    {
      title: "岗位",
      name: "post_ids",
      dataIndex: "post_ids",
      valueType: "select",
      fieldProps: {
        mode: "multiple",
        maxCount: 3,
        maxTagCount: 1,
        options: userPart.posts,
        fieldNames: {
          label: "name",
          value: "id",
        },
      },
      colProps,
      formItemProps,
    },
    {
      title: "角色",
      name: "role_ids",
      dataIndex: "role_ids",
      valueType: "select",
      fieldProps: {
        mode: "multiple",
        maxCount: 3,
        maxTagCount: 1,
        options: userPart.roles,
        fieldNames: {
          label: "name",
          value: "id",
        },
      },
      colProps,
      formItemProps,
    },
    {
      name: "remark",
      dataIndex: "remark",
      title: "备注",
      valueType: "textarea",
      formItemProps: formItemPropsFull,
      colProps: colPropsFull,
    },
  ].filter((item) => !!item);
  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);

  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      colProps={colProps}
      grid
      layout="horizontal"
      shouldUpdate={(newValues, oldValues) => {
        return newValues !== oldValues;
      }}
      modalProps={{
        width: 640,
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
