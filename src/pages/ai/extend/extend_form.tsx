import {
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, InputNumber, message, Row, Space, Tabs } from "antd";
import { useNavigate, useParams } from "react-router";
import { formItemCol, formItemProps, formItemPropsFull } from "@/constants/form";
import {
  createAiExtend,
  getAiExtendClassifyOptions,
  getAiExtendDetail,
  updateAiExtend,
} from "@/api/ai/extend";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import { getImageSrc } from "@/utils/image";
import {
  extendFormDefaults,
  fromExtendFormValues,
  toExtendFormValues,
} from "./form_utils";

const yesNo = [
  { label: "否", value: 0 },
  { label: "是", value: 1 },
];

export default function AiExtendFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>(
    {},
  );
  const [classifyOptions, setClassifyOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    getAiExtendClassifyOptions().then((rows: any) => {
      setClassifyOptions(
        (rows || []).map((r: any) => ({
          label: `${r.name}${r.model ? ` (${r.model})` : ""}`,
          value: r.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (id) {
      getAiExtendDetail(id)
        .then((res: any) => {
          const values = toExtendFormValues(res);
          if (res.src) {
            values.src_files = urlToFileList({
              url: getImageSrc(res.src),
              uid: "-1",
              status: "done",
            });
          }
          if (res.original_src) {
            values.original_src_files = urlToFileList({
              url: getImageSrc(res.original_src),
              uid: "-2",
              status: "done",
            });
          }
          if (res.icon) {
            values.icon_files = urlToFileList({
              url: getImageSrc(res.icon),
              uid: "-3",
              status: "done",
            });
          }
          setInitialValues(values);
          formRef.current?.setFieldsValue(values);
        })
        .catch(() => navigate("/ai/classify/extends"));
    } else {
      formRef.current?.setFieldsValue(toExtendFormValues(extendFormDefaults));
    }
  }, [formRef, id, navigate]);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const payload = fromExtendFormValues(values);
      if (!payload.src || !payload.original_src) {
        message.error("请上传效果图与原始图");
        return false;
      }
      if (id) {
        await updateAiExtend({ ...payload, id: Number(id) });
      } else {
        delete payload.id;
        await createAiExtend(payload);
      }
      message.success(id ? "更新成功" : "创建成功");
      navigate("/ai/classify/extends");
      return true;
    } catch (e: any) {
      message.error(e?.message || "JSON 格式错误或保存失败");
      return false;
    }
  };

  const onReset = () => {
    if (id) {
      formRef.current?.setFieldsValue(initialValues);
    } else {
      formRef.current?.setFieldsValue(toExtendFormValues(extendFormDefaults));
    }
  };

  return (
    <Card style={{ border: "none", paddingTop: 12 }}>
      <ProForm
        formRef={formRef}
        grid
        {...formItemCol()}
        layout="horizontal"
        onFinish={onFinish}
        onReset={onReset}
        submitter={{
          searchConfig: { submitText: id ? "保存" : "创建" },
          render: (_props, doms) => (
            <Col span={20} offset={4}>
              <Space>
                {doms}
                <Button onClick={() => navigate("/ai/classify/extends")}>
                  返回列表
                </Button>
              </Space>
            </Col>
          ),
        }}
      >
        <Tabs
          size="small"
          style={{ width: "100%" }}
          items={[
            {
              key: "basic",
              label: "基础信息",
              children: [
                <Row key="basic">
                  <Col span={12}>
                    <ProFormSelect
                      name="classify_id"
                      label="关联 AI 项目"
                      options={classifyOptions}
                      formItemProps={{
                        ...formItemProps,
                        rules: [{ required: true, message: "请选择项目" }],
                      }}
                      fieldProps={{ showSearch: true, optionFilterProp: "label" }}
                    />
                    <ProFormText
                      name="feature"
                      label="特色描述"
                      formItemProps={formItemProps}
                    />
                    <ProForm.Item
                      label="图标"
                      name="icon_files"
                      {...formItemCol(8)}
                      valuePropName="fileList"
                      getValueFromEvent={(evt: any) => evt?.fileList}
                    >
                      <CustomUpload
                        uploadProps={{
                          maxCount: 1,
                          listType: "picture-card",
                        }}
                      />
                    </ProForm.Item>
                    <ProFormRadio.Group
                      name="status"
                      label="上架"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                  </Col>
                  <Col span={12}>
                    <ProForm.Item
                      label="效果图"
                      name="src_files"
                      {...formItemCol(8)}
                      valuePropName="fileList"
                      getValueFromEvent={(evt: any) => evt?.fileList}
                      rules={[
                        { required: !id, message: "请上传效果图" },
                      ]}
                    >
                      <CustomUpload
                        uploadProps={{
                          maxCount: 1,
                          listType: "picture-card",
                        }}
                      />
                    </ProForm.Item>
                    <ProForm.Item
                      label="原始图"
                      name="original_src_files"
                      {...formItemCol(8)}
                      valuePropName="fileList"
                      getValueFromEvent={(evt: any) => evt?.fileList}
                      rules={[
                        { required: !id, message: "请上传原始图" },
                      ]}
                    >
                      <CustomUpload
                        uploadProps={{
                          maxCount: 1,
                          listType: "picture-card",
                        }}
                      />
                    </ProForm.Item>
                    <ProForm.Item
                      name="slider_percent"
                      label="滑块默认位置"
                      {...formItemProps}
                      extra="0~1，首页对比滑块初始比例"
                    >
                      <InputNumber
                        min={0}
                        max={1}
                        step={0.05}
                        style={{ width: "100%" }}
                      />
                    </ProForm.Item>
                    <ProFormSwitch
                      name="is_scale"
                      label="启用缩放"
                      formItemProps={formItemProps}
                      tooltip="图像放大修复类技能建议开启"
                    />
                  </Col>
                </Row>,
              ],
            },
            {
              key: "examples",
              label: "示例配置",
              children: [
                <Col span={24} key="examples">
                  <ProFormTextArea
                    name="example_right_text"
                    label="正确示例 JSON"
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 8 }}
                    tooltip='例：[{"id":1,"src":"...","size":{"width":80,"height":80}}]'
                  />
                  <ProFormTextArea
                    name="example_error_text"
                    label="错误示例 JSON"
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 10 }}
                    tooltip='例：[{"id":1,"title":"人像过多","desc":"...","src":"..."}]'
                  />
                </Col>,
              ],
            },
          ]}
        />
      </ProForm>
    </Card>
  );
}
