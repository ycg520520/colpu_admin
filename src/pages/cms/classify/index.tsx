/*
 * @Author: colpu
 * @Date: 2025-11-16 00:16:50
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-04-23 12:21:01
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { composeColumns } from "@/utils/columns";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { dynamicIcon } from "@/utils/public";
import ClassifyForm from "./components/classify_form";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import { renderStatus, renderWhether } from "@/constants/public";
import { useAppSelector } from "@/store/hooks";
import { apiClassify, getClassifyAll } from "@/api/cms/classify";

export default function ClassifyList() {
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const [dataSource, setDataSource] = useState([]);
  const { tableStyles, rowClassName } = useTableColor();
  const { dict } = useAppSelector((state) => state.dict);

  const fetchClassifyAll = async (params: any) => {
    let res: any;
    try {
      res = await getClassifyAll(params);
      setEditData({});
    } catch (err) {
      console.log(err);
    }
    const { total, rows: data } = res;
    setDataSource(data);
    setExpandedRowKeys(_keysHandle(data));
    return {
      data,
      success: true,
      total,
    };
  };

  const handdleAdd = ({ id, type }: any) => {
    setIsEdit(false);
    setEditData({ parent_id: id, type });
    onOK();
  };
  const handdleEdit = (record: any) => {
    setIsEdit(true);
    setEditData({ ...record });
    onOK();
  };
  const handdleDel = ({ id, code }: any) => {
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiClassify({ id }, "delete").then(async () => {
          actionRef.current?.reset!();
          setEditData((prev: any) => {
            return { ...prev, code };
          });
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 完成提交数据
  const onFinish = async (values: any) => {
    delete values.confirm_password; // 删除确认密码
    await apiClassify(values, isEdit ? "put" : "post");
    onCancel();
    actionRef.current?.reload!();
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "栏目名称",
        dataIndex: "name",
        fixed: true,
      },
      {
        title: "图标",
        dataIndex: "icon",
        align: "center",
        width: 60,
        render: (value: any, row: any) => {
          if (row.icon) {
            return dynamicIcon(value);
          }
          return null;
        },
        search: false,
      },
      {
        title: "栏目路径",
        search: false,
        dataIndex: "path",
      },
      {
        title: "栏目标识",
        search: false,
        dataIndex: "code",
      },
      {
        title: "栏目类型",
        dataIndex: "page_type",
        search: false,
        align: "center",
        width: 60,
        render: renderWhether(
          null,
          dict.page_type.options.map((item) => item.label)
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        valueType: "radio",
        initialValue: 1,
        align: "center",
        width: 60,
        search: false,
        fieldProps: {
          options: dict.enabled_status.options,
        },
        render: renderStatus(),
      },
      {
        title: "模版",
        width: 80,
        align: "center",
        dataIndex: "template",
        search: false,
      },
      {
        title: "排序",
        width: 80,
        align: "center",
        dataIndex: "sort_order",
        search: false,
      },
    ],
    {
      showOrder: false,
      showRemark: false,
      action: {
        render: (_: any, record: any) => {
          return (
            <ActionRender
              permissions={{
                add: "sys:classify:add",
                edit: "sys:classify:edit",
                del: "sys:classify:del",
              }}

              disableds={{
                add: record.type !== 0 || record.editable !== 0,
                edit: record.editable !== 0,
                del: record.editable !== 0,
              }}
              onAdd={() => handdleAdd(record)}
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
    title: "栏目",
    onFinish,
  };

  const [searchValues, setSearchValues] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    setIsExpanded(expandedRowKeys.length > 0);
  }, [expandedRowKeys]);

  const _keysHandle = (data: any[]): number[] => {
    const keys = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      keys.push(item.id);
      if (item.children) {
        keys.push(..._keysHandle(item.children));
      }
    }
    return keys;
  };
  const setKeys = (dataSource: any[]) => {
    const expandedKeys = _keysHandle(dataSource);
    if (expandedRowKeys.length === 0) {
      setExpandedRowKeys(expandedKeys);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const onExpand = () => {
    setKeys(dataSource);
  };

  const toolbarTitle = (
    <ToolBarTitle
      isExpanded={isExpanded}
      onAdd={handdleAdd}
      onExpand={onExpand}
    />
  );

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

        <ClassifyForm {...modalProps} />
        <div className={tableStyles}>
          <ProTable
            rowKey="id"
            scroll={{ x: "max-content" }}
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            pagination={false}
            request={() => {
              return fetchClassifyAll(searchValues);
            }}
            search={false}
            toolbar={
              isFullscreen
                ? { title: toolbarTitle, settings: [] }
                : { title: toolbarTitle }
            }
            toolBarRender={(action: any) => {
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
            rowSelection={false}
            expandable={{
              expandedRowKeys,
              expandRowByClick: true,
              expandIcon: ({ expanded, onExpand, record }) => {
                if (record.children && record.children.length > 0) {
                  return expanded ? (
                    <DownOutlined
                      key={record.id}
                      style={{ fontSize: 12, marginRight: 5, color: "#ccc" }}
                      onClick={(e) => {
                        setExpandedRowKeys((prev) => {
                          return prev.filter((item) => item !== record.id);
                        });
                        onExpand(record, e);
                      }}
                    />
                  ) : (
                    <RightOutlined
                      key={record.id}
                      style={{ fontSize: 12, marginRight: 5, color: "#ccc" }}
                      onClick={(e) => {
                        setExpandedRowKeys((prev) => {
                          return [...prev, record.id];
                        });
                        onExpand(record, e);
                      }}
                    />
                  );
                } else {
                  return (
                    <span
                      style={{ width: "1em", display: "inline-block" }}
                    ></span>
                  );
                }
              },
            }}
          />
        </div>
      </Space>
    </>
  );
}
