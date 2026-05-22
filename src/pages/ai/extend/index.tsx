import { Card, Modal, Space, Tag } from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { useNavigate } from "react-router";
import "@/assets/styles/table.scss";
import { deleteAiExtend, getAiExtendList } from "@/api/ai/extend";
import useTableColor from "@/hooks/useTableColor";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import ToolBarTitle from "@/components/ToolBarTitle";
import ActionRender from "@/components/ActionRender";
import { FULLSCREEN_ICONS } from "@/constants";
import { composeColumns } from "@/utils/columns";
import { renderStatus } from "@/constants/public";
import { getImageSrc } from "@/utils/image";

export default function AiExtendPage() {
  const navigate = useNavigate();
  const { isFullscreen } = useProTableFullscreen();
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const [disabled, setDisabled] = useState(true);
  const [selectedOne, setSelectedOne] = useState<Record<string, unknown>>({});
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});

  const handdleAdd = () => navigate("/ai/classify/extends/add");

  const handdleEdit = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    navigate(`/ai/classify/extends/edit/${row.id}`);
  };

  const handdleDel = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    Modal.confirm({
      title: "下架分类扩展",
      content: `确定下架 #${row.id}？`,
      okType: "danger",
      onOk: async () => {
        await deleteAiExtend(row.id as number);
        actionRef.current?.reload();
      },
    });
  };

  const columns = composeColumns(
    [
      { title: "ID", dataIndex: "id", width: 70, search: false, fixed: "left" },
      {
        title: "AI 项目",
        dataIndex: "classify_name",
        search: false,
        width: 120,
        ellipsis: true,
        render: (_, r) => r.classify_name || `#${r.classify_id}`,
      },
      {
        title: "路由 model",
        dataIndex: "classify_model",
        search: false,
        width: 100,
        ellipsis: true,
      },
      {
        title: "特色",
        dataIndex: "feature",
        ellipsis: true,
      },
      {
        title: "预览",
        dataIndex: "src",
        search: false,
        width: 72,
        render: (_, r) => {
          const src = getImageSrc(r.src as string);
          return src ? (
            <img
              src={src}
              alt=""
              style={{ width: 48, height: 48, objectFit: "cover" }}
            />
          ) : (
            "-"
          );
        },
      },
      {
        title: "缩放",
        dataIndex: "is_scale",
        search: false,
        width: 60,
        render: (_, r) => (r.is_scale ? "是" : "否"),
      },
      {
        title: "上架",
        dataIndex: "status",
        valueType: "select",
        valueEnum: { 1: { text: "是" }, 0: { text: "否" } },
        width: 70,
        search: false,
        render: renderStatus(),
      },
    ],
    {
      showUpdatedAt: true,
      action: {
        width: 120,
        render: (_: unknown, record: Record<string, unknown>) => (
          <ActionRender
            permissions={{
              edit: "ai:extend:edit",
              del: "ai:extend:del",
            }}
            onEdit={() => handdleEdit(record)}
            onDel={() => handdleDel(record)}
          />
        ),
      },
    },
  );

  const formColumns = columns.filter((item) => item.search !== false);

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      addProps={{ text: "新增", icon: false }}
      permissions={{
        add: "ai:extend:add",
        edit: "ai:extend:edit",
        del: "ai:extend:del",
      }}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit()}
      onDel={() => handdleDel()}
    />
  );

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Card style={{ border: "none", padding: 0 }}>
        <BetaSchemaForm
          layout="inline"
          onReset={() => {
            setSearchValues({});
            actionRef.current?.reload();
          }}
          onFinish={(values) => {
            setSearchValues(values);
            actionRef.current?.reload();
          }}
          submitter={{ searchConfig: { submitText: "搜索" } }}
          columns={formColumns as ProFormColumnsType[]}
        />
      </Card>
      <div className={tableStyles}>
        <ProTable
          bordered
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={false}
          scroll={{ x: "max-content" }}
          request={async ({ current: page, ...params }) => {
            const res: any = await getAiExtendList({
              page,
              ...params,
              ...searchValues,
            });
            return {
              data: res?.rows || [],
              total: res?.total || 0,
              success: true,
            };
          }}
          pagination={{ defaultPageSize: 20 }}
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
                style={{ fontSize: 16 }}
                onClick={() => action?.fullScreen?.()}
              />,
            ];
          }}
          rowClassName={rowClassName}
          tableAlertRender={false}
          rowSelection={{
            onSelect: (_c, _s, rows) => {
              const one = rows.length === 1 ? { ...rows[0] } : {};
              setSelectedOne(one);
            },
            onChange: (rows) => setDisabled(rows.length !== 1),
          }}
        />
      </div>
    </Space>
  );
}
