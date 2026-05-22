import { Card, Modal, Space, Tag, message } from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ModalForm,
  ProFormColumnsType,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import "@/assets/styles/table.scss";
import { apiAiAdSlot, deleteAiAdSlot, getAiAdSlots } from "@/api/ai/ads";
import useTableColor from "@/hooks/useTableColor";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import ToolBarTitle from "@/components/ToolBarTitle";
import ActionRender from "@/components/ActionRender";
import { FULLSCREEN_ICONS } from "@/constants";
import { composeColumns } from "@/utils/columns";

const SLOT_TYPE_OPTIONS = [
  { label: "开屏 splash", value: "splash" },
  { label: "Banner", value: "banner" },
  { label: "自定义 custom", value: "custom" },
  { label: "列表推荐 list", value: "list" },
];

const SLOT_TYPE_COLOR: Record<string, string> = {
  splash: "purple",
  banner: "blue",
  custom: "cyan",
  list: "green",
};

export default function AiAdsPage() {
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const { isFullscreen } = useProTableFullscreen();
  const [slotOpen, setSlotOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [disabled, setDisabled] = useState(true);
  const [selectedOne, setSelectedOne] = useState<any>({});
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});

  const handdleAdd = () => {
    setEditing(null);
    setSlotOpen(true);
  };

  const handdleEdit = (record?: any) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    setEditing(row);
    setSlotOpen(true);
  };

  const handdleDel = (record?: any) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    Modal.confirm({
      title: "删除广告位",
      content: `确定删除 #${row.id}？（软删除）`,
      okType: "danger",
      onOk: async () => {
        await deleteAiAdSlot(row.id);
        actionRef.current?.reload();
      },
    });
  };

  const handdleSearch = (values: Record<string, unknown> = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  const columns = composeColumns(
    [
      { title: "ID", dataIndex: "id", width: 70, search: false, fixed: "left" },
      {
        title: "类型",
        dataIndex: "slot_type",
        valueType: "select",
        valueEnum: Object.fromEntries(
          SLOT_TYPE_OPTIONS.map((o) => [o.value, { text: o.label }]),
        ),
        render: (_, r) => (
          <Tag color={SLOT_TYPE_COLOR[r.slot_type] || "default"}>
            {r.slot_type}
          </Tag>
        ),
      },
      { title: "排序", dataIndex: "sort_order", search: false, width: 70 },
      {
        title: "unitId",
        dataIndex: "unit_id",
        ellipsis: true,
        search: false,
        render: (_, r) => r.unitId || r.unit_id || "-",
      },
      { title: "标题", dataIndex: "title", search: false, ellipsis: true },
      { title: "资源", dataIndex: "src", search: false, ellipsis: true },
      {
        title: "启用",
        dataIndex: "enabled",
        search: false,
        render: (_, r) =>
          r.slot_type === "splash" ? (
            <Tag color={r.enabled ? "success" : "default"}>
              {r.enabled ? "是" : "否"}
            </Tag>
          ) : (
            "-"
          ),
      },
      {
        title: "禁用展示",
        dataIndex: "disabled",
        search: false,
        render: (_, r) =>
          r.slot_type === "list" ? (
            <Tag color={r.disabled ? "error" : "success"}>
              {r.disabled ? "是" : "否"}
            </Tag>
          ) : (
            "-"
          ),
      },
    ],
    {
      showOrder: false,
      showUpdatedAt: true,
      action: {
        width: 120,
        render: (_: unknown, record: any) => (
          <ActionRender
            permissions={{
              edit: "ai:ads:edit",
              del: "ai:ads:del",
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
        add: "ai:ads:add",
        edit: "ai:ads:edit",
        del: "ai:ads:del",
      }}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit()}
      onDel={() => handdleDel()}
    />
  );

  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Card style={{ border: "none", padding: 0 }}>
          <BetaSchemaForm
            layout="inline"
            onReset={() => handdleSearch()}
            onFinish={(values) => handdleSearch(values)}
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
              const res: any = await getAiAdSlots({ page, ...params, ...searchValues });
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
                FULLSCREEN_ICONS[isFullscreen ? "fullscreen" : "exitFullScreen"];
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

      <ModalForm
        title={editing ? `编辑广告位 #${editing.id}` : "新建广告位"}
        open={slotOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setSlotOpen(false),
        }}
        initialValues={
          editing
            ? {
                ...editing,
                enabled: editing.enabled === true || editing.enabled === 1,
                disabled: editing.disabled === true || editing.disabled === 1,
              }
            : { sort_order: 0, enabled: false, disabled: false }
        }
        onFinish={async (values) => {
          const payload = {
            ...values,
            enabled: values.enabled ? 1 : 0,
            disabled: values.disabled ? 1 : 0,
          };
          if (editing?.id) {
            await apiAiAdSlot({ id: editing.id, ...payload }, "put");
          } else {
            await apiAiAdSlot(payload, "post");
          }
          message.success("保存成功");
          setSlotOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormSelect
          name="slot_type"
          label="类型"
          options={SLOT_TYPE_OPTIONS}
          rules={[{ required: true }]}
          disabled={!!editing}
        />
        <ProFormDigit name="sort_order" label="排序" min={0} />
        <ProFormText name="unit_id" label="unitId" placeholder="微信广告位 ID" />
        <ProFormDigit name="ad_intervals" label="刷新间隔（秒）" min={0} />
        <ProFormText name="src" label="CDN 路径" placeholder="static/..." />
        <ProFormText name="href" label="跳转" />
        <ProFormText name="title" label="标题" />
        <ProFormSwitch name="enabled" label="开屏启用" />
        <ProFormSwitch name="disabled" label="列表禁用展示" />
      </ModalForm>
    </>
  );
}
