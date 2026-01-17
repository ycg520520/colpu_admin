/*
 * @Author: colpu
 * @Date: 2026-01-15 16:01:17
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-15 21:54:52
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import {
  Group,
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Card, Col, message, Row, Space, Tabs, UploadFile } from "antd";
import { formItemCol, formItemProps } from "@/constants/form";
import { useNavigate } from "react-router";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import { apiSite } from "@/api/cms/sites";
const SiteForm = () => {
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    apiSite({}, "get").then((res: any) => {
      res.logo = urlToFileList({
        url: res.logo,
        uid: "-1",
        status: "done",
      });
      setEditData(res);
      formRef.current?.setFieldsValue(res);
    });
  }, [formRef]);

  const onFinish = async (values: any) => {
    const isEdit = Object.keys(editData).length > 0;
    await apiSite(values, isEdit ? "put" : "post");
    message.success(isEdit ? "更新成功" : "提交成功");
    navigate(-1);
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
            submitText: editData.id ? "编辑" : "提交",
          },
          render: (_props, doms) => {
            return (
              <Col span={20} offset={4}>
                <Space>{doms}</Space>
              </Col>
            );
          },
        }}
      >
        <ProFormText
          name="id"
          label="站点ID"
          formItemProps={{ style: { display: "none" } }}
          fieldProps={{ disabled: true }}
        />
        <Tabs
          size="small"
          style={{ width: "100%" }}
          items={[
            {
              key: "basic",
              label: "基础信息",
              style: {
                padding: "0 10px",
                margin: "0 5px 20px",
              },
              children: [
                <Row>
                  <Col span={12}>
                    <ProFormText
                      name="name"
                      label="网站名称"
                      formItemProps={{
                        ...formItemProps,
                        rules: [{ required: true, message: "必须输网站名称" }],
                      }}
                    />
                    <ProForm.Item
                      label="Logo"
                      name="logo"
                      {...formItemCol(8)}
                      valuePropName="fileList"
                      getValueFromEvent={(evt: any) => {
                        return evt.fileList;
                      }}
                      transform={(value: UploadFile[]) => {
                        // 转换提交时数据
                        const res = value?.[0] || {};
                        return res.url;
                      }}
                    >
                      <CustomUpload
                        imgCropProps={{
                          aspect: 1,
                        }}
                        uploadProps={{
                          maxCount: 1,
                          multiple: false,
                          listType: "picture-card",
                          style: {
                            width: 96,
                            height: 96,
                          },
                        }}
                      />
                    </ProForm.Item>
                    <ProFormText
                      name="domain"
                      label="网站域名"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="email"
                      label="站长邮箱"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="wx"
                      label="微信"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="icp"
                      label="ICP备案号"
                      formItemProps={formItemProps}
                    />
                    <ProFormTextArea
                      name="code"
                      label="统计代码"
                      formItemProps={formItemProps}
                    />
                  </Col>
                </Row>,
              ],
            },
            {
              key: "seo",
              label: "SEO设置",
              children: [
                <Row>
                  <Col span={12}>
                    <ProFormText
                      name="title"
                      label="SEO标题"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="keywords"
                      label="SEO关键字"
                      formItemProps={formItemProps}
                    />
                    <ProFormTextArea
                      name="description"
                      label="SEO描述"
                      formItemProps={formItemProps}
                    />
                  </Col>
                </Row>,
              ],
            },
            {
              key: "config",
              label: "应用配置",
              children: [
                <Row>
                  <Col span={12}>
                    <ProFormSelect
                      name="template"
                      label="模板"
                      formItemProps={formItemProps}
                      options={[
                        { value: 1, label: "default" },
                      ]}
                    />
                    <ProFormRadio.Group
                      name="upload_type"
                      label="上传方式"
                      formItemProps={formItemProps}
                      options={[
                        { value: 1, label: "普通上传" },
                        { value: 2, label: "阿里云" },
                        { value: 3, label: "七牛云" },
                      ]}
                    />
                  </Col>
                </Row>,
              ],
            },
          ]}
        ></Tabs>
      </ProForm>
    </Card>
  );
};

export default SiteForm;
