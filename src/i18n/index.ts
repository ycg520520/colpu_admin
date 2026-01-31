/*
 * @Author: colpu
 * @Date: 2025-03-26 15:51:31
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 20:43:24
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import enUS from "./en-US";
import zhCN from "./zh-CN";
import antZhCN from "antd/locale/zh_CN";
import antEnUS from "antd/locale/en_US";
import { CustomLocale } from "./types";
import { Locale } from "antd/es/locale";
import { getItem } from "@/utils/storage";
import { I18NEXTLNG } from "@/constants";

export const setLocale = (lang: string = "zh"): CustomLocale => {
  switch (lang) {
    case "en":
      return enUS;
    case "zh":
    default:
      return zhCN;
  }
};
export const setAntLocale = (lang: string = "zh"): Locale => {
  switch (lang) {
    case "en":
      return antEnUS;
    case "zh":
    default:
      return antZhCN;
  }
};

// 获取初始语言的函数
function getInitialLanguage() {
  // 1. 检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && ["en", "zh"].includes(langParam)) return langParam;

  // 2. 检查本地存储
  const savedLang = getItem(I18NEXTLNG);
  if (savedLang && ["en", "zh"].includes(savedLang)) return savedLang;

  // 3. 检查浏览器语言
  const browserLang = navigator.language;
  if (browserLang.startsWith("zh")) return "zh";

  // 4. 默认返回中文
  return "zh";
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(), // 直接指定初始语言为中文
    fallbackLng: "zh",
    supportedLngs: ["en", "zh"],
    defaultNS: "common", // 设置本地的默认命名空间
    // 设置本地翻译资源
    resources: {
      en: {
        common: enUS,
      },
      zh: {
        common: zhCN,
      },
    },
    // 远程加载空间名称
    ns: ["example"], // 指定支持的命名空间
    detection: {
      order: [
        "querystring", // 首先检查URL参数
        "cookie", // 然后检查cookie
        "localStorage", // 然后检查localStorage
        "sessionStorage", // 然后检查sessionStorage
        "navigator", // 然后检查浏览器语言
        "htmlTag", // 最后检查html标签的lang属性
        "path", // 检查URL路径 (如 /zh/page)
        "subdomain", // 检查子域名 (如 zh.domain.com)
      ],

      // 各个检测源的配置
      lookupQuerystring: "lang", // 从URL参数获取 ?lang=zh
      lookupCookie: I18NEXTLNG,
      lookupLocalStorage: I18NEXTLNG,
      lookupSessionStorage: I18NEXTLNG,
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // 缓存设置
      caches: ["localStorage", "cookie"],

      convertDetectedLanguage: (lng) => {
        // 将检测到的语言映射到支持的语言
        if (lng.startsWith("zh")) return "zh";
        return lng;
      },
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    // backend: {
      // loadPath: "https://file.nadu8.com/locales/{{lng}}/{{ns}}.json", // 远程加载路径
    // },
  });
// 开发环境调试
if (process.env.NODE_ENV === "development") {
  i18n.on("initialized", () => {
    console.log("i18n初始完成, 当前语言为:", i18n.language);
  });
}
export default i18n;
