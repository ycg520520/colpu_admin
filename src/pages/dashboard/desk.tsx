/*
 * @Author: colpu
 * @Date: 2025-03-22 00:13:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-20 13:11:11
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ProCard } from "@ant-design/pro-components";
import { Pagination } from "antd";
import { useTranslation, Trans } from "react-i18next";
export default function Desk() {
  const { t } = useTranslation(["common", "example"]);
  return (
    <ProCard>
      <h3>这是本地翻译: </h3>
      <div>1、直接使用健值 -&gt;&nbsp;{t("lang")}</div>
      <div>
        2、通过组件进行翻译 -&gt;&nbsp;
        <Trans i18nKey={"user.terms"}></Trans>
      </div>
      <div>
        3、翻译中存在替换变量通过配置对于字段进行替换 -&gt;{" "}
        {t("user.help", { name: "<这里是替换站位符name得来的>" })}
      </div>
      <div>
        4、Ant组件自动翻译
        <Pagination defaultCurrent={1} total={50} showSizeChanger />
      </div>
      <h3>这是远端获取翻译: </h3>
      <div>1、用“:”号指定空间 -&gt;&nbsp;{t("example:example.mock")}</div>
      <div>
        2、通过配置指定空间 -&gt;&nbsp;{t("example.mock", { ns: "example" })}
      </div>
    </ProCard>
  );
}
