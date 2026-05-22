import { get, post } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiPointLogs = (params: ObjectMaps) =>
  get("admin/ai/point-logs", { params });

export const refundConsumePoints = (body: {
  consume_log_id: number;
  reason: string;
}) => post("admin/ai/points/refund-consume", body);
