/*
 * @Author: colpu
 * @Date: 2025-11-16 00:16:50
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-10 22:44:32
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space, type MenuProps } from "antd";
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
import useFormModal from "@/hooks/useFormModal";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import {
  apiPermission,
  apiPermissionGive,
  getPermissionList,
} from "@/api/permission";

import AddPermForm from "./components/add_perm_form";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import { useAppSelector } from "@/store/hooks";
import { renderStatus } from "@/constants/public";
import GivePermForm from "./components/give_perm_form";

type MenuInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

export default function PermissionList() {
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const {
    open: roleOpen,
    onOK: roleOK,
    onCancel: roleCancel,
    formRef: roleFormRef,
  } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [roleData, setRoleData] = useState<any>({});
  const [isRoleEdit, setIsRoleEdit] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const { dict } = useAppSelector((state) => state.dict);

  const fetchPermissionList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getPermissionList(params)) || {};
      data = res.rows || [];
      total = res.total;
      setEditData({});
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

  const handdleAdd = () => {
    setIsEdit(false);
    setEditData(editData);
    onOK();
  };
  const handdleEdit = (record: any) => {
    setIsEdit(true);
    setEditData({ ...record });
    onOK();
  };
  const handdleDel = ({ id, type_code }: any) => {
    Modal.confirm({
      icon: null,
      title: "删除",
      content: "确定删除吗？",
      okType: "danger",
      onOk() {
        apiPermission({ id }, "delete").then(async () => {
          actionRef.current?.reset!();
          setEditData((prev: any) => {
            return { ...prev, type_code };
          });
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSelect = (_current: any, _selected: boolean, selectedRows: any[]) => {
    if (selectedRows.length === 1) {
      setEditData((prev: any) => {
        return { ...prev, ...selectedRows[0] };
      });
    }
  };

  const onChange = (selectedRows: any) => {
    setDisabled(selectedRows.length !== 1);
  };

  const onExport = () => {
    console.log("export");
  };

  // 完成提交数据
  const onFinish = async (values: any) => {
    delete values.confirm_password; // 删除确认密码
    await apiPermission(values, isEdit ? "put" : "post");
    actionRef.current?.reset!();
    onCancel();
  };
  const finishGive = async (values: any) => {
    await apiPermissionGive(values);
    roleCancel(); // 关闭弹窗
  };

  const onClickOtherAction = ({ key }: MenuInfo, record: any) => {
    console.log(key, record);
    const { id, name, type, user_ids = [], role_ids = [] } = record;
    const data = { id, name, type };
    switch (key) {
      case "user":
        setIsRole(false);
        setIsRoleEdit(user_ids.length > 0);
        setRoleData({ ...data, user_ids });
        break;
      case "role":
      default:
        setIsRole(true);
        setRoleData({ ...data, role_ids });
        setIsRoleEdit(role_ids.length > 0);
        break;
    }
    roleOK();
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "权限名称",
        dataIndex: "name",
        fixed: true,
      },
      {
        title: "权限编码",
        dataIndex: "perm_code",
        search: false,
        width: 120,
      },
      {
        title: "类型",
        align: "center",
        dataIndex: "type",
        search: false,
        width: 120,
      },
      {
        title: "请求方法",
        dataIndex: "method",
        search: false,
        width: 120,
      },
      {
        title: "请求路径",
        key: "path",
        dataIndex: "path",
        search: false,
        width: 120,
      },
      {
        title: "排序",
        width: 80,
        align: "center",
        dataIndex: "sort_order",
        search: false,
      },
      {
        title: "状态",
        dataIndex: "status",
        valueType: "radio",
        align: "center",
        width: 60,
        search: false,
        fieldProps: {
          options: dict.enabled_status.options, // 状态字典
        },
        render: renderStatus(),
      },
      {
        title: "创建者",
        width: 80,
        align: "center",
        dataIndex: "created_by",
        search: false,
      },
      {
        title: "更新人",
        width: 80,
        align: "center",
        dataIndex: "updated_by",
        search: false,
      },
      {
        title: "更新人",
        width: 80,
        align: "center",
        dataIndex: "updated_by",
        search: false,
      },
    ],
    {
      showOrder: false,
      showCreatedAt: false,
      action: {
        render: (_: any, record: any) => {
          const editable = !!record.editable;
          return (
            <ActionRender
              disableds={{
                edit: editable,
                del: editable,
                dropdown: editable,
              }}
              permissions={{
                edit: "sys:post:edit",
                del: "sys:post:del",
              }}
              onDel={() => handdleDel(record)}
              onEdit={() => handdleEdit(record)}
              menuProps={{
                style: { minWidth: 120 },
                items: [
                  {
                    label: "分配角色",
                    key: "role",
                  },
                  {
                    label: "分配用户",
                    key: "user",
                  },
                ],
                onClick: (info: MenuInfo) => onClickOtherAction(info, record),
              }}
            />
          );
        },
      },
    }
  );

  // 搜索表单配置
  const formColumns = columns.filter((item) => {
    if (item.search !== false) return item;
  });
  // 弹窗props配置
  const modalProps = {
    open,
    modalProps: {
      onOK,
      onCancel,
      styles: {
        body: { paddingTop: 10 },
      },
      maskClosable: false,
      width: 580,
    },
    editData,
    isEdit,
    formRef,
    title: "权限",
    onFinish,
  };

  const roleModalProps = {
    open: roleOpen,
    modalProps: {
      onOK: roleOK,
      onCancel: roleCancel,
      styles: {
        body: { paddingTop: 10 },
      },
      maskClosable: false,
      width: 560,
    },
    editData: roleData,
    isEdit: isRoleEdit,
    isRole,
    formRef: roleFormRef,
    title: isRole ? "角色" : "用户",
    onFinish: finishGive,
  };

  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
      onExport={onExport}
    />
  );

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
            rowKey="id"
            scroll={{ x: "max-content" }}
            bordered
            formRef={formRef}
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchPermissionList({ page, ...params, ...searchValues });
            }}
            search={false}
            toolbar={
              isFullscreen
                ? { title: toolbarTitle, settings: [] }
                : { title: toolbarTitle }
            }
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
            rowSelection={{
              getCheckboxProps: (record) => ({
                disabled: record.editable === 1, // 某些状态不可选
              }),
              onSelect,
              onChange,
            }}
          />
        </div>
      </Space>
      <AddPermForm {...modalProps} />
      <GivePermForm {...roleModalProps} />
    </>
  );
}
