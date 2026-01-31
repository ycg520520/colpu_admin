/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { formItemCol } from "@/constants/form";
import TreeExtend from "@/components/TreeExtend";
import { getPermissionGroup } from "@/api/permission";
import { message } from "antd";
const PremForm = (props: any) => {
  const { open, editData, onFinish, modalProps, formRef } = props;
  const [treeData, setTreeData] = useState([]);
  const fetchPermssionGroup = async () => {
    getPermissionGroup().then((data: any) => setTreeData(data));
  };

  useEffect(() => {
    formRef.current?.setFieldsValue(editData);
  }, [editData, formRef]);
  useEffect(() => {
    fetchPermssionGroup();
  }, []);

  const formColumns = [
    {
      title: "ID",
      dataIndex: "role_id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      formItemProps: formItemCol(6),
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "角色名称",
      dataIndex: "name",
      fieldProps: {
        disabled: true,
      },
      formItemProps: formItemCol(6),
    },
    {
      title: "角色编码",
      dataIndex: "code",
      fieldProps: {
        disabled: true,
      },
      formItemProps: formItemCol(6),
    },
    {
      title: "分配权限",
      dataIndex: "perm_ids",
      valueType: "treeSelect",
      fieldProps: {
        showSearch: true,
      },
      formItemProps: formItemCol(6),
      renderFormItem: () => {
        return (
          <TreeExtend
            initCheckboxValue={[0, 2]}
            treeProps={{
              treeData,
            }}
          />
        );
      },
    },
  ];

  return (
    <BetaSchemaForm
      formRef={formRef}
      title="数据权限分配"
      grid
      layout="horizontal"
      shouldUpdate={(newValues, oldValues) => {
        return newValues !== oldValues;
      }}
      modalProps={{
        width: 640,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel: async () => {
          formRef.current?.resetFields();
          modalProps.onCancel();
        },
      }}
      open={open}
      layoutType="ModalForm"
      onReset={() => {
        console.log("reset");
      }}
      onFinish={async () => {
        const values = formRef.current?.getFieldsValue(null);
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={formColumns.filter((item) => !!item)}
    />
  );
};

export default PremForm;
