import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Checkbox,
  Radio,
  Col,
  Row,
  Switch,
  TreeSelect,
} from "antd";
import { DynamicField, DynamicFormProps, DynamicFormRef } from "./types";

const { TextArea } = Input;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  (props, ref) => {
    const {
      fields: initialFields,
      initialValues,
      layout = "horizontal",
      onFieldsChange,
      onValuesChange,
      disabled = false,
      formProps,
    } = props;

    const [form] = Form.useForm();
    const [fields, setFields] = useState<DynamicField[]>(initialFields);

    const formRef = useRef<DynamicFormRef>({
      submit: (): Promise<Record<string, any>> => {
        return form.validateFields();
      },
      reset: (): void => {
        form.resetFields();
      },
      validate: (): Promise<Record<string, any>> => {
        return form.validateFields();
      },
      getFieldsValue: (): Record<string, any> => {
        return form.getFieldsValue();
      },
      setFieldsValue: (values: Record<string, any>): void => {
        form.setFieldsValue(values);
      },
      addField: (field: DynamicField): void => {
        setFields((prevFields) => {
          const newFields = [...prevFields, field];
          return newFields;
        });
      },
      removeField: (fieldName: string): void => {
        setFields((prevFields) => {
          const newFields = prevFields.filter(
            (field) => field.name !== fieldName
          );
          return newFields;
        });
        // 从表单中移除该字段的值
        const values = form.getFieldsValue();
        delete values[fieldName];
        form.setFieldsValue(values);
      },
      updateField: (
        fieldName: string,
        updates: Partial<DynamicField>
      ): void => {
        setFields((prevFields) => {
          const newFields = prevFields.map((field) =>
            field.name === fieldName ? { ...field, ...updates } : field
          );
          return newFields;
        });
      },
    });

    // 暴露方法给父组件
    useImperativeHandle(ref, () => formRef.current!);

    // 监听字段变化
    useEffect(() => {
      setFields(initialFields);
    }, [initialFields]);

    // 设置初始值
    useEffect(() => {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }, [initialValues, form]);

    // 生成验证规则
    const generateRules = (field: DynamicField) => {
      const rules = [...(field.rules || [])];
      if (field.required) {
        rules.unshift({
          required: true,
          message: `请输入${field.label}`,
        });
      }
      return rules;
    };

    // 渲染表单字段
    const renderField = (field: DynamicField) => {
      const { type, componentProps = {}, options, placeholder, render } = field;

      const compProps = {
        ...componentProps,
        placeholder: placeholder || `请输入${field.label}`,
        disabled: disabled || field.disabled,
      };

      if (render) {
        return render(field, compProps);
      }

      switch (type) {
        case "input":
          return <Input {...compProps} />;
        case "textarea":
          return <TextArea {...{ rows: 4, ...compProps }} />;
        case "number":
          return <InputNumber {...compProps} style={{ width: "100%" }} />;
        case "select":
          return (
            <Select {...compProps}>
              {options?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          );

        case "date":
          return <DatePicker {...compProps} style={{ width: "100%" }} />;

        case "checkbox":
          return <Checkbox {...compProps}>{field.label}</Checkbox>;

        case "radio":
          return (
            <RadioGroup {...compProps}>
              {options?.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          );
        case "switch":
          return <Switch {...compProps} />;
        case "treeSelect":
          return <TreeSelect {...compProps} />;

        default:
          return <Input {...compProps} />;
      }
    };

    const renderItemField = (field: any) => {
      const { formItemProps = {} } = field;
      return (
        <Form.Item
          key={field.key || field.name}
          {...formItemProps}
          name={field.name}
          label={field.label}
          rules={generateRules(field)}
          initialValue={field.initialValue}
          valuePropName={field.type === "checkbox" ? "checked" : "value"}
        >
          {renderField(field)}
        </Form.Item>
      );
    };
    const renderCols = (fields: DynamicField[]) => {
      const groupsObj: { [key: string | number]: DynamicField[] } = {};
      fields.forEach((filed, index: number) => {
        const key = filed.group || index;
        if (groupsObj[key] === undefined) {
          groupsObj[key] = [filed];
        } else {
          groupsObj[key].push(filed);
        }
      });
      const len = fields.length;
      const fieldGroups = Object.values(groupsObj);
      if (len > fieldGroups.length) {
        return fieldGroups.map((groupFields, index) => {
          if (groupFields.length === 1) {
            return renderItemField(groupFields[0]);
          }
          return (
            <Row gutter={24} key={index}>
              {groupFields.map((field) => {
                return (
                  <Col span={24 / groupFields.length} key={field.name}>
                    {renderItemField(field)}
                  </Col>
                );
              })}
            </Row>
          );
        });
      }
      return fields.map((field) => renderItemField(field));
    };

    return (
      <Form
        form={form}
        {...formProps}
        layout={layout}
        onValuesChange={onValuesChange}
        onFieldsChange={onFieldsChange}
        disabled={disabled}
      >
        {renderCols(fields)}
        {props.children as ReactNode}
      </Form>
    );
  }
);

export default DynamicForm;
