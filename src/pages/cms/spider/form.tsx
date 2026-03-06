/*
 * @Author: colpu
 * @Date: 2026-01-14 16:24:37
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 14:54:40
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import {
  ProForm,
  ProFormDigitRange,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, message, Space } from "antd";
import { formItemCol, formItemProps } from "@/constants/form";
import useToken from "antd/es/theme/useToken";
import { useAppSelector } from "@/store/hooks";
import { apiSpider, apiSpiderSchedule } from "@/api/cms/spider";
import { useNavigate, useParams } from "react-router";
import { urlToFileList } from "@/utils";
import { getClassifyTree } from "@/api/cms/classify";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/snippets/javascript";
// import "ace-builds/src-noconflict/snippets/typescript";
// import "ace-builds/src-noconflict/mode-json";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/ext-language_tools";
import AceEditor from "@/components/AceEditor";
import { apiSchedule } from "@/api/common";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SpiderForm = () => {
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.user);
  const { dict } = useAppSelector((state) => state.dict);
  const [initialValues, setInitialValues] = useState<any>({});
  const navigate = useNavigate();

  const [treeData, setTreeData] = useState<any[]>([]);
  const [, token] = useToken();
  useEffect(() => {
    getClassifyTree((item: any) => {
      if (item.type == 0) {
        item.disabled = true;
      }
    }).then(({ tree }) => {
      setTreeData(tree);
    });
  }, []);
  useEffect(() => {
    if (id) {
      apiSpider({ id }, "get")
        .then((res: any) => {
          res.src = urlToFileList({
            url: res.src,
            uid: "-1",
            status: "done",
          });
          const { start_page, end_page, ...reset } = res;
          const page_range = [start_page || 0, end_page];
          const data = { page_range, ...reset };
          setInitialValues(data);
          formRef.current?.setFieldsValue(data);
        })
        .catch((err: any) => {
          console.error(err);
          navigate(-1);
        });
    } else {
      formRef.current?.setFieldValue("author", user?.username);
    }
  }, [formRef, id, user, navigate]);
  const getPage = (pageRange: number[] = []) => {
    return {
      start_page: pageRange[0] || 0,
      end_page: pageRange[1] || 0,
    };
  };
  const onFinish = async (values: any) => {
    const { page_range, ...reset } = values;
    await apiSpider(
      {
        ...getPage(page_range),
        ...reset,
      },
      id ? "put" : "post",
    );
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
  const [testResult, setTestResult] = useState<any>();
  const onSpider = async (isTest?: boolean) => {
    const values = formRef.current?.getFieldsValue();
    const { page_range, ...reset } = values;
    await apiSpiderSchedule({
      ...getPage(page_range),
      ...reset,
      is_test: isTest,
    }).then(setTestResult);
  };
  const onSpiderSchedule = () => {
    const values = formRef.current?.getFieldsValue();
    const { id, status, rule } = values;
    const url = `${VITE_API_BASE_URL}/spider/schedule?id=${id}`;
    const newStatus = status ? 0 : 1;
    formRef.current?.setFieldValue("status", newStatus);
    setInitialValues((prev: any) => {
      return {
        ...prev,
        status: newStatus,
      };
    });
    apiSpider(
      {
        id,
        status: newStatus,
      },
      "put",
    );
    apiSchedule({ url, event: status ? "stop" : "start", rule });
  };
  const aceEditorOptions = {
    style: {
      width: "100%",
      height: 400,
      borderRadius: token.borderRadius,
    },
    placeholder: "请输入采集代码",
    mode: "javascript",
    theme: "monokai",
    name: "blah2",
    fontSize: 14,
    lineHeight: "1.5",
    showPrintMargin: false,
    showGutter: true,
    highlightActiveLine: true,
    setOptions: {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      enableMobileMenu: true,
      showLineNumbers: true,
      tabSize: 2,
      // useWorker: false,
    },
  };
  const ruleTips = (
    <AceEditor
      {...{
        fontSize: 12,
        lineHeight: "1",
        theme: "monokai",
        showGutter: false,
        highlightActiveLine: false,
        setOptions: {
          showLineNumbers: false,
          tabSize: 2,
          readOnly: true,
        },
      }}
      style={{ width: 240, height: 150 }}
      value={`规则:

*  *  *  *  *  *
│  │  │  │  │  └ dayOfWeek(0-7)
│  │  │  │  └─── month(1-12)
│  │  │  └────── day of month(1-31)
│  │  └───────── hour(0-23)
│  └──────────── minute(0-59)
└─────────────── second(0-59,OPTIONAL)

例如: */10 * * * * * 每10秒执行一次
`}
    />
  );
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
        <Col span={12}>
          <ProFormText
            name="id"
            label="采集ID"
            formItemProps={{ style: { display: "none" } }}
            fieldProps={{ disabled: true }}
          />
          <ProFormText
            name="status"
            label="状态"
            formItemProps={{ style: { display: "none" } }}
            fieldProps={{ disabled: true }}
          />
          <ProFormText
            name="title"
            label="采集名称"
            formItemProps={{
              ...formItemProps,
              rules: [{ required: true, message: "必须输采集名称" }],
            }}
          />
          <ProFormTreeSelect
            name="classify_id"
            label="选择栏目"
            formItemProps={{
              ...formItemProps,
              rules: [{ required: true, message: "必须选择栏目" }],
            }}
            fieldProps={{
              showSearch: false,
              placeholder: "请选择栏目",
              fieldNames: {
                label: "name",
                value: "id",
                children: "children",
              },
              treeData,
            }}
          />
          <ProFormText
            name="url"
            label="采集地址"
            formItemProps={{
              ...formItemProps,
            }}
            rules={[
              {
                required: true,
                message: "采集地址必须以http://或https://开头",
                pattern: /^(https?:\/\/)/,
              },
            ]}
            extra={
              <span style={{ fontSize: 12 }}>
                输入要采集的页面`{"{page}"}`代表采集的页码，单页采集不需要此标识
              </span>
            }
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="charset"
            label="页面编码"
            formItemProps={formItemProps}
            fieldProps={{
              defaultValue: dict.charset.default || 0,
              placeholder: "请选择编码格式",
              options: dict.charset.options,
            }}
          />
          <ProFormDigitRange
            name="page_range"
            label="采集页码"
            formItemProps={formItemProps}
            extra={<span style={{ fontSize: 12 }}>页码包含开始页和结束页</span>}
          />
          <ProFormText
            name="rule"
            label="执行周期"
            formItemProps={formItemProps}
            fieldProps={{ placeholder: "请输入Cron表达式例如：0 0 0 12 * *" }}
            tooltip={ruleTips}
            extra={
              <span style={{ fontSize: 12 }}>
                请输入Cron表达式分别对应 秒 分 时 日 月 周，例如：0 0 0 12 * *
              </span>
            }
          />
        </Col>
        <Col span={24}>
          <ProForm.Item
            name="parse_data"
            label="解析数据"
            rules={[{ required: true, message: "必须输入解析数据" }]}
            extra={
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <Button
                      color="lime"
                      variant="solid"
                      size="small"
                      style={{ marginTop: 5 }}
                      onClick={() => onSpider(true)}
                    >
                      测试
                    </Button>
                    <Button
                      type={initialValues.status ? "default" : "primary"}
                      variant="solid"
                      size="small"
                      style={{ marginTop: 5,}}
                      onClick={() => onSpiderSchedule()}
                    >
                      {initialValues.status === 0 ? "开启采集" : "关闭采集"}
                    </Button>
                  </Space>
                </div>
                <AceEditor
                  {...{
                    ...aceEditorOptions,
                    mode: "json",
                    // theme: "github",
                    placeholder: "暂无测试结果～",
                    setOptions: {
                      ...aceEditorOptions.setOptions,
                      readOnly: true,
                    },
                    style: {
                      ...aceEditorOptions.style,
                      height: 100,
                      marginTop: 5,
                      border: "1px solid #efefef",
                    },
                  }}
                  value={JSON.stringify(testResult, null, 2)}
                />
              </>
            }
          >
            <AceEditor {...aceEditorOptions} />
          </ProForm.Item>
        </Col>
      </ProForm>
    </Card>
  );
};
export default SpiderForm;
