import $http, { get, put, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiAdSlots = (params: ObjectMaps) =>
  get("admin/ai/ads", { params });

export const getAiAdSlotDetail = (id: number | string) =>
  get(`admin/ai/ads/${id}`);

export const getAiAdSettings = () => get("admin/ai/ads/settings");

export const updateAiAdSettings = (body: ObjectMaps) =>
  put("admin/ai/ads/settings", body);

export const apiAiAdSlot = (
  params: ObjectMaps,
  method: RequestMethod = "put",
) => ($http as any)[method]("admin/ai/ads", params);

export const deleteAiAdSlot = (id: number | string) =>
  ($http as any).delete(`admin/ai/ads/${id}`);
