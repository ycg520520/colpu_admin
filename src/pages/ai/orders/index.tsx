import {
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tag,
} from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import "@/assets/styles/table.scss";
import {
  closeAiOrder,
  getAiOrderDetail,
  getAiOrders,
  refundAiOrder,
} from "@/api/ai/orders";
import useTableColor from "@/hooks/useTableColor";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import { PermissionButton } from "@/components/Permission";
import { FULLSCREEN_ICONS } from "@/constants";
import { composeColumns } from "@/utils/columns";

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  pending: { text: "待支付", color: "default" },
  success: { text: "已支付", color: "success" },
  closed: { text: "已关闭", color: "default" },
  refunded: { text: "已退款", color: "warning" },
};

function formatYuan(cents?: number) {
  if (cents == null) return "-";
  return `¥${(Number(cents) / 100).toFixed(2)}`;
}

export default function AiOrdersPage() {
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const { isFullscreen } = useProTableFullscreen();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundOrder, setRefundOrder] = useState<any>(null);
  const [refundMode, setRefundMode] = useState("cash_and_points");
  const [refundReason, setRefundReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedOne, setSelectedOne] = useState<any>({});
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});

  const openDetail = async (id?: number) => {
    const orderId = id ?? selectedOne?.id;
    if (!orderId) return;
    const res = await getAiOrderDetail(orderId);
    setDetail(res);
    setDetailOpen(true);
  };

  const openRefund = (record?: any) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id || row.status !== "success") return;
    setRefundOrder(row);
    setRefundMode("cash_and_points");
    setRefundReason("");
    setRefundOpen(true);
  };

  const handdleClose = (record?: any) => {
    const row = record?.id ? record : selectedOne;
    if (!row?.id) {
      message.warning("请先勾选一条订单");
      return;
    }
    if (row.status !== "pending") {
      message.warning("仅「待支付」订单可关单");
      return;
    }
    Modal.confirm({
      title: "关闭订单",
      content: `确定关闭待支付订单 #${row.id}？`,
      onOk: async () => {
        try {
          await closeAiOrder(row.id);
          message.success("订单已关闭");
          actionRef.current?.reload();
        } catch (e: any) {
          message.error(e?.message || "关单失败");
          return Promise.reject(e);
        }
      },
    });
  };

  const submitRefund = async () => {
    if (!refundReason.trim()) {
      Modal.warning({ title: "请填写退款原因" });
      return;
    }
    setLoading(true);
    try {
      await refundAiOrder(refundOrder.id, {
        mode: refundMode,
        reason: refundReason.trim(),
      });
      Modal.success({ title: "退款已提交" });
      setRefundOpen(false);
      actionRef.current?.reload();
    } finally {
      setLoading(false);
    }
  };

  const handdleSearch = (values: Record<string, unknown> = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  const columns = composeColumns(
    [
      { title: "ID", dataIndex: "id", width: 80, search: false, fixed: "left" },
      { title: "用户UID", dataIndex: "uid", width: 120, copyable: true, ellipsis: true },
      {
        title: "商户单号",
        dataIndex: "out_trade_no",
        width: 200,
        copyable: true,
        ellipsis: true,
      },
      { title: "套餐ID", dataIndex: "product_id", search: false },
      {
        title: "实付",
        dataIndex: "sale_price",
        search: false,
        render: (_, r) => formatYuan(r.sale_price),
      },
      {
        title: "积分",
        search: false,
        render: (_, r) => `${r.point || 0}+${r.give_point || 0}`,
      },
      {
        title: "状态",
        dataIndex: "status",
        valueType: "select",
        valueEnum: {
          pending: { text: "待支付" },
          success: { text: "已支付" },
          closed: { text: "已关闭" },
          refunded: { text: "已退款" },
        },
        render: (_, r) => {
          const s = STATUS_MAP[r.status] || { text: r.status, color: "default" };
          return <Tag color={s.color}>{s.text}</Tag>;
        },
      },
      {
        title: "下单时间",
        dataIndex: "created_at",
        valueType: "dateTime",
        search: false,
      },
    ],
    {
      showOrder: false,
      action: {
        width: 120,
        render: (_: unknown, record: any) => (
          <Space size={0} split={<span style={{ color: "#eee" }}>|</span>}>
            <PermissionButton
              permission="ai:orders:read"
              buttonProps={{
                size: "small",
                color: "primary",
                variant: "link",
                onClick: () => openDetail(record.id),
              }}
            >
              详情
            </PermissionButton>
            {record.status === "success" ? (
              <PermissionButton
                permission="ai:orders:refund"
                buttonProps={{
                  size: "small",
                  color: "primary",
                  variant: "link",
                  onClick: () => openRefund(record),
                }}
              >
                退款
              </PermissionButton>
            ) : null}
            {record.status === "pending" ? (
              <PermissionButton
                permission="ai:orders:close"
                buttonProps={{
                  size: "small",
                  color: "primary",
                  variant: "link",
                  onClick: () => handdleClose(record),
                }}
              >
                关单
              </PermissionButton>
            ) : null}
          </Space>
        ),
      },
    },
  );

  const formColumns = columns.filter((item) => item.search !== false);

  const toolbarTitle = (
    <Space>
      <PermissionButton
        permission="ai:orders:read"
        buttonProps={{
          color: "blue",
          variant: "dashed",
          disabled,
          onClick: () => openDetail(),
        }}
      >
        详情
      </PermissionButton>
      <PermissionButton
        permission="ai:orders:refund"
        buttonProps={{
          color: "orange",
          variant: "dashed",
          disabled: disabled || selectedOne.status !== "success",
          onClick: () => openRefund(),
        }}
      >
        退款
      </PermissionButton>
      <PermissionButton
        permission="ai:orders:close"
        buttonProps={{
          color: "danger",
          variant: "dashed",
          disabled: disabled || selectedOne.status !== "pending",
          title: disabled
            ? "请先勾选一条订单"
            : selectedOne.status && selectedOne.status !== "pending"
              ? "仅待支付订单可关单"
              : undefined,
          onClick: () => handdleClose(),
        }}
      >
        关单
      </PermissionButton>
    </Space>
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
              const res: any = await getAiOrders({ page, ...params, ...searchValues });
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

      <Modal
        title="订单详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={720}
      >
        {detail?.order && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="订单ID">{detail.order.id}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {STATUS_MAP[detail.order.status]?.text || detail.order.status}
            </Descriptions.Item>
            <Descriptions.Item label="UID">{detail.order.uid}</Descriptions.Item>
            <Descriptions.Item label="用户">
              {detail.user?.nickname || detail.user?.username || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="商户单号" span={2}>
              {detail.order.out_trade_no}
            </Descriptions.Item>
            <Descriptions.Item label="实付">
              {formatYuan(detail.order.sale_price)}
            </Descriptions.Item>
            <Descriptions.Item label="积分">
              {detail.order.point}+{detail.order.give_point}
            </Descriptions.Item>
            <Descriptions.Item label="积分已扣回">
              {detail.points_revoked ? "是" : "否"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="退款"
        open={refundOpen}
        onCancel={() => setRefundOpen(false)}
        onOk={submitRefund}
        confirmLoading={loading}
        okText="确认退款"
      >
        <p style={{ color: "#666", marginBottom: 12 }}>
          仅支持<strong>全额</strong>退款：微信原路退回整单实付，并扣回已发放的全部积分（基础+附赠）。
        </p>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <span>订单 #{refundOrder?.id}</span>
            <span style={{ marginLeft: 8 }}>
              实付 {formatYuan(refundOrder?.sale_price)}
            </span>
          </div>
          <Select
            style={{ width: "100%" }}
            value={refundMode}
            onChange={setRefundMode}
            options={[
              {
                value: "cash_and_points",
                label: "现金原路退 + 扣回全部积分（推荐）",
              },
              { value: "points_only", label: "仅扣回积分（不退微信）" },
              { value: "cash_only", label: "仅微信退款（不扣积分，慎用）" },
            ]}
          />
          <Input.TextArea
            rows={3}
            placeholder="退款原因（必填）"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
        </Space>
      </Modal>
    </>
  );
}
