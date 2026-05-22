import { Card, Modal, Space } from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { useNavigate } from "react-router";
import "@/assets/styles/table.scss";
import {
  deleteAiClassify,
  getAiClassifyList,
} from "@/api/ai/classify";
import useTableColor from "@/hooks/useTableColor";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import ToolBarTitle from "@/components/ToolBarTitle";
import ActionRender from "@/components/ActionRender";
import { FULLSCREEN_ICONS } from "@/constants";
import { composeColumns } from "@/utils/columns";
import { renderStatus, renderWhether } from "@/constants/public";

export default function AiClassifyPage() {
  const navigate = useNavigate();
  const { isFullscreen } = useProTableFullscreen();
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const [disabled, setDisabled] = useState(true);
  const [selectedOne, setSelectedOne] = useState<Record<string, unknown>>({});
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});

  const handdleAdd = () => navigate("/ai/classify/add");

  const handdleEdit = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    navigate(`/ai/classify/edit/${row.id}`);
  };

  const handdleDel = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    Modal.confirm({
      title: "下架确认",
      content: `确定下架「${row.name}」？（status=0，可再编辑上架）`,
      okType: "danger",
      onOk: async () => {
        await deleteAiClassify(row.id as number);
        actionRef.current?.reload();
      },
    });
  };

  const columns = composeColumns(
    [
      { title: "ID", dataIndex: "id", width: 70, search: false, fixed: "left" },
      { title: "名称", dataIndex: "name", width: 120, ellipsis: true },
      {
        title: "描述",
        dataIndex: "description",
        search: false,
        ellipsis: true,
      },
      {
        title: "模型",
        dataIndex: "model",
        search: false,
        ellipsis: true,
        width: 120,
      },
      { title: "扣点", dataIndex: "cost_point", search: false, width: 70 },
      {
        title: "上架",
        dataIndex: "status",
        valueType: "select",
        valueEnum: { 1: { text: "是" }, 0: { text: "否" } },
        width: 70,
        search: false,
        render: renderStatus(),
      },
      {
        title: "可用",
        dataIndex: "disabled",
        search: false,
        width: 70,
        render: (_, r) => (r.disabled === 0 ? "是" : "否"),
      },
      {
        title: "热门",
        dataIndex: "is_hot",
        search: false,
        width: 60,
        render: renderWhether(),
      },
      { title: "排序", dataIndex: "sort_order", search: false, width: 70 },
    ],
    {
      showUpdatedAt: true,
      action: {
        width: 120,
        render: (_: unknown, record: Record<string, unknown>) => (
          <ActionRender
            permissions={{
              edit: "ai:classify:edit",
              del: "ai:classify:del",
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
        add: "ai:classify:add",
        edit: "ai:classify:edit",
        del: "ai:classify:del",
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
            const res: any = await getAiClassifyList({
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
