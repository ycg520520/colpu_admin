import $http, { get, post, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiOrders = (params: ObjectMaps) =>
  get("admin/ai/orders", { params });

export const getAiOrderDetail = (id: number | string) =>
  get(`admin/ai/orders/${id}`);

export const refundAiOrder = (
  id: number | string,
  body: { mode?: string; reason: string },
) => post(`admin/ai/orders/${id}/refund`, body);

export const closeAiOrder = (id: number | string) =>
  post(`admin/ai/orders/${id}/close`);

export const apiAiOrder = (
  params: ObjectMaps,
  method: RequestMethod = "get",
) =>
  ($http as any)[method](
    "admin/ai/orders",
    ["get", "delete"].includes(method) ? { params } : params,
  );
