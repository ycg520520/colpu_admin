/*
 * @Author: colpu
 * @Date: 2025-06-26 16:59:48
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-10 15:08:54
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import { ProFormCaptcha, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { sendLoginSms } from "@/api/auth";

type PhoneFormProps = {
  token: any;
  getMobile?: () => string | undefined;
};

export default function PhoneForm({ token, getMobile }: PhoneFormProps) {
  const { t } = useTranslation();
  return (
    <>
      <ProFormText
        fieldProps={{
          size: "large",
          prefix: (
            <MobileOutlined
              style={{
                color: token.colorText,
              }}
              className={"prefixIcon"}
            />
          ),
        }}
        name="mobile"
        placeholder={t("pages.login.phone.placeholder", {
          defaultValue: "手机号",
        })}
        rules={[
          {
            required: true,
            message: t("pages.login.phone.required", {
              defaultValue: "请输入手机号！",
            }),
          },
          {
            pattern: /^1\d{10}$/,
            message: t("pages.login.phone.invalid", {
              defaultValue: "手机号格式错误！",
            }),
          },
        ]}
      />
      <ProFormCaptcha
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
        captchaProps={{
          size: "large",
        }}
        placeholder={t("pages.login.captcha.placeholder", {
          defaultValue: "请输入验证码",
        })}
        captchaTextRender={(timing, count) => {
          const txt = t("pages.login.captcha.fetch", {
            defaultValue: "获取验证码",
          });
          if (timing) {
            return `${count} ${txt}`;
          }
          return txt;
        }}
        name="captcha"
        rules={[
          {
            required: true,
            message: t("pages.login.captcha.required", {
            defaultValue: "请输入验证码！",
          }),
          },
        ]}
        onGetCaptcha={async () => {
          const mobile = getMobile?.();
          if (!mobile || !/^1\d{10}$/.test(mobile)) {
            message.warning("请先输入正确的手机号");
            throw new Error("invalid mobile");
          }
          try {
            const res: any = await sendLoginSms(mobile);
            const tip =
              res?.mock_code != null
                ? `验证码已发送（开发环境：${res.mock_code}）`
                : "验证码已发送";
            message.success(tip);
          } catch (e: any) {
            message.error(e?.message || "发送失败");
            throw e;
          }
        }}
      />
    </>
  );
}
