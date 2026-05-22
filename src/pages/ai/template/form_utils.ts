import { jsonToText, textToJson } from "../classify/form_utils";
import { stripImageSrc } from "@/utils/image";

export function toTemplateFormValues(record: Record<string, unknown> = {}) {
  return {
    ...record,
    classify_ids: record.classify_ids || [],
    prompt_variables_text: jsonToText(record.prompt_variables, "[]"),
  };
}

export function fromTemplateFormValues(values: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...values };
  delete payload.prompt_variables_text;
  delete payload.classify_names;
  if ("prompt_variables_text" in values) {
    payload.prompt_variables = textToJson(
      values.prompt_variables_text as string,
      null,
    );
  }
  const pickUrl = (files: any) => {
    const f = files?.[0];
    if (!f) return "";
    const raw =
      typeof f === "string" ? f : f?.url || f?.response?.url || "";
    return stripImageSrc(raw);
  };
  if (payload.img_files) {
    payload.img_src = pickUrl(payload.img_files);
    delete payload.img_files;
  }
  if (payload.line_art_files) {
    payload.line_art_src = pickUrl(payload.line_art_files);
    delete payload.line_art_files;
  }
  return payload;
}

export const templateFormDefaults = {
  status: 1,
  sort_order: 0,
  classify_ids: [] as number[],
};
