/*
 * @Author: colpu
 * @Date: 2025-11-03 17:24:11
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-18 00:14:43
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Button, Modal, Space, Switch } from "antd";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@/assets/styles/table.scss";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { apiDictData } from "@/api/dict";
import { composeColumns } from "@/utils/columns";
import DataForm from "./components/data_form";
import useFormModal from "@/hooks/useFormModal";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import useTableColor from "@/hooks/useTableColor";

export default function DictDataList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const id = searchParams.get("id");
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();

  const fetchDictData = async (id: string | null) => {
    let data = [];
    let total = 0;
    try {
      const { rows, type_code }: any = await apiDictData({ id });
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
    setEditData({});
    onOK();
  };
  const handdleEdit = (record: any) => {
    setIsEdit(true);
    setEditData({ ...record });
    onOK();
  };
  const handdleDel = ({ id, type_code }: any) => {
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiDictData({ id }, "delete").then(async () => {
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

  const onClose = () => {
    navigate("/system/dict/index");
  };

  const onFinish = async (values: any) => {
    await apiDictData(values, isEdit ? "put" : "post");
    actionRef.current?.reset!();
    onCancel();
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "排序",
        width: 80,
        align: "center",
        key: "sort_order",
        dataIndex: "sort_order",
        search: false,
      },
      {
        title: "字典编号",
        width: 100,
        align: "center",
        key: "id",
        dataIndex: "id",
        search: false,
      },
      {
        title: "字典标签",
        width: 160,
        key: "label",
        dataIndex: "label",
      },
      {
        title: "字典键值",
        width: 120,
        key: "value",
        dataIndex: "value",
        search: false,
      },
      {
        title: "数据编码",
        key: "data_code",
        dataIndex: "data_code",
        fieldProps: {
          rules: [{ required: true, message: "请输入数据名称" }],
        },
        formItemProps: {
          rules: [{ required: true, message: "请输入数据名称" }],
        },
      },
      {
        title: "回显样式",
        width: 120,
        key: "css_class",
        dataIndex: "css_class",
        search: false,
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status",
        width: 60,
        align: "center",
        search: false,
        render: (value: any) => {
          return <Switch size="small" defaultChecked={value} disabled={true} />;
        },
      },
    ],
    {
      showRemark: true,
      action: {
        width: 110,
        render: (_: any, record: any) => {
          return (
            <Space
              align="start"
              split={<span style={{ color: "#eee" }}>|</span>}
              size={0}
            >
              <Button
                size="small"
                color="primary"
                variant="link"
                onClick={() => handdleEdit(record)}
              >
                编辑
              </Button>
              <Button
                size="small"
                color="primary"
                variant="link"
                onClick={() => handdleDel(record)}
              >
                删除
              </Button>
            </Space>
          );
        },
      },
    }
  );

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
    title: "字典数据",
    onFinish,
  };

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
      onClose={onClose}
    />
  );

  return (
    <div className={tableStyles}>
      <ProTable
        bordered
        actionRef={actionRef}
        style={{ position: "relative", zIndex: 0 }}
        columns={columns}
        request={() => {
          return fetchDictData(id);
        }}
        rowKey="id"
        scroll={{ x: "max-content" }}
        search={{
          layout: "inline",
          labelWidth: "auto",
          ignoreRules: false,
        }}
        pagination={false}
        toolbar={
          isFullscreen
            ? { title: toolbarTitle, settings: [] }
            : { title: toolbarTitle }
        }
        toolBarRender={(action) => {
          const ScreenIcon =
            FULLSCREEN_ICONS[isFullscreen ? "fullscreen" : "exitFullScreen"];
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
        rowKey={(record: any) => [record.id, record.status].toString()}
        rowClassName={rowClassName}
        tableAlertRender={false}
        rowSelection={{
          onSelect,
          onChange,
        }}
      />
      <DataForm {...modalProps} />
    </div>
  );
}
