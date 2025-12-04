/*
 * @Author: colpu
 * @Date: 2025-06-12 16:13:46
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-04 21:51:26
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space } from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import useTableColor from "@/hooks/useTableColor";
import { composeColumns } from "@/utils/columns";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import RoleForm from "./components/role_form";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import ActionRender from "@/components/ActionRender";
import { apiDataScope, apiRole, getRoleList } from "@/api/roles";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/store/hooks";
import { renderStatus } from "@/constants/public";
import PremForm from "./components/data_prem_form";
import { MenuInfo } from "rc-menu/lib/interface";
export default function RoleList() {
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const {
    open: openPrem,
    onOK: onOKPrem,
    onCancel: onCancelPrem,
    formRef: formRefPrem,
  } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const navigate = useNavigate();
  const { dict } = useAppSelector((state) => state.dict);

  const fetchRoleList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getRoleList(params)) || {};
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
        apiRole({ id }, "delete").then(async () => {
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
    await apiRole(values, isEdit ? "put" : "post");
    actionRef.current?.reset!();
    onCancel();
  };

  const onFinishPrem = async ({ role_id, scope_type, config }: any) => {
    await apiDataScope({ role_id, scope_type, config });
    actionRef.current?.reset!();
    onCancelPrem();
  };
  const onClickOtherAction = ({ key }: MenuInfo, row: any) => {
    switch (key) {
      case "1":
        navigate(`/system/role/user/${row.id}`);
        break;
      case "2":
        onOKPrem();
        setEditData({ ...row });
        break;
      default:
        break;
    }
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "角色名称",
        width: 160,
        fixed: "left",
        dataIndex: "name",
      },
      {
        title: "角色编码",
        width: 100,
        dataIndex: "code",
        search: false,
      },
      {
        title: "角色描述",
        dataIndex: "description",
        search: false,
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
    ],
    {
      searchCreatedAt: true,
      action: {
        width: 120,
        render: (_: React.ReactNode, record: any) => {
          return (
            <ActionRender
              disableds={{
                edit: !!record.editable,
                del: !!record.editable,
                dropdown: !!record.editable,
              }}
              permissions={{
                edit:'sys:role:edit',
                del:'sys:role:del'
              }}
              onDel={() => handdleDel(record)}
              onEdit={() => handdleEdit(record)}
              menuProps={{
                style: { minWidth: 120 },
                items: [
                  {
                    label: "分配用户",
                    key: 1,
                  },
                  {
                    label: "分配权限",
                    key: 2,
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
  const premModalProps = {
    open: openPrem,
    modalProps: {
      onOK: onOKPrem,
      onCancel: onCancelPrem,
      styles: {
        body: { paddingTop: 10 },
      },
      maskClosable: false,
      width: 480,
    },
    editData: {
      role_id: editData.id,
      name: editData.name,
      code: editData.code,
      ...editData.data_scope,
    },
    formRef: formRefPrem,
    onFinish: onFinishPrem,
  };
  const modalProps = {
    open,
    modalProps: {
      onOK,
      onCancel,
      styles: {
        body: { paddingTop: 10 },
      },
      maskClosable: false,
      width: 480,
    },
    editData,
    isEdit,
    formRef,
    title: "角色",
    onFinish,
  };
  const toolbarTitle = (
    <ToolBarTitle
      disabled={disabled}
      onAdd={handdleAdd}
      onEdit={() => handdleEdit(editData)}
      onDel={() => handdleDel(editData)}
      onExport={onExport}
      permissions={{
        add:'sys:role:add',
        edit:'sys:role:edit',
        del:'sys:role:del',
        export:'sys:role:export'
      }}
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
            bordered
            formRef={formRef}
            actionRef={actionRef}
            style={{ position: "relative", zIndex: 0 }}
            columns={columns}
            request={({ current: page, ...params }) => {
              return fetchRoleList({ page, ...params, ...searchValues });
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
      <RoleForm {...modalProps} />
      <PremForm {...premModalProps} />
    </>
  );
}
