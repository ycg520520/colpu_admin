/*
 * @Author: colpu
 * @Date: 2025-11-25 15:31:16
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-30 16:43:23
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { getUserList } from "@/api/user";
import { Modal, Space } from "antd";
import { useRef, useState } from "react";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { composeColumns } from "@/utils/columns";
import useTableColor from "@/hooks/useTableColor";
import { filterValues } from "@/utils";
import { useAppSelector } from "@/store/hooks";
import { userColumns } from "./config";

export default function UserModal(props: any) {
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const { dict } = useAppSelector((state) => state.dict);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const formRef = useRef<ProFormInstance<any>>(null);
  const { open, onOk, onCancel } = props;

  // 表头配置
  const columns = composeColumns(userColumns(dict), {
    showRemark: false,
    showCreatedAt: false,
    showOrder: false,
  });
  const formColumns = columns.filter((item) => item.search !== false);

  const [searchValues, setSearchValues] = useState({});

  const fetchUserList = async (params: any) => {
    let data = [];
    let total = 0;
    params = { ...params, ...searchValues };
    try {
      const res: any = await getUserList(params);
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
  const handdleSearch = (values = {}, isRest = false) => {
    const searchValue = filterValues(formRef.current?.getFieldsValue());
    setSearchValues((prev) => {
      return isRest ? values : { ...prev, ...searchValue, ...values };
    });
    actionRef.current?.reload();
  };

  const onChange = (selectedRows: any) => {
    setSelectedRows(selectedRows);
  };

  return (
    <Modal
      title="添加用户"
      width={750}
      open={open}
      onCancel={() => {
        formRef.current?.resetFields();
        onCancel();
      }}
      onOk={() => {
        onOk(selectedRows);
      }}
    >
      <Space size={10} direction="vertical" style={{ display: "flex" }}>
        {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
        <BetaSchemaForm
          formRef={formRef}
          style={{ margin: "24px 0" }}
          layout="inline"
          onReset={() => handdleSearch({}, true)}
          onFinish={() => handdleSearch()}
          submitter={{
            searchConfig: {
              submitText: "搜索",
            },
          }}
          columns={formColumns as ProFormColumnsType[]}
        />
        <ProTable
          className={tableStyles}
          scroll={{ x: "max-content", y: 300 }}
          bordered
          columns={columns}
          actionRef={actionRef}
          request={({ current: page, ...params }) => {
            return fetchUserList({ page, ...params });
          }}
          rowKey="id"
          search={false}
          ghost={true}
          toolBarRender={false}
          rowClassName={rowClassName}
          tableAlertRender={false}
          rowSelection={{
            getCheckboxProps: (record) => ({
              disabled: record.editable === 1, // 某些状态不可选
            }),
            selectedRowKeys: selectedRows,
            onChange,
          }}
        />
      </Space>
    </Modal>
  );
}
