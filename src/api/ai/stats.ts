import { get } from "@/utils/request";

export const getAiStatsOverview = () => get("admin/ai/stats/overview");

export const getAiStatsTrend = (params?: { days?: number }) =>
  get("admin/ai/stats/trend", { params });
