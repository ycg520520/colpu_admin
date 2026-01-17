/*
 * @Author: colpu
 * @Date: 2026-01-14 16:24:37
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-16 16:29:23
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Card, Col, message, Row, Space, UploadFile } from "antd";
import { formItemCol, formItemProps } from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import RichTextEditor from "@/components/RichTextEditor";
import { apiSlider } from "@/api/cms/slider";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import { createStyles } from "antd-style";
import { domainReg } from "@/constants/regex";
const useStyles = createStyles(() => ({
  upload: {
    "& .ant-upload-list-item-container": {
      width: "100px!important",
      height: "75px!important",
    },
  },
}));
const SliderForm = () => {
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const { id } = useParams();
  const { styles } = useStyles();
  const { user } = useAppSelector((state) => state.user);
  const [initialValues, setInitialValues] = useState<any>({});
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      apiSlider({ id }, "get")
        .then((res: any) => {
          res.src = urlToFileList({
            url: res.src,
            uid: "-1",
            status: "done",
          });
          setInitialValues(res);
          formRef.current?.setFieldsValue(res);
        })
        .catch((err: any) => {
          console.error(err);
          navigate(-1);
        });
    } else {
      formRef.current?.setFieldValue("author", user?.username);
    }
  }, [formRef, id, user, navigate]);

  const onFinish = async (values: any) => {
    await apiSlider(values, id ? "put" : "post");
    message.success(id ? "更新成功" : "提交成功");
    navigate(-1);
    return true;
  };
  const onReset = () => {
    if (id) {
      formRef.current?.setFieldsValue(initialValues);
    } else {
      formRef.current?.resetFields();
    }
  };
  return (
    <Card style={{ border: "none", paddingTop: 20 }}>
      <ProForm
        formRef={formRef}
        grid
        {...formItemCol()}
        layout="horizontal"
        onFinish={onFinish}
        onReset={onReset}
        submitter={{
          searchConfig: {
            submitText: id ? "修改" : "保存",
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
        <Row>
          <Col span={12}>
            <ProFormText
              name="id"
              label="栏目ID"
              formItemProps={{ style: { display: "none" } }}
              fieldProps={{ disabled: true }}
            />
            <ProFormText
              name="title"
              label="轮播标题"
              formItemProps={{
                ...formItemProps,
                rules: [{ required: true, message: "必须输文章标题" }],
              }}
            />
            <ProFormDateTimePicker
              name="published_at"
              label="发布时间"
              initialValue={dayjs().format("YYYY-MM-DD HH:mm:ss")}
              formItemProps={formItemProps}
              fieldProps={{ style: { width: "100%" } }}
            />
            <ProForm.Item
              label="轮播图"
              name="src"
              {...formItemCol(8)}
              rules={[{ required: true, message: "必须上传轮播图片" }]}
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
                  aspect: 1 / 0.75,
                }}
                uploadProps={{
                  maxCount: 1,
                  multiple: false,
                  listType: "picture-card",
                  style: {
                    width: 100,
                    height: 75,
                  },
                  className: styles.upload,
                }}
              />
            </ProForm.Item>
            <ProFormText
              name="url"
              label="轮播链接"
              formItemProps={formItemProps}
              rules={[{
                message: "必须输入轮播链接",
                pattern: domainReg,
              }]}
            />
          </Col>
          <Col span={24}>
            <ProForm.Item name="content" label="轮播内容" {...formItemCol(4)}>
              <RichTextEditor />
            </ProForm.Item>
          </Col>
        </Row>
      </ProForm>
    </Card>
  );
};

export default SliderForm;
