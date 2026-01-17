/*
 * @Author: colpu
 * @Date: 2025-12-04 08:53:02
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-07 23:50:03
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useAppSelector } from "@/store/hooks";
import { apiRoleSelect } from "@/api/roles";
import { apiUserSearch } from "@/api/user";
import { debounce } from "lodash";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { apiPermissionUsers } from "@/api/permission";
import { useQuery } from "@tanstack/react-query";

const GivePermForm = (props: any) => {
  const {
    title,
    open,
    isEdit,
    editData,
    onFinish,
    modalProps,
    formRef,
    isRole,
  } = props;
  const { dict } = useAppSelector((state) => state.dict);
  const [roleOptions, setRoleOptions] = useState<any>([]);
  const [userOptions, setUserOptions] = useState<any>([]);
  // 解决多次请求问题
  const { data: initUserOptions, isLoading } = useQuery({
    queryKey: [
      "apiPermissionUsers",
      { user_ids: editData.user_ids, perm_id: editData.id },
    ],
    queryFn: () => apiPermissionUsers({ perm_id: editData.id }),
    enabled: !!editData.id && !isRole,
  });

  useEffect(() => {
    if (!isLoading && initUserOptions) {
      setUserOptions(initUserOptions);
    }
  }, [isLoading, initUserOptions]);

  useEffect(() => {
    formRef.current.setFieldsValue({ ...editData });
  }, [editData, formRef]);
  useEffect(() => {
    apiRoleSelect().then((data) => {
      setRoleOptions(data);
    });
  }, []);
  const debounceSearchUser = useMemo(() => {
    const fetchUserSeach = async (value: string) => {
      if (!value) return;
      setUserOptions([]);
      return apiUserSearch({ keyword: value }).then(setUserOptions);
    };
    return debounce(fetchUserSeach, 600);
  }, []);

  const formColumns = [
    {
      title: "ID",
      dataIndex: "id",
      style: { display: "none" },
      fieldProps: {
        disabled: true,
      },
      colProps: { style: { display: "none" } }, // 隐藏掉不占用空间
    },
    {
      title: "权限类型",
      dataIndex: "type",
      valueType: "select",
      colProps,
      formItemProps,
      fieldProps: {
        disabled: true,
        options: dict.perm_type.options.map((item: any) => {
          return {
            label: item.label,
            value: item.code,
          };
        }),
      },
    },
    {
      title: "权限名称",
      dataIndex: "name",
      colProps,
      formItemProps,
      fieldProps: {
        disabled: true,
      },
    },
    isRole
      ? {
          title: "分配角色",
          dataIndex: "role_ids",
          valueType: "select",
          colProps: colPropsFull,
          formItemProps: formItemPropsFull,
          fieldProps: {
            mode: "multiple",
            maxCount: 5,
            maxTagCount: 3,
            showSearch: true,
            options: roleOptions,
          },
        }
      : undefined,
    !isRole
      ? {
          title: "分配用户",
          dataIndex: "user_ids",
          valueType: "select",
          tooltip: (
            <div style={{ fontSize: 12 }}>
              给用户单独制定权限，在不分配角色的情况下生效，如果角色中已经分配了此权限，两权限会合并为一。
            </div>
          ),
          colProps: colPropsFull,
          formItemProps: formItemPropsFull,
          fieldProps: {
            mode: "multiple",
            maxTagCount: 3,
            placeholder: "请输入用户名电话邮箱搜索",
            options: userOptions,
            showSearch: true,
            onSearch: debounceSearchUser,
          },
        }
      : undefined,
  ].filter((item) => item !== undefined);

  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "修改" : "分配"}${title}`}
      grid
      layout="horizontal"
      shouldUpdate={(newValues, oldValues) => {
        return newValues !== oldValues;
      }}
      modalProps={{
        width: 520,
        destroyOnHidden: true,
        forceRender: true,
        ...modalProps,
        onCancel: () => {
          formRef.current?.resetFields();
          modalProps.onCancel();
        },
      }}
      open={open}
      layoutType="ModalForm"
      onReset={() => {
        console.log("reset");
      }}
      onFinish={async (values) => {
        await onFinish(values);
        message.success("提交成功");
        return true;
      }}
      columns={formColumns}
    />
  );
};

export default GivePermForm;
