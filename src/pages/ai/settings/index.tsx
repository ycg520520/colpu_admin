/*
 * @Author: colpu
 * @Date: 2026-05-22 10:53:00
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-05-23 14:31:44
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
/*
 * AI 全局配置 — 表单布局对齐 cms/site
 */
import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Card, Col, message, Space } from "antd";
import { formItemCol, formItemProps } from "@/constants/form";
import { getAiAdSettings, updateAiAdSettings } from "@/api/ai/ads";
import { useAppSelector } from "@/store/hooks";
import { hasPermissions } from "@/utils/permissions";

const AiGlobalSettingsForm = () => {
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const { user } = useAppSelector((state) => state.user);
  const canEdit = hasPermissions(user?.permissions || [], "ai:settings:edit");

  useEffect(() => {
    getAiAdSettings().then((res: any) => {
      const values = {
        splash_countdown: res?.splash_countdown ?? 5,
        default_point: res?.default_point ?? 15,
      };
      setEditData(values);
      formRef.current?.setFieldsValue(values);
    });
  }, [formRef]);

  const onFinish = async (values: any) => {
    await updateAiAdSettings(values);
    message.success("全局配置已保存");
    setEditData(values);
    return true;
  };

  return (
    <Card style={{ border: "none" }}>
      <ProForm
        formRef={formRef}
        grid
        {...formItemCol()}
        layout="horizontal"
        onFinish={onFinish}
        submitter={{
          resetButtonProps: false,
          searchConfig: {
            submitText: Object.keys(editData).length > 0 ? "保存" : "提交",
          },
          submitButtonProps: { disabled: !canEdit },
          render: (_props, doms) => (
            <Col span={20} offset={4}>
              <Space>{doms}</Space>
            </Col>
          ),
        }}
      >
        <Col span={12}>
          <ProFormDigit
            name="default_point"
            label="默认扣点"
            min={1}
            fieldProps={{ precision: 0, style: { width: "100%" } }}
            formItemProps={{
              ...formItemProps,
              rules: [{ required: true, message: "请输入默认扣点" }],
            }}
          />
          <ProFormDigit
            name="splash_countdown"
            label="开屏倒计时"
            min={1}
            max={60}
            fieldProps={{
              precision: 0,
              addonAfter: "秒",
              style: { width: "100%" },
            }}
            formItemProps={{
              ...formItemProps,
              rules: [{ required: true, message: "请输入开屏倒计时" }],
            }}
          />
        </Col>
      </ProForm>
    </Card>
  );
};

export default AiGlobalSettingsForm;
