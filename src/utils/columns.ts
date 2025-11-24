/*
 * @Author: colpu
 * @Date: 2025-11-03 16:41:07
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-18 00:14:01
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";

export function composeColumns(
  columns: ProColumns[],
  options: any = {}
): ProColumns[] {
  const {
    showCreatedAt = true,
    showUpdatedAt = false,
    showOrder = true,
    showRemark = false,
    action = {},
    searchCreatedAt = false,
  } = options;
  return [
    ...(showOrder
      ? [
          {
            title: "序号",
            align: "center",
            width: 60,
            fixed: "left",
            search: false,
            render: (_text: any, _record: any, index: number) => {
              const { pages } = options;
              if (pages) {
                return `${(pages.page - 1) * pages.pageSize + index + 1}`;
              } else {
                return `${index + 1}`;
              }
            },
          },
        ]
      : []),
    ...columns,
    ...(showRemark
      ? [
          {
            title: "备注",
            key: "remark",
            dataIndex: "remark",
            width: 200,
            ellipsis: true,
            search: false,
          },
        ]
      : []),
    ...(showCreatedAt
      ? [
          {
            title: "创建时间",
            key: "create_at",
            width: 160,
            dataIndex: "create_at",
            search: searchCreatedAt,
            render: (_value: any, record: any) => {
              return dayjs(record.created_at).format("YYYY-MM-DD h:mm:ss");
            },
          },
        ]
      : []),
    ...(showUpdatedAt
      ? [
          {
            title: "更新时间",
            key: "updated_at",
            width: 160,
            search: false,
            dataIndex: "updated_at",
            render: (_value: any, record: any) => {
              dayjs(record.updated_at).format("YYYY-MM-DD h:mm:ss");
            },
          },
        ]
      : []),
    {
      title: "操作",
      key: "action",
      fixed: "right",
      align: "center",
      search: false,
      width: 110,
      ...action,
    },
  ];
}
