/*
 * @Author: colpu
 * @Date: 2026-05-22 13:14:46
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-05-23 14:30:49
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import { jsonToText, textToJson } from "../classify/form_utils";
import { stripImageSrc } from "@/utils/image";

export function toExtendFormValues(
  record: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...record,
    is_scale: !!record.is_scale,
    example_right_text: jsonToText(record.example_right, "[]"),
    example_error_text: jsonToText(record.example_error, "[]"),
  };
}

export function fromExtendFormValues(values: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...values };
  delete payload.example_right_text;
  delete payload.example_error_text;
  delete payload.classify_name;
  delete payload.classify_model;
  if ("example_right_text" in values) {
    payload.example_right = textToJson(values.example_right_text as string, []);
  }
  if ("example_error_text" in values) {
    payload.example_error = textToJson(values.example_error_text as string, []);
  }
  const pickUrl = (files: any) => {
    const f = files?.[0];
    if (!f) return "";
    const raw = typeof f === "string" ? f : f?.url || f?.response?.url || "";
    return stripImageSrc(raw);
  };
  if (payload.src_files) {
    payload.src = pickUrl(payload.src_files);
    delete payload.src_files;
  }
  if (payload.original_src_files) {
    payload.original_src = pickUrl(payload.original_src_files);
    delete payload.original_src_files;
  }
  if (payload.icon_files) {
    payload.icon = pickUrl(payload.icon_files);
    delete payload.icon_files;
  }
  return payload;
}

export const extendFormDefaults = {
  status: 1,
  slider_percent: 0.5,
  is_scale: false,
  example_right_text: "[]",
  example_error_text: "[]",
};
