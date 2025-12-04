import { renderStatus } from "@/constants/public";

/*
 * @Author: colpu
 * @Date: 2025-11-25 15:28:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-03 21:38:05
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const userColumns = (dict: any): any[] => [
  {
    title: "用户名称",
    dataIndex: "username",
    ellipsis: true,
    fieldProps: {
      style: { width: "100%" },
    },
  },
  {
    title: "用户昵称",
    dataIndex: "nickname",
    search: false,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    search: false,
  },
  {
    title: "电话",
    dataIndex: "phone",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 60,
    align: "center",
    valueType: "radio",
    search: false,
    fieldProps: {
      options: dict.enabled_status.options,
    },
    render: renderStatus(),
  },
];
