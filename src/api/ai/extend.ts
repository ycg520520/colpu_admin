import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiExtendList = (params: ObjectMaps) =>
  get("admin/ai/extends/list", { params });

export const getAiExtendDetail = (id: number | string) =>
  get(`admin/ai/extends/${id}`);

export const getAiExtendClassifyOptions = () =>
  get("admin/ai/extends/classify-options");

export const apiAiExtend = (
  params: ObjectMaps,
  method: RequestMethod = "put",
) => ($http as any)[method]("admin/ai/extends", params);

export const createAiExtend = (params: ObjectMaps) =>
  apiAiExtend(params, "post");

export const updateAiExtend = (params: ObjectMaps) =>
  apiAiExtend(params, "put");

export const deleteAiExtend = (id: number | string) =>
  ($http as any).delete(`admin/ai/extends/${id}`);
