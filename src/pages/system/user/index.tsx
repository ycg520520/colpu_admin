/*
 * @Author: colpu
 * @Date: 2025-11-16 23:07:18
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-04 14:58:59
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { apiUser, getUserList } from "@/api/user";
import { Card, Divider, Modal, Space, Splitter, TreeProps } from "antd";
import { useRef, useState } from "react";
import "@/assets/styles/table.scss";
import {
  ActionType,
  BetaSchemaForm,
  ProFormColumnsType,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import UserForm from "./components/user_form";
import { composeColumns } from "@/utils/columns";
import useProTableFullscreen from "@/hooks/useProTableFullscreen";
import useFormModal from "@/hooks/useFormModal";
import { FULLSCREEN_ICONS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import { useTreeStyle } from "@/hooks/useTreeStyle";
import TreeSearch, { TreeSearchRef } from "@/components/TreeSearch";
import { filterValues } from "@/utils";
import ModifyPassword from "@/components/ModifyPassword";
import { renderStatus } from "@/constants/public";
import { useAppSelector } from "@/store/hooks";
import { cloneDeep } from "lodash";
import { hasPermissions } from "@/utils/permissions";
import { PermissionButton } from "@/components/Permission";

export default function UserList() {
  const { user } = useAppSelector((state) => state.user);
  const { permissions = [] } = user || {};
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const {
    open: openModify,
    onOK: onOKModify,
    onCancel: onCancelModify,
  } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const formSearchRef = useRef<ProFormInstance>(null);
  const treeStyles = useTreeStyle();
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const treeRef = useRef<TreeSearchRef>(null); // 树形控件ref
  const { dict } = useAppSelector((state) => state.dict);
  const treeData = useAppSelector((state) => state.dept.treeData);
  const onSelectTree: TreeProps["onSelect"] = (keys: any[]) => {
    handdleSearch({
      dept_id: keys.join(","),
    });
    setSelectedKeys(keys);
  };

  const treeProps = {
    style: { minWidth: 200 },
    treeProps: {
      className: treeStyles,
      treeData: cloneDeep(treeData),
      fieldNames: {
        title: "name",
        key: "id",
        children: "children",
      },
      style: { margin: 0 },
      blockNode: true,
      defaultExpandAll: true,
      selectedKeys,
      onSelect: onSelectTree,
    },
  };

  const fetchUserList = async (params: any) => {
    let data = [];
    let total = 0;
    try {
      const res: any = (await getUserList(params)) || {};
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
    setEditData({});
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
        apiUser({ id }, "delete").then(async () => {
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
    await apiUser(values, isEdit ? "put" : "post");
    actionRef.current?.reset!();
    onCancel();
  };

  // 表头配置
  const columns = composeColumns(
    [
      {
        title: "用户名称",
        width: 100,
        dataIndex: "username",
        ellipsis: true,
        fieldProps: {
          style: { width: "100%" },
        },
      },
      {
        title: "用户昵称",
        width: 160,
        dataIndex: "nickname",
        search: false,
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 60,
        align: "center",
        valueType: "radio",
        fieldProps: {
          options: dict.enabled_status.options, // 状态字典
        },
        render: renderStatus(),
      },
    ],
    {
      showRemark: false,
      order: { fixed: false },
      action: {
        width: 120,
        fixed: false,
        render: (_: any, record: any) => {
          return (
            <>
              <ActionRender
                disableds={{
                  edit: !!record.editable,
                  del: !!record.editable,
                  dropdown: !!record.editable,
                }}
                permissions={{
                  edit: "sys:user:edit",
                  del: "sys:user:del",
                }}
                onDel={() => handdleDel(record)}
                onEdit={() => handdleEdit(record)}
                menuProps={{
                  style: { minWidth: 120 },
                  items: [
                    {
                      label: "重置密码",
                      key: 1,
                      disabled: !hasPermissions(
                        permissions,
                        "sys:user:resetpwd"
                      ),
                    },
                  ],
                  onClick: ({ key }: any) => {
                    if (key == 1) {
                      setEditData({ ...record });
                      onOKModify();
                    }
                  },
                }}
              ></ActionRender>
            </>
          );
        },
      },
    }
  );

  // 搜索表单配置
  const formColumns = columns.filter((item) => item.search !== false);

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
    },
    editData,
    isEdit,
    formRef,
    title: "用户",
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
        add: "sys:user:add",
        edit: "sys:user:edit",
        del: "sys:user:del",
        export: "sys:user:export",
      }}
    />
  );
  const [searchValues, setSearchValues] = useState({});
  const handdleSearch = (values = {}, isRest = false) => {
    const searchValue = filterValues(formSearchRef.current?.getFieldsValue());
    setSearchValues((prev) => {
      return isRest ? values : { ...prev, ...searchValue, ...values };
    });
    if (isRest) {
      setSelectedKeys([]);
      treeRef.current?.clear();
    }
    actionRef.current?.reload();
  };

  const cancelModify = () => {
    setEditData({});
    formRef.current?.resetFields();
    onCancelModify();
  };

  return (
    <Card style={{ border: "none" }}>
      <Splitter style={{ height: "100%" }}>
        <Splitter.Panel defaultSize="20%" max="20%">
          <div style={{ minWidth: 100, marginRight: 16 }}>
            <TreeSearch ref={treeRef} {...treeProps} />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <Space size={10} direction="vertical" style={{ display: "flex" }}>
            {/* 自定义搜索表单，解决ProTable自带搜索表单搜索布局不能满足所需 */}
            <BetaSchemaForm
              formRef={formSearchRef}
              style={{ margin: "0 24px" }}
              layout="inline"
              onReset={() => handdleSearch({}, true)}
              onFinish={handdleSearch}
              submitter={{
                render: (props) => {
                  const { form } = props;
                  return (
                    <Space>
                      <PermissionButton
                        buttonProps={{
                          type: "primary",
                          onClick: () => {
                            form?.submit();
                          },
                        }}
                        permission="sys:user:query"
                        children="搜索"
                      />
                      <PermissionButton
                        buttonProps={{
                          onClick: () => {
                            form?.resetFields();
                          },
                        }}
                        permission="sys:user:query"
                        children="重置"
                      />
                      {/* {defaultDoms[0]} */}
                    </Space>
                  );
                },
              }}
              columns={formColumns as ProFormColumnsType[]}
            />
            <Divider size="small" />
            <ProTable
              className={tableStyles}
              bordered
              formRef={formRef}
              actionRef={actionRef}
              style={{ position: "relative", zIndex: 0, width: "100%" }}
              columns={columns}
              request={({ current: page, ...params }) => {
                return fetchUserList({ page, ...params, ...searchValues });
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
          </Space>
        </Splitter.Panel>
      </Splitter>
      <UserForm {...modalProps} />
      <Modal
        title="修改密码"
        open={openModify}
        onOk={onOKModify}
        onCancel={cancelModify}
        width={348}
        maskClosable={false}
        footer={null}
      >
        <ModifyPassword
          dataSource={editData}
          style={{ width: 300, marginTop: 20 }}
          onSubmit={cancelModify}
        />
      </Modal>
    </Card>
  );
}
