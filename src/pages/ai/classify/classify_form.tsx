import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, message, Row, Space, Tabs } from "antd";
import { useNavigate, useParams } from "react-router";
import {
  colPropsFull,
  formItemCol,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import {
  createAiClassify,
  getAiClassifyDetail,
  updateAiClassify,
} from "@/api/ai/classify";
import { getAiTemplateList } from "@/api/ai/template";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import {
  classifyFormDefaults,
  fromFormValues,
  toFormValues,
} from "./form_utils";

const yesNo = [
  { label: "否", value: 0 },
  { label: "是", value: 1 },
];

export default function AiClassifyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>(
    {},
  );
  const [templateOptions, setTemplateOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    getAiTemplateList({ page: 1, pageSize: 500, status: 1 }).then((res: any) => {
      const rows = res?.rows || [];
      setTemplateOptions(
        rows.map((r: any) => ({
          label: `#${r.id} ${r.name || "未命名"}`,
          value: r.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (id) {
      getAiClassifyDetail(id)
        .then((res: any) => {
          const values = toFormValues(res);
          if (res.banner) {
            values.banner_files = urlToFileList({
              url: res.banner,
              uid: "-1",
              status: "done",
            });
          }
          setInitialValues(values);
          formRef.current?.setFieldsValue(values);
        })
        .catch(() => navigate("/ai/classify/list"));
    } else {
      formRef.current?.setFieldsValue(toFormValues(classifyFormDefaults));
    }
  }, [formRef, id, navigate]);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const payload = fromFormValues(values);
      if (payload.banner_files) {
        const files = payload.banner_files as any[];
        const f = files?.[0];
        payload.banner =
          typeof f === "string" ? f : f?.url || f?.response?.url || "";
        delete payload.banner_files;
      }
      if (id) {
        await updateAiClassify({ ...payload, id: Number(id) });
      } else {
        delete payload.id;
        await createAiClassify(payload);
      }
      message.success(id ? "更新成功" : "创建成功");
      navigate("/ai/classify/list");
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
      formRef.current?.setFieldsValue(toFormValues(classifyFormDefaults));
    }
  };

  const basicFields = (
    <Row>
      <Col span={12}>
        <ProFormText
          name="name"
          label="名称"
          formItemProps={{
            ...formItemProps,
            rules: [{ required: true, message: "请输入名称" }],
          }}
        />
        <ProFormText name="icon" label="图标路径" formItemProps={formItemProps} />
        <ProFormText name="path" label="路径" formItemProps={formItemProps} />
        <ProFormText name="model" label="模型" formItemProps={formItemProps} />
        <ProFormDigit
          name="sort_order"
          label="排序"
          min={0}
          formItemProps={formItemProps}
        />
        <ProFormRadio.Group
          name="status"
          label="上架"
          options={yesNo}
          formItemProps={formItemProps}
        />
        <ProFormRadio.Group
          name="disabled"
          label="不可用"
          options={yesNo}
          formItemProps={formItemProps}
          tooltip="0=小程序可用，1=置灰"
        />
        <ProFormRadio.Group
          name="is_hot"
          label="热门"
          options={yesNo}
          formItemProps={formItemProps}
        />
        <ProFormRadio.Group
          name="is_tip"
          label="提示"
          options={yesNo}
          formItemProps={formItemProps}
        />
      </Col>
      <Col span={12}>
        <ProFormTextArea
          name="description"
          label="描述"
          formItemProps={formItemProps}
          fieldProps={{ rows: 3 }}
        />
        <ProForm.Item
          label="Banner"
          name="banner_files"
          {...formItemCol(8)}
          valuePropName="fileList"
          getValueFromEvent={(evt: any) => evt?.fileList}
          transform={(value: any[]) => {
            const res = value?.[0] || {};
            return res.url || res.response?.url || "";
          }}
        >
          <CustomUpload
            uploadProps={{
              maxCount: 1,
              listType: "picture-card",
            }}
          />
        </ProForm.Item>
        <ProFormSelect
          name="template_ids"
          label="关联模版"
          mode="multiple"
          options={templateOptions}
          formItemProps={formItemProps}
          fieldProps={{
            placeholder: "选择该项目展示的模版",
            optionFilterProp: "label",
          }}
        />
        <Button
          type="link"
          size="small"
          style={{ marginLeft: "33%" }}
          onClick={() => navigate("/ai/classify/templates")}
        >
          前往模版管理
        </Button>
      </Col>
    </Row>
  );

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
                <Button onClick={() => navigate("/ai/classify/list")}>
                  返回列表
                </Button>
              </Space>
            </Col>
          ),
        }}
      >
        <ProFormText
          name="id"
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
              children: [basicFields],
            },
            {
              key: "point",
              label: "扣点与输出",
              children: [
                <Row key="point">
                  <Col span={12}>
                    <ProFormDigit
                      name="cost_point"
                      label="扣点"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProFormDigit
                      name="cost_point_hd"
                      label="高清扣点"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="aspect_ratio"
                      label="宽高比"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="size"
                      label="普通尺寸"
                      formItemProps={formItemProps}
                    />
                    <ProFormText
                      name="size_hd"
                      label="高清尺寸"
                      formItemProps={formItemProps}
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormDigit
                      name="output_width"
                      label="输出宽度"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProFormDigit
                      name="output_height"
                      label="输出高度"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProFormDigit
                      name="output_dpi"
                      label="输出 DPI"
                      min={0}
                      formItemProps={formItemProps}
                    />
                  </Col>
                </Row>,
              ],
            },
            {
              key: "switch",
              label: "能力开关",
              children: [
                <Row key="switch">
                  <Col span={12}>
                    <ProFormRadio.Group
                      name="enable_crop"
                      label="裁剪"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                    <ProFormRadio.Group
                      name="enable_face_detect"
                      label="人脸检测"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                    <ProFormRadio.Group
                      name="enable_grid_split"
                      label="网格切分"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormRadio.Group
                      name="enable_enhance"
                      label="增强"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                    <ProFormRadio.Group
                      name="enable_size"
                      label="分辨率"
                      options={yesNo}
                      formItemProps={formItemProps}
                    />
                  </Col>
                </Row>,
              ],
            },
            {
              key: "prompt",
              label: "提示词与上传",
              children: [
                <Col span={24} key="prompt">
                  <ProFormTextArea
                    name="prompt"
                    label="提示词"
                    colProps={colPropsFull}
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 6 }}
                  />
                  <ProFormTextArea
                    name="upload_opt_text"
                    label="上传配置 JSON"
                    colProps={colPropsFull}
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 4 }}
                    tooltip='例：[{"tip":"上传您的照片"}]'
                  />
                  <ProFormTextArea
                    name="prompt_variables_text"
                    label="变量 JSON"
                    colProps={colPropsFull}
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 4 }}
                  />
                  <ProFormTextArea
                    name="remark"
                    label="备注"
                    colProps={colPropsFull}
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 2 }}
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
