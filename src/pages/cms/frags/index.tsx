/*
 * @Author: colpu
 * @Date: 2025-11-16 00:16:50
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-02-10 17:58:18
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space } from "antd";
import { useRef, useState } from "react";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { composeColumns } from "@/utils/columns";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import { apiFrags, getFragsList } from "@/api/cms/frags";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import useFormModal from "@/hooks/useFormModal";
import FragsForm from "./components/frags_form";
export default function FragsList() {
  const { open, onOK, onCancel, formRef } = useFormModal();
  const [disabled, setDisabled] = useState(true);
  const { isFullscreen } = useProTableFullscreen();
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [searchValues, setSearchValues] = useState({});
  const [selectedOne, setSelectedOne] = useState<any>({});

  const fetchFragsList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getFragsList(params)) || {};
      data = res.rows || [];
      total = res.total;
      setEditData({});
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
    if (Object.keys(record).length > 0) {
      setEditData({ ...record });
    } else {
      setEditData(selectedOne);
    }
    onOK();
  };

  const handdleDel = ({ id }: any) => {
    if (!id) {
      id = selectedOne.id;
    }
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiFrags({ id }, "delete").then(async () => {
          actionRef.current?.reset!();
          actionRef.current?.reset!();
          setEditData((prev: any) => {
            return { ...prev };
          });
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSelect = (_current: any, _selected: boolean, selectedRows: any[]) => {
    let selectOne = {};
    if (selectedRows.length === 1) {
      selectOne = { ...selectedRows[0] };
    }
    setSelectedOne(selectOne);
    setEditData(selectOne);
  };

  const onChange = (selectedRows: any) => {
    setDisabled(selectedRows.length !== 1);
  };
  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "碎片ID",
        dataIndex: "id",
        search: false,
        fixed: true,
        width: 80,
      },
      {
        title: "碎片标题",
        dataIndex: "title",
        fixed: true,
      },
      {
        title: "碎片类型",
        dataIndex: "type",
        search: false,
        width: 120,
      },
    ],
    {
      showOrder: false,
      showUpdatedAt: false,
      showCreatedAt: false,
      action: {
        render: (_: any, record: any) => {
          return (
            <ActionRender
              permissions={{
                edit: "sys:article:edit",
                del: "sys:article:del",
              }}
              onEdit={() => handdleEdit(record)}
              onDel={() => handdleDel(record)}
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

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
    />
  );
  const handdleSearch = (values = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  // 完成提交数据
  const onFinish = async (values: any) => {
    delete values.confirm_password; // 删除确认密码
    await apiFrags(values, isEdit ? "put" : "post");
    onCancel();
    actionRef.current?.reload!();
  };


  // 弹窗props配置
  const modalProps = {
    open,
    modalProps: {
      width: 640,
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
    title: "碎片",
    onFinish,
  };

  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
        {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
        <Card style={{ border: "none", padding: 0 }}>
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
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0, padding: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchFragsList({ page, ...params, ...searchValues });
            }}

            rowKey="id"
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
              getCheckboxProps: (record) => ({
                disabled: record.editable === 1, // 某些状态不可选
              }),
              onSelect,
              onChange,
            }}
          />
        </div>
      </Space>
      <FragsForm {...modalProps} />
    </>
  );
}
