/*
 * @Author: colpu
 * @Date: 2025-11-16 23:07:18
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-02 22:35:35
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
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { composeColumns } from "@/utils/columns";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import useTableColor from "@/hooks/useTableColor";
import { filterValues } from "@/utils";
import { PermissionButton } from "@/components/Permission";
import { useAppSelector } from "@/store/hooks";
import { userColumns } from "./components/config";
import UserModal from "./components/user_modal";
import { useNavigate, useParams } from "react-router";
import { apiRoleUser } from "@/api/roles";

export default function RoleUserList() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [userIds, setUserIds] = useState<any>([]);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const formSearchRef = useRef<ProFormInstance>();
  const { dict } = useAppSelector((state) => state.dict);
  const { id } = useParams();

  const fetchRoleUserList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await apiRoleUser({ role_id: id, ...params })) || {};
      data = res.rows || [];
      total = res.total || 0;
      setUserIds([]);
    } catch (err) {
      console.log(err);
    }
    if (data.length === 0) {
      setDisabled(true);
    }
    return {
      data,
      success: true,
      total,
    };
  };

  const onSelect = (_current: any, _selected: boolean, selectedRows: any[]) => {
    setUserIds([...selectedRows]);
    console.log(userIds, selectedRows);
  };

  const onChange = (selectedRows: any) => {
    setUserIds([...selectedRows]);
    console.log(userIds, selectedRows);
    setDisabled(selectedRows.length === 0);
  };

  // 表头配置
  const columns = composeColumns(userColumns(dict), {
    showRemark: false,
    showCreatedAt: false,
    order: { fixed: false },
    action: {
      width: 100,
      fixed: false,
      render: (_: any, record: any) => {
        return (
          <PermissionButton
            buttonProps={{
              size: "small",
              color: "primary",
              variant: "link",
              onClick: () => handdleDelete([record.id]),
            }}
          >
            取消授权
          </PermissionButton>
        );
      },
    },
  });

  // 搜索表单配置
  const formColumns = columns.filter((item) => item.search !== false);
  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      addProps={{
        icon: null,
        text: "添加用户",
        onClick: onOK,
      }}
      buttons={[
        <PermissionButton
          buttonProps={{
            color: "danger",
            variant: "dashed",
            disabled,
            onClick: () => handdleDelete(userIds),
          }}
        >
          批量取消授权
        </PermissionButton>,
      ]}
      onClose={() => {
        navigate("/system/role/index");
      }}
    />
  );
  const [searchValues, setSearchValues] = useState({});
  const handdleSearch = (values = {}, isRest = false) => {
    const searchValue = filterValues(formSearchRef.current?.getFieldsValue());
    setSearchValues((prev) => {
      return isRest ? values : { ...prev, ...searchValue, ...values };
    });
    actionRef.current?.reload();
  };

  const handdleDelete = async (values: any) => {
    await apiRoleUser({ role_id: id, user_ids: values }, "delete");
    setUserIds((prev: any) => {
      return [...prev.filter((item: any) => !values.includes(item))];
    });
    actionRef.current?.reload();
  };
  const handdleAddUser = async (values: any) => {
    await apiRoleUser({ role_id: id, user_ids: values }, "post");
    actionRef.current?.reload();
    onCancel();
  };

  return (
    <Card style={{ border: "none" }}>
      <Space size={10} direction="vertical" style={{ display: "flex" }}>
        {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
        <BetaSchemaForm
          formRef={formSearchRef}
          style={{ margin: "24px 0 0" }}
          layout="inline"
          onReset={() => handdleSearch({}, true)}
          onFinish={handdleSearch}
          submitter={{
            searchConfig: {
              submitText: "搜索",
            },
          }}
          columns={formColumns as ProFormColumnsType[]}
        />
        <ProTable
          className={tableStyles}
          bordered
          formRef={formRef}
          actionRef={actionRef}
          style={{ position: "relative", zIndex: 0, width: "100%" }}
          columns={columns}
          ghost={true}
          request={({ current: page, ...params }) => {
            return fetchRoleUserList({ page, ...params, ...searchValues });
          }}
          rowKey="id"
          search={false}
          toolbar={
            isFullscreen
              ? { title: toolbarTitle, settings: [] }
              : { title: toolbarTitle }
          }
          toolBarRender={(action) => {
            const ScreenIcon =
              FULLSCREEN_ICONS[isFullscreen ? "fullscreen" : "exitFullScreen"];
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
          rowSelection={{
            onSelect,
            onChange,
          }}
        />
      </Space>
      <UserModal
        {...{
          open,
          onCancel,
          onOk: handdleAddUser,
        }}
      />
    </Card>
  );
}
