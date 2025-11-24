import { useEmotionCss } from "@ant-design/use-emotion-css";
import { theme } from "antd";

/*
 * @Author: colpu
 * @Date: 2025-11-16 22:01:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-17 21:12:07
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export default function useTableColor() {
  const { token } = theme.useToken();
  const backgroundColor =  "#fafafa";
  const tableStyles = useEmotionCss(() => ({
    "& .ant-table-wrapper": {
      // 左侧固定列
      ".ant-table-fixed-left": {
        ".ant-table-tbody": {
          "tr.even-row td": {
            backgroundColor,
            borderRight: `1px solid ${token.colorSplit}`,
          },
          "tr.odd-row td": {
            borderRight: `1px solid ${token.colorSplit}`,
          },
          "tr:hover td": {
            backgroundColor: `${token.colorPrimaryBgHover} !important`,
          },
        },
      },

      // 右侧固定列
      ".ant-table-fixed-right": {
        ".ant-table-tbody": {
          "tr.even-row td": {
            backgroundColor,
            borderLeft: `1px solid ${token.colorSplit}`,
          },
          "tr.odd-row td": {
            borderLeft: `1px solid ${token.colorSplit}`,
          },
          "tr:hover td": {
            backgroundColor: `${token.colorPrimaryBgHover} !important`,
          },
        },
      },

      // 主体表格
      ".ant-table-tbody": {
        "tr.even-row td": {
          backgroundColor,
        },
        "tr.odd-row td": {
        },
        "tr:hover td": {
          backgroundColor: `${token.colorPrimaryBgHover} !important`,
        },
      },
    },
  }));
  const rowClassName = (record: any, index: number) => {
    const className = [index % 2 === 0 ? "odd-row" : "even-row"]; // 隔行变色
    className.push(record.status ? "" : "warning-tr");
    return className.join(" ");
  };
  return { tableStyles, rowClassName };
}
