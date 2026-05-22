import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiClassifyList = (params: ObjectMaps) =>
  get("admin/ai/classify/list", { params });

export const getAiClassifyDetail = (id: number | string) =>
  get(`admin/ai/classify/${id}`);

export const apiAiClassify = (
  params: ObjectMaps,
  method: RequestMethod = "put",
) => ($http as any)[method]("admin/ai/classify", params);

export const createAiClassify = (params: ObjectMaps) =>
  apiAiClassify(params, "post");

export const updateAiClassify = (params: ObjectMaps) =>
  apiAiClassify(params, "put");

export const deleteAiClassify = (id: number | string) =>
  ($http as any).delete(`admin/ai/classify/${id}`);
