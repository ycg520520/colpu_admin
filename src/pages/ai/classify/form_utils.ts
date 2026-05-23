export function jsonToText(value: unknown, fallback = "[]") {
  if (value == null || value === "") return fallback;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

export function textToJson(text: string, fallback: unknown) {
  const s = String(text ?? "").trim();
  if (!s) return fallback;
  return JSON.parse(s);
}

export function toFormValues(
  record: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...record,
    template_ids: record.template_ids || [],
    upload_opt_text: jsonToText(record.upload_opt, '[{"tip":"上传您的照片"}]'),
    prompt_variables_text: jsonToText(record.prompt_variables, "[]"),
  };
}

export function fromFormValues(values: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...values };
  delete payload.upload_opt_text;
  delete payload.prompt_variables_text;
  delete payload.templates;
  if ("upload_opt_text" in values) {
    payload.upload_opt = textToJson(values.upload_opt_text as string, [
      { tip: "上传您的照片" },
    ]);
  }
  if ("prompt_variables_text" in values) {
    const parsed = textToJson(values.prompt_variables_text as string, null);
    payload.prompt_variables = parsed;
  }
  if (payload.template_ids && !Array.isArray(payload.template_ids)) {
    payload.template_ids = [];
  }
  return payload;
}

export const classifyFormDefaults = {
  status: 1,
  disabled: 0,
  cost_point: 10,
  cost_point_hd: 20,
  sort_order: 0,
  enable_enhance: 1,
  enable_size: 1,
  enable_crop: 0,
  enable_face_detect: 0,
  enable_grid_split: 0,
  aspect_ratio: "3:4",
  size: "1K",
  size_hd: "2K",
  output_dpi: 72,
  is_hot: 0,
  is_tip: 0,
  template_ids: [] as number[],
};
