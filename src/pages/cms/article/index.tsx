/*
 * @Author: colpu
 * @Date: 2025-11-16 00:16:50
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-16 15:47:17
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
import { apiArticle, getArticleList } from "@/api/cms/article";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import { useAppSelector } from "@/store/hooks";
import { renderStatus } from "@/constants/public";
import { useNavigate } from "react-router";

export default function ArticleList() {
  const [disabled, setDisabled] = useState(true);
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const { dict } = useAppSelector((state) => state.dict);
  const navigate = useNavigate();

  const fetchArticleList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getArticleList(params)) || {};
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
    navigate(`/cms/article/add`);
  };
  const handdleEdit = (record: any) => {
    navigate(`/cms/article/edit/${record.id}`);
  };
  const handdleDel = ({ id, type_code }: any) => {
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiArticle({ id }, "delete").then(async () => {
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
    if (selectedRows.length === 1) {
      setEditData((prev: any) => {
        return { ...prev, ...selectedRows[0] };
      });
    }
  };

  const onChange = (selectedRows: any) => {
    setDisabled(selectedRows.length !== 1);
  };

  const onExport = () => {
    console.log("export");
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "标题",
        dataIndex: "title",
        fixed: true,
      },
      {
        title: "副标题",
        dataIndex: "subtitle",
        search: false,
        width: 120,
      },
      {
        title: "作者",
        dataIndex: "author",
        search: false,
        width: 120,
      },
      {
        title: "状态",
        dataIndex: "status",
        valueType: "radio",
        align: "center",
        width: 60,
        search: false,
        fieldProps: {
          options: dict.enabled_status.options, // 状态字典
        },
        render: renderStatus(),
      },
      {
        title: "排序",
        width: 80,
        align: "center",
        key: "sort_order",
        dataIndex: "sort_order",
        search: false,
      },
    ],
    {
      showOrder: false,
      updatedAt: true,
      createdAt: false,
      action: {
        render: (_: any, record: any) => {
          return (
            <ActionRender
              permissions={{
                add: "sys:article:add",
                edit: "sys:article:edit",
                del: "sys:article:del",
              }}
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

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
      onExport={onExport}
    />
  );

  const [searchValues, setSearchValues] = useState({});
  const handdleSearch = (values = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
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
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchArticleList({ page, ...params, ...searchValues });
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
              onSelect,
              onChange,
            }}
          />
        </div>
      </Space>
    </>
  );
}
