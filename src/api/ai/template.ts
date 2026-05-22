import $http, { get, type RequestMethod } from "@/utils/request";
import { ObjectMaps } from "@/types";

export const getAiTemplateList = (params: ObjectMaps) =>
  get("admin/ai/templates/list", { params });

export const getAiTemplateDetail = (id: number | string) =>
  get(`admin/ai/templates/${id}`);

export const getAiTemplateCategories = () =>
  get("admin/ai/templates/categories");

export const getAiClassifyOptions = () =>
  get("admin/ai/templates/classify-options");

export const apiAiTemplate = (
  params: ObjectMaps,
  method: RequestMethod = "put",
) => ($http as any)[method]("admin/ai/templates", params);

export const createAiTemplate = (params: ObjectMaps) =>
  apiAiTemplate(params, "post");

export const updateAiTemplate = (params: ObjectMaps) =>
  apiAiTemplate(params, "put");

export const deleteAiTemplate = (id: number | string) =>
  ($http as any).delete(`admin/ai/templates/${id}`);
