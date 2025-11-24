/*
 * @Author: colpu
 * @Date: 2025-06-12 16:13:46
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-18 16:04:21
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space, Switch } from "antd";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { apiDictTypes } from "@/api/dict";
import { composeColumns } from "@/utils/columns";
import { AnyObject } from "antd/es/_util/type";
import TypeForm from "./components/type_form";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import { FULLSCREEN_ICONS, RADIO_STATUS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
export default function DictTypesList() {
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();

  const fetchDictTypes = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const { rows, type_code }: any = await apiDictTypes(params);
      data = rows || [];
      total = data.length;
      setEditData((prev: any) => {
        return {
          ...prev,
          type_code,
        };
      });
    } catch (err) {
      console.log(err);
    }
    if (data.length === 0) {
      setDisabled(true);
    }
    return {
      data,
      success: true,
      total,
    };
  };

  const handdleAdd = () => {
    setIsEdit(false);
    setEditData((prev: any) => {
      return { type_code: prev.type_code };
    });
    onOK();
  };
  const handdleEdit = (record: any) => {
    setIsEdit(true);
    setEditData((prev: any) => {
      return { ...prev, ...record };
    });
    onOK();
  };
  const handdleDel = ({ id, type_code }: any) => {
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiDictTypes({ id }, "delete").then(async () => {
          actionRef.current?.reset!();
          setEditData((prev: any) => {
            return { ...prev, type_code };
          });
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSelect = (_current: any, _selected: boolean, selectedRows: any[]) => {
    console.log(selectedRows.length);
    if (selectedRows.length === 1) {
      console.log(selectedRows[0]);
      setEditData((prev: any) => {
        return { ...prev, ...selectedRows[0] };
      });
    }
  };

  const onChange = (selectedRows: any) => {
    setDisabled(selectedRows.length !== 1);
  };

  // 完成提交数据
  const onFinish = async (values: any) => {
    await apiDictTypes(values, isEdit ? "put" : "post");
    actionRef.current?.reset!();
    onCancel();
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "字典编号",
        key: "id",
        width: 100,
        align: "center",
        dataIndex: "id",
        search: false,
      },
      {
        title: "字典名称",
        key: "name",
        width: 180,
        dataIndex: "name",
      },
      {
        title: "字典类型",
        align: "center",
        width: 180,
        key: "type_code",
        dataIndex: "type_code",
        render: (value: any, record: AnyObject) => {
          return <Link to={`/system/dict/data?id=${record.id}`}>{value}</Link>;
        },
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status",
        width: 60,
        align: "center",
        valueType: "radio",
        initialValue: 1,
        fieldProps: {
          options: RADIO_STATUS,
        },
        // 渲染表格内容
        render: (value: any) => (
          <Switch defaultChecked={value} disabled={true} size="small" />
        ),
      },
    ],
    {
      showRemark: true,
      action: {
        render: (_: any, record: any) => {
          return (
            <ActionRender
              values={record}
              onDel={() => handdleDel(record)}
              onEdit={() => handdleEdit(record)}
            />
          );
        },
      },
    }
  );

  // 搜索表单配置
  const formColumns = columns.filter((item) => {
    if (item.search !== false) return item;
  });
  // 弹窗props配置
  const modalProps = {
    open,
    modalProps: {
      onOK,
      onCancel,
      styles: {
        body: { paddingTop: 10 },
      },
      maskClosable: false,
    },
    editData,
    isEdit,
    formRef,
    title: "字典类型",
    onFinish,
  };

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
    />
  );

  const [searchValues, setSearchValues] = useState({});
  const handdleSearch = (values = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  return (
    <>
      <Space size={10} direction="vertical" style={{ display: "flex" }}>
        {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
        <Card style={{ border: "none" }}>
          <BetaSchemaForm
            layout="inline"
            onReset={handdleSearch}
            onFinish={(values) => {
              handdleSearch(values);
            }}
            submitter={{
              searchConfig: {
                submitText: "搜索",
              },
            }}
            columns={formColumns as ProFormColumnsType[]}
          />
        </Card>
        <div className={tableStyles}>
          <ProTable
            bordered
            formRef={formRef}
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchDictTypes({ page, ...params, ...searchValues });
            }}
            rowKey="id"
            scroll={{ x: "max-content" }}
            search={false}
            toolbar={
              isFullscreen
                ? { title: toolbarTitle, settings: [] }
                : { title: toolbarTitle }
            }
            toolBarRender={(action) => {
              const ScreenIcon =
                FULLSCREEN_ICONS[
                  isFullscreen ? "fullscreen" : "exitFullScreen"
                ];
              return [
                <ScreenIcon
                  key="fullscreen"
                  {...{
                    style: { fontSize: 16 },
                    onClick: () => {
                      action?.fullScreen!();
                    },
                  }}
                />,
              ];
            }}
            rowClassName={rowClassName}
            tableAlertRender={false}
            rowSelection={{
              onSelect,
              onChange,
            }}
          />
        </div>
      </Space>
      <TypeForm {...modalProps} />
    </>
  );
}
