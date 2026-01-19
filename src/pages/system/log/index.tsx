/*
 * @Author: colpu
 * @Date: 2025-11-16 00:16:50
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-19 16:24:36
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Space } from "antd";
import { useRef, useState } from "react";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import { composeColumns } from "@/utils/columns";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import { FULLSCREEN_ICONS } from "@/constants";
import { getLogList } from "@/api/log";
import useTableColor from "@/hooks/useTableColor";

export default function LogsList() {
  const { tableStyles, rowClassName } = useTableColor();
  const actionRef = useRef<ActionType | null>(null);
  const { isFullscreen } = useProTableFullscreen();

  const fetchLogList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getLogList(params)) || {};
      data = res.rows || [];
      total = res.total;
    } catch (err) {
      console.log(err);
    }
    return {
      data,
      success: true,
      total,
    };
  };
  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "操作人员",
        dataIndex: "username",
        fixed: true,
      },
      {
        title: "操作方式",
        dataIndex: "method",
        search: false,
        width: 120,
      },
      {
        title: "请求地址",
        dataIndex: "url",
        search: false,
        width: 120,
      },
      {
        title: "操作IP",
        dataIndex: "ip",
        search: false,
        width: 120,
      },
      {
        title: "操作状态",
        width: 80,
        align: "center",
        key: "status",
        dataIndex: "status",
        search: false,
      },
    ],
    {
      action: null,
    }
  );

  // 搜索表单配置
  const formColumns = columns.filter((item) => {
    if (item.search !== false) return item;
  });

  const [searchValues, setSearchValues] = useState({});
  const handdleSearch = (values = {}) => {
    setSearchValues(values);
    actionRef.current?.reload();
  };

  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
        {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
        <Card style={{ border: "none" }}>
          <BetaSchemaForm
            layout="inline"
            onReset={handdleSearch}
            onFinish={(values) => {
              handdleSearch(values);
            }}
            submitter={{
              searchConfig: {
                submitText: "搜索",
              },
            }}
            columns={formColumns as ProFormColumnsType[]}
          />
        </Card>
        <div className={tableStyles}>
          <ProTable
            bordered
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchLogList({ page, ...params, ...searchValues });
            }}
            rowKey="id"
            search={false}
            toolbar={isFullscreen ? { settings: [] } : {}}
            toolBarRender={(action) => {
              const ScreenIcon =
                FULLSCREEN_ICONS[
                  isFullscreen ? "fullscreen" : "exitFullScreen"
                ];
              return [
                <ScreenIcon
                  key="fullscreen"
                  {...{
                    style: { fontSize: 16 },
                    onClick: () => {
                      action?.fullScreen!();
                    },
                  }}
                />,
              ];
            }}
            rowClassName={rowClassName}
            tableAlertRender={false}
          />
        </div>
      </Space>
    </>
  );
}
