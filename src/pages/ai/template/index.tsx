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
import {
  deleteAiTemplate,
  getAiTemplateList,
} from "@/api/ai/template";
import useTableColor from "@/hooks/useTableColor";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import ToolBarTitle from "@/components/ToolBarTitle";
import ActionRender from "@/components/ActionRender";
import { FULLSCREEN_ICONS } from "@/constants";
import { composeColumns } from "@/utils/columns";
import { renderStatus } from "@/constants/public";
import { getImageSrc } from "@/utils/image";

export default function AiTemplatePage() {
  const navigate = useNavigate();
  const { isFullscreen } = useProTableFullscreen();
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const [disabled, setDisabled] = useState(true);
  const [selectedOne, setSelectedOne] = useState<Record<string, unknown>>({});
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});

  const handdleAdd = () => navigate("/ai/classify/templates/add");

  const handdleEdit = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    navigate(`/ai/classify/templates/edit/${row.id}`);
  };

  const handdleDel = (record?: Record<string, unknown>) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) return;
    Modal.confirm({
      title: "下架模版",
      content: `确定下架「${row.name || row.id}」？`,
      okType: "danger",
      onOk: async () => {
        await deleteAiTemplate(row.id as number);
        actionRef.current?.reload();
      },
    });
  };

  const columns = composeColumns(
    [
      { title: "ID", dataIndex: "id", width: 70, search: false, fixed: "left" },
      { title: "名称", dataIndex: "name", width: 140, ellipsis: true },
      {
        title: "类目ID",
        dataIndex: "category_id",
        width: 80,
        search: false,
      },
      {
        title: "预览",
        dataIndex: "img_src",
        search: false,
        width: 80,
        render: (_, r) => {
          const src = getImageSrc(r.img_src as string);
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
        title: "关联项目",
        dataIndex: "classify_names",
        search: false,
        ellipsis: true,
        render: (_, r) => {
          const names = r.classify_names || [];
          if (!names.length) return "-";
          return names.map((n: string) => (
            <Tag key={n} style={{ marginBottom: 4 }}>
              {n}
            </Tag>
          ));
        },
      },
      {
        title: "上架",
        dataIndex: "status",
        valueType: "select",
        valueEnum: { 1: { text: "是" }, 0: { text: "否" } },
        width: 70,
        render: renderStatus(),
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
              edit: "ai:template:edit",
              del: "ai:template:del",
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
      addProps={{ text: "新增模版", icon: false }}
      permissions={{
        add: "ai:template:add",
        edit: "ai:template:edit",
        del: "ai:template:del",
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
            const res: any = await getAiTemplateList({
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
