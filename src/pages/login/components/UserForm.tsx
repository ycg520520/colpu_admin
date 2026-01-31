/*
 * @Author: colpu
 * @Date: 2025-06-26 16:52:43
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 09:39:54
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { EllipsisOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProFormText } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
export default function UserForm({ token }: { token: any }) {
  const { t } = useTranslation();
  return (
    <>
      <ProFormText
        name="username"
        fieldProps={{
          size: "large",
          prefix: (
            <UserOutlined
              style={{
                color: token.colorText,
              }}
              className={"prefixIcon"}
            />
          ),
        }}
        placeholder={t("pages.login.username.placeholder", {
          defaultValue: "用户名: admin or manager or editor",
        })}
        initialValue="superadmin"
        rules={[
          {
            required: true,
            message: t("pages.login.username.required", {
              defaultValue: "请输入用户名!",
            }),
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        initialValue="admin"
        fieldProps={{
          size: "large",
          prefix: (
            <LockOutlined
              style={{
                color: token.colorText,
              }}
              className={"prefixIcon"}
            />
          ),
        }}
        placeholder={t("pages.login.password.placeholder", {
          defaultValue: "密码: admin",
        })}
        rules={[
          {
            required: true,
            message: t("pages.login.username.required", {
              defaultValue: "请输入密码！",
            }),
          },
        ]}
      />
    </>
  );
}
