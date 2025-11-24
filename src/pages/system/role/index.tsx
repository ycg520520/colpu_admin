/*
 * @Author: colpu
 * @Date: 2025-06-12 16:13:46
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-22 18:12:04
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { Card, Modal, Space, Switch } from "antd";
import { useRef, useState } from "react";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProTable,
} from "@ant-design/pro-components";
import useTableColor from "@/hooks/useTableColor";
import { composeColumns } from "@/utils/columns";
import { FULLSCREEN_ICONS, RADIO_STATUS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import RoleForm from "./components/role_form";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import ActionRender from "@/components/ActionRender";
import { apiRole, getRoleList } from "@/api/roles";
export default function RoleList() {
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();

  const fetchRoleList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const { rows, count }: any = await getRoleList(params);
      data = rows || [];
      total = count;
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

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "角色名称",
        key: "name",
        width: 160,
        fixed: "left",
        dataIndex: "name",
      },
      {
        title: "权限标识",
        key: "code",
        width: 100,
        dataIndex: "code",
        search: false,
      },
      {
        title: "角色描述",
        key: "description",
        dataIndex: "description",
        search: false,
      },
      {
        title: "排序",
        width: 80,
        align: "center",
        key: "sort_order",
        dataIndex: "sort_order",
        search: false,
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status",
        search: false,
        width: 60,
        align: "center",
        valueType: "radio",
        fieldProps: {
          options: RADIO_STATUS,
        },
        render: (_dom: React.ReactNode, record: any) => {
          return (
            <Switch
              size="small"
              defaultChecked={record.status}
              disabled={true}
            />
          );
        },
      },
    ],
    {
      searchCreatedAt: true,
      action: {
        render: (_: React.ReactNode, record: any) => {
          return (
            <ActionRender
              values={record}
              onDel={() => handdleDel(record)}
              onEdit={() => handdleEdit(record)}
              menuProps={{
                items: [
                  {
                    label: "分配用户",
                    key: 1,
                  },
                  {
                    label: "角色权限",
                    key: 2,
                  },
                  {
                    label: "部门权限",
                    key: 3,
                  },
                ],
                onClick: (value: any) => {
                  console.log("click", value);
                },
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
              onSelect,
              onChange,
            }}
          />
        </div>
      </Space>
      <RoleForm {...modalProps} />
    </>
  );
}
