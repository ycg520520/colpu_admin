/*
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-13 16:20:38
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  message,
  Row,
  Select,
  Space,
  Tabs,
  UploadFile,
} from "antd";
import { formItemCol, formItemProps } from "@/constants/form";
import { useAppSelector } from "@/store/hooks";
import { getClassifyTree } from "@/api/cms/classify";
import { cloneDeep } from "lodash";
import RichTextEditor from "@/components/RichTextEditor";
import { apiArticle } from "@/api/cms/article";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import { createStyles } from "antd-style";
import { getTagsAll } from "@/api/cms/tags";
const CustomSelect = (props: any) => {
  const { onOpen, ...rest } = props;
  return (
    <Flex style={{ width: "100%", alignItems: "center" }}>
      <Select style={{ flex: 1 }} {...rest} />
      <Button color="primary" size="small" variant="link" onClick={onOpen}>
        标签管理
      </Button>
    </Flex>
  );
};
const useStyles = createStyles(() => ({
  upload: {
    "& .ant-upload-list-item-container": {
      width: "100px!important",
      height: "75px!important",
    },
  },
}));
const ArticleForm = () => {
  const navigate = useNavigate();
  const { dict } = useAppSelector((state) => state.dict);
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const { id } = useParams();
  const { styles } = useStyles();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [classifyMap, setClassifyMap] = useState<any>({});
  const [tagsData, setTagsData] = useState<any[]>([]);
  const [articleType, setArticleType] = useState(1);
  const [initialValues, setInitialValues] = useState<any>({});
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    getClassifyTree((item: any) => {
      if (item.type == 0) {
        item.disabled = true;
      }
    }).then(({ tree, data }) => {
      const maps: any = {};
      data.map((item: any) => {
        maps[item.id] = item;
      });
      setClassifyMap(maps);
      setTreeData(tree);
    });
    getTagsAll().then((res: any) => {
      setTagsData(res);
    });
  }, []);
  useEffect(() => {
    if (id) {
      apiArticle({ id }, "get").then((res: any) => {
        res.thumb = urlToFileList({
          url: res.thumb,
          uid: "-1",
          status: "done",
        });
        setInitialValues(res);
        formRef.current?.setFieldsValue(res);
      });
    } else {
      formRef.current?.setFieldValue("author", user?.username);
    }
  }, [formRef, id, user]);

  const onFinish = async (values: any) => {
    debugger
    await apiArticle(values, id ? "put" : "post");
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
    <Card style={{ border: "none" }}>
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
                      name="id"
                      label="栏目ID"
                      formItemProps={{ style: { display: "none" } }}
                      fieldProps={{ disabled: true }}
                    />
                    <ProFormText
                      name="page_type"
                      label="页面类型"
                      formItemProps={{ style: { display: "none" } }}
                      fieldProps={{ disabled: true }}
                    />
                    <ProFormTreeSelect
                      name="classify_id"
                      label="选择栏目"
                      formItemProps={formItemProps}
                      fieldProps={{
                        showSearch: false,
                        placeholder: "请选择栏目",
                        fieldNames: {
                          label: "name",
                          value: "id",
                          children: "children",
                        },
                        onChange: (value) => {
                          const type = classifyMap[value].type;
                          formRef.current?.setFieldValue("page_type", type);
                          setArticleType(type);
                        },
                        treeData,
                      }}
                    />
                    <ProFormText
                      name="title"
                      label="文章标题"
                      formItemProps={{
                        ...formItemProps,
                        rules: [{ required: true, message: "必须输文章标题" }],
                      }}
                    />
                    {articleType == 1 ? (
                      <ProFormText
                        name="subtitle"
                        label="副标题"
                        formItemProps={formItemProps}
                      />
                    ) : null}
                    {articleType == 1 ? (
                      <ProFormSelect
                        name="type"
                        label="推荐类型"
                        formItemProps={formItemProps}
                        fieldProps={{
                          placeholder: "请选择推荐类型",
                          options: cloneDeep(dict.article_type.options || []),
                        }}
                      />
                    ) : null}
                    {articleType == 1 ? (
                      <Form.Item
                        label="TAG标签"
                        name="tag_ids"
                        {...formItemProps}
                      >
                        <CustomSelect
                          options={tagsData}
                          mode="multiple"
                          maxTagCount={3}
                          maxCount={10}
                          fieldNames={{
                            label: "name",
                            value: "id",
                          }}
                          onOpen={() => {
                            navigate("/cms/tags");
                          }}
                        />
                      </Form.Item>
                    ) : null}
                    <ProFormText
                      name="author"
                      label="发布者"
                      disabled={true}
                      formItemProps={formItemProps}
                    />
                    <ProFormDateTimePicker
                      name="published_at"
                      label="发布时间"
                      initialValue={dayjs().format("YYYY-MM-DD HH:mm:ss")}
                      formItemProps={formItemProps}
                      fieldProps={{ style: { width: "100%" } }}
                    />
                    <ProForm.Item
                      label="封面图"
                      name="thumb"
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
                  </Col>
                  <Col span={24}>
                    {articleType == 1 ? (
                      <ProFormTextArea
                        name="summary"
                        label="内容摘要"
                        style={{ height: 75 }}
                      />
                    ) : null}
                    <ProForm.Item
                      name="content"
                      label="文章内容"
                      {...formItemCol(4)}
                    >
                      <RichTextEditor />
                    </ProForm.Item>
                  </Col>
                </Row>,
              ],
            },
            {
              key: "extend",
              label: "扩展信息",
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
                    <ProFormText
                      name="url"
                      label="外部链接"
                      formItemProps={formItemProps}
                    />
                    <ProFormRadio.Group
                      name="target"
                      label="打开方式"
                      formItemProps={formItemProps}
                      fieldProps={{
                        defaultValue: 1,
                        options: dict.target.options,
                      }}
                    />
                    <ProFormRadio.Group
                      name="status"
                      label="状态"
                      formItemProps={formItemProps}
                      fieldProps={{
                        defaultValue: 1,
                        options: dict.enabled_status.options,
                      }}
                    />
                    <ProFormDigit
                      name="sort_order"
                      label="排序"
                      formItemProps={formItemProps}
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

export default ArticleForm;
