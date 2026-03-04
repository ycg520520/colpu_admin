/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Col, message, Row, Space, Tabs } from "antd";
import IconPicker from "@/components/IconPicker";
import {
  colProps,
  colSpan,
  formItemCol,
  formItemProps,
} from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import { getClassifyTree } from "@/api/cms/classify";
import { cloneDeep } from "lodash";

const ClassifyForm = (props: any) => {
  const { title, open, isEdit, editData, modalProps, formRef } = props;
  const { dict } = useAppSelector((state) => state.dict);

  useEffect(() => {
    formRef.current?.setFieldsValue({ ...editData });
  }, [editData, formRef]);

  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    getClassifyTree().then(({ tree }) => {
      setTreeData(tree);
    });
  }, []);

  const onCancel = () => {
    formRef.current?.resetFields();
    modalProps.onCancel();
  };
  const onFinish = async (values: any) => {
    await props.onFinish(values);
    message.success("提交成功");
    return true;
  };
  return (
    <ModalForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      grid
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      layout="horizontal"
      modalProps={{
        width: 640,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel,
      }}
      open={open}
      submitter={false}
      onFinish={onFinish}
    >
      <ProFormText
        name="id"
        label="栏目ID"
        colProps={colProps}
        formItemProps={{ ...formItemProps, style: { display: "none" } }}
        fieldProps={{ disabled: true }}
      />
      <Tabs
        size="small"
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
                <ProFormTreeSelect
                  name="parent_id"
                  label="上级栏目"
                  fieldProps={{
                    showSearch: false,
                    placeholder: "请选择上级栏目",
                    fieldNames: {
                      label: "name",
                      value: "id",
                      children: "children",
                    },
                    treeData,
                  }}
                />
                <ProFormSelect
                  name="template"
                  label="使用模板"
                  colProps={colProps}
                  formItemProps={{
                    ...formItemProps,
                    rules: [{ required: true, message: "必须选择使用模版" }],
                  }}
                  fieldProps={{
                    options: cloneDeep(
                      dict.template ? dict.template.options : [],
                    ),
                    fieldNames: {
                      value: "code",
                    },
                  }}
                />
                <ProFormRadio.Group
                  name="type"
                  label="栏目类型"
                  colProps={colProps}
                  formItemProps={formItemProps}
                  initialValue={dict.page_type.defaultValue || 1}
                  fieldProps={{
                    optionType: "button",
                    options: dict.page_type.options,
                  }}
                />
                <ProFormText
                  name="name"
                  label="栏目名称"
                  colProps={colProps}
                  formItemProps={{
                    ...formItemProps,
                    rules: [{ required: true, message: "必须输入栏目名称" }],
                  }}
                />
                <Col {...colProps}>
                  <ProForm.Item name="icon" label="栏目图标" {...formItemProps}>
                    <IconPicker isCopy={false} />
                  </ProForm.Item>
                </Col>
                <ProFormText
                  name="path"
                  label="栏目路径"
                  colProps={colProps}
                  formItemProps={formItemProps}
                />
                <ProFormText
                  name="code"
                  label="栏目标识"
                  colProps={colProps}
                  formItemProps={formItemProps}
                />
              </Row>,
            ],
          },
          {
            key: "seo",
            label: "SEO设置",
            children: [
              <Row>
                <ProFormText name="title" label="SEO标题" />
                <ProFormText name="keywords" label="SEO关键字" />
                <ProFormTextArea name="description" label="SEO描述" />
              </Row>,
            ],
          },
          {
            key: "extend",
            label: "扩展信息",
            children: [
              <Row>
                <ProFormText
                  name="url"
                  label="外部链接"
                  colProps={colSpan(16)}
                  formItemProps={formItemCol(6)}
                />
                <ProFormRadio.Group
                  name="target"
                  label="打开方式"
                  colProps={colProps}
                  formItemProps={formItemProps}
                  fieldProps={{
                    defaultValue: 1,
                    options: dict.target.options,
                  }}
                />
                <ProFormRadio.Group
                  name="status"
                  label="状态"
                  colProps={colProps}
                  formItemProps={formItemProps}
                  fieldProps={{
                    defaultValue: 1,
                    options: dict.enabled_status.options,
                  }}
                />
                <ProFormDigit name="sort_order" label="排序" />
                <ProFormTextArea name="description" label="栏目描述" />
              </Row>,
            ],
          },
        ]}
      />
      {/* 手动验证，原因存储tabs切换，验证可能不在当前tab */}
      <Space
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <Button onClick={onCancel}>取消</Button>
        <Button
          type="primary"
          onClick={async () => {
            try {
              const values = await formRef.current?.validateFields();
              await onFinish(values);
            } catch (err: any) {
              console.log("校验失败:", err);
              message.error(err.message);
            }
          }}
        >
          提交
        </Button>
      </Space>
    </ModalForm>
  );
};

export default ClassifyForm;
