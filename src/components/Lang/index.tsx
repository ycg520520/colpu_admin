/*
 * @Author: colpu
 * @Date: 2025-07-10 13:13:05
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 00:59:08
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { Button, Tooltip } from "antd";
import "./style.scss";
import i18n from "@/i18n";
import { useDispatch } from "react-redux";
import { setLang } from "@/store/slices/locale";

export default function Lang(props: {
  className?: string;
  theme?: string;
  hasButton?: boolean;
}) {
  const dispatch = useDispatch();
  const changeLanguage = async () => {
    const lang = i18n.language == "en" ? "zh" : "en";
    // 主动触发远程加载
    if (!i18n.hasResourceBundle(lang, "example")) {
      await i18n.reloadResources([lang], ["example"]);
    }
    i18n.changeLanguage(lang); // 动态切换语言
    dispatch(setLang(lang));
  };
  const child = (
    <div className="lng-icon-wrap">
      <span
        className={[
          "lng-icon",
          props.theme || "white",
          i18n.language === "zh" ? "active" : "",
        ].join(" ")}
      >
        中
      </span>
      <span
        className={[
          "lng-icon",
          props.theme || "white",
          i18n.language === "en" ? "active" : "",
        ].join(" ")}
      >
        En
      </span>
    </div>
  );
  return (
    <Tooltip title="中文 / English">
      <div
        className={["lng-wrap", props.className].join(" ")}
        onClick={() => changeLanguage()}
      >
        {props.hasButton ? (
          <Button type="text" style={{ padding: 6, height: "auto" }}>
            {child}
          </Button>
        ) : (
          child
        )}
      </div>
    </Tooltip>
  );
}
