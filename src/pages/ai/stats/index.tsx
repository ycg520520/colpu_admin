import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { getAiStatsOverview } from "@/api/ai/stats";

function formatYuan(cents?: number) {
  if (cents == null) return "0";
  return (Number(cents) / 100).toFixed(2);
}

export default function AiStatsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAiStatsOverview().then(setData);
  }, []);

  const today = data?.today || {};
  const week = data?.last_7_days || {};

  return (
    <Card title="AI 运营统计">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="今日订单" value={today.order_count || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="今日支付笔数" value={today.paid_count || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日 GMV（元）"
              value={formatYuan(today.gmv_cents)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日退款笔数"
              value={data?.today_refund_count || 0}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="近 7 日">
            <Row gutter={16}>
              <Col md={8}>
                <Statistic title="订单数" value={week.order_count || 0} />
              </Col>
              <Col md={8}>
                <Statistic title="支付笔数" value={week.paid_count || 0} />
              </Col>
              <Col md={8}>
                <Statistic
                  title="GMV（元）"
                  value={formatYuan(week.gmv_cents)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
