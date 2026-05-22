import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, message, Row, Space, Tabs } from "antd";
import { useNavigate, useParams } from "react-router";
import { formItemCol, formItemProps, formItemPropsFull } from "@/constants/form";
import {
  createAiTemplate,
  getAiClassifyOptions,
  getAiTemplateCategories,
  getAiTemplateDetail,
  updateAiTemplate,
} from "@/api/ai/template";
import CustomUpload from "@/components/Upload";
import { urlToFileList } from "@/utils";
import { getImageSrc } from "@/utils/image";
import {
  fromTemplateFormValues,
  templateFormDefaults,
  toTemplateFormValues,
} from "./form_utils";

const yesNo = [
  { label: "否", value: 0 },
  { label: "是", value: 1 },
];

export default function AiTemplateFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance<any>>(undefined);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>(
    {},
  );
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [classifyOptions, setClassifyOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    getAiTemplateCategories().then((tree: any) => setCategoryTree(tree || []));
    getAiClassifyOptions().then((rows: any) => {
      setClassifyOptions(
        (rows || []).map((r: any) => ({
          label: r.name,
          value: r.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (id) {
      getAiTemplateDetail(id)
        .then((res: any) => {
          const values = toTemplateFormValues(res);
          if (res.img_src) {
            values.img_files = urlToFileList({
              url: getImageSrc(res.img_src),
              uid: "-1",
              status: "done",
            });
          }
          if (res.line_art_src) {
            values.line_art_files = urlToFileList({
              url: getImageSrc(res.line_art_src),
              uid: "-2",
              status: "done",
            });
          }
          setInitialValues(values);
          formRef.current?.setFieldsValue(values);
        })
        .catch(() => navigate("/ai/classify/templates"));
    } else {
      formRef.current?.setFieldsValue(toTemplateFormValues(templateFormDefaults));
    }
  }, [formRef, id, navigate]);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const payload = fromTemplateFormValues(values);
      if (id) {
        await updateAiTemplate({ ...payload, id: Number(id) });
      } else {
        delete payload.id;
        await createAiTemplate(payload);
      }
      message.success(id ? "更新成功" : "创建成功");
      navigate("/ai/classify/templates");
      return true;
    } catch (e: any) {
      message.error(e?.message || "保存失败");
      return false;
    }
  };

  const onReset = () => {
    if (id) {
      formRef.current?.setFieldsValue(initialValues);
    } else {
      formRef.current?.setFieldsValue(
        toTemplateFormValues(templateFormDefaults),
      );
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
                <Button onClick={() => navigate("/ai/classify/templates")}>
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
                    <ProFormText
                      name="name"
                      label="模版名称"
                      formItemProps={{
                        ...formItemProps,
                        rules: [{ required: true, message: "请输入名称" }],
                      }}
                    />
                    <ProFormTreeSelect
                      name="category_id"
                      label="展示类目"
                      formItemProps={{
                        ...formItemProps,
                        rules: [{ required: true, message: "请选择类目" }],
                      }}
                      fieldProps={{
                        showSearch: true,
                        treeDefaultExpandAll: true,
                        placeholder: "小程序内模版分组（sys category type=AI）",
                        fieldNames: {
                          label: "name",
                          value: "id",
                          children: "children",
                        },
                        treeData: categoryTree,
                      }}
                    />
                    <ProFormSelect
                      name="classify_ids"
                      label="关联 AI 项目"
                      mode="multiple"
                      options={classifyOptions}
                      formItemProps={formItemProps}
                      fieldProps={{ optionFilterProp: "label" }}
                    />
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
                  </Col>
                  <Col span={12}>
                    <ProForm.Item
                      label="效果图"
                      name="img_files"
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
                    <ProFormDigit
                      name="img_width"
                      label="图宽"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProFormDigit
                      name="img_height"
                      label="图高"
                      min={0}
                      formItemProps={formItemProps}
                    />
                    <ProForm.Item
                      label="线稿图"
                      name="line_art_files"
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
                  </Col>
                </Row>,
              ],
            },
            {
              key: "prompt",
              label: "提示词",
              children: [
                <Col span={24} key="prompt">
                  <ProFormTextArea
                    name="prompt"
                    label="提示词"
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 8 }}
                  />
                  <ProFormTextArea
                    name="prompt_variables_text"
                    label="变量 JSON"
                    formItemProps={formItemPropsFull}
                    fieldProps={{ rows: 5 }}
                    tooltip='例：[{"label":"风格","values":["复古"]}]'
                  />
                  <ProFormTextArea
                    name="remark"
                    label="备注"
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
