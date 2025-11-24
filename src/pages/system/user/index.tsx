/*
 * @Author: colpu
 * @Date: 2025-11-16 23:07:18
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 08:55:24
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { apiUser, getUserList } from "@/api/user";
import { Card, Divider, Modal, Space, Splitter, Switch, TreeProps } from "antd";
import { useEffect, useRef, useState } from "react";
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
import { FULLSCREEN_ICONS, RADIO_STATUS } from "@/constants";
import ToolBarTitle from "@/components/ToolBarTitle";
import useTableColor from "@/hooks/useTableColor";
import ActionRender from "@/components/ActionRender";
import { getDepartmentTree } from "@/api/departments";
import { useTreeStyle } from "@/hooks/useTreeStyle";
import TreeSearch, { TreeSearchRef } from "@/components/TreeSearch";
import { filterValues } from "@/utils";

export default function UserList() {
  const [disabled, setDisabled] = useState(true);
  const { open, onOK, onCancel, formRef } = useFormModal();
  const { isFullscreen } = useProTableFullscreen();
  const [editData, setEditData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType | null>(null);
  const { tableStyles, rowClassName } = useTableColor();
  const formSearchRef = useRef<ProFormInstance>();

  const treeStyles = useTreeStyle();
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const treeRef = useRef<TreeSearchRef>(null); // 树形控件ref
  useEffect(() => {
    getDepartmentTree().then((res) => {
      setTreeData(res);
    });
  }, []);
  const onSelectTree: TreeProps["onSelect"] = (keys: any[]) => {
    if (keys.length) {
      handdleSearch({
        dept: keys.join(","),
      });
    }
    setSelectedKeys(keys);
  };
  const treeProps = {
    style: { minWidth: 200 },
    treeProps: {
      className: treeStyles,
      treeData,
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
      const { rows }: any = await getUserList(params);
      data = rows || [];
      total = data.length;
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
    console.log(selectedRows.length);
    if (selectedRows.length === 1) {
      console.log(selectedRows[0]);
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
        key: "username",
        width: 160,
        fixed: "left",
        dataIndex: "username",
        formItemProps: {
          style: { width: 300 },
        },
        fieldProps: {
          style: { width: "100%" },
        },
      },
      {
        title: "用户昵称",
        key: "nickname",
        width: 160,
        dataIndex: "nickname",
        search: false,
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status",
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
      showRemark: true,
      action: {
        render: (_: any, record: any) => {
          return (
            <ActionRender
              values={record}
              onDel={() => handdleDel(record)}
              onEdit={() => handdleEdit(record)}
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

  return (
    <Card style={{ border: "none" }}>
      <Splitter style={{ height: "100%" }}>
        <Splitter.Panel defaultSize="20%" max="30%">
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
                searchConfig: {
                  submitText: "搜索",
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
              style={{ position: "relative", zIndex: 0 }}
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
                onSelect,
                onChange,
              }}
            />
          </Space>
        </Splitter.Panel>
      </Splitter>
      <UserForm {...modalProps} />
    </Card>
  );
}
