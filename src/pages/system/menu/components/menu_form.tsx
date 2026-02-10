/**
 * @Author: colpu
 * @Date: 2023-08-09 23:45:55
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-27 08:36:54
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { BetaSchemaForm } from "@ant-design/pro-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import IconPicker from "@/components/IconPicker";
import { getMenusTree } from "@/api/menus";
import {
  colProps,
  colPropsFull,
  formItemProps,
  formItemPropsFull,
} from "@/constants/form";
import { useAppSelector } from "@/store/hooks";

const DIR_MENU = [0, 1];
const DIR = 0;
const MENU = 1;
const MenuForm = (props: any) => {
  const { title, open, isEdit, editData, onFinish, modalProps, formRef } =
    props;
  const [menuType, setMenuType] = useState(0); // 0布局，1目录，2菜单，3按钮
  const [isLink, setIsLink] = useState(false); // 是否是外链
  const { dict } = useAppSelector((state) => state.dict);
  useEffect(() => {
    const menu_type = editData.menu_type || 0;
    formRef.current?.setFieldsValue({ menu_type, ...editData });
    setMenuType(menu_type);
  }, [editData, formRef]);
  useEffect(() => {
    setIsLink(editData.is_link === 1);
  }, [editData]);
  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    getMenusTree().then((res) => {
      setTreeData(res);
    });
  }, []);

  const setDisabled = useCallback((data: any[], menuType: number) => {
    const loopFn = (data: any[], menuType: number) => {
      data.forEach((item: any) => {
        item.disabled = false;
        // 按钮时，目录不可选
        if (menuType == 2 && item.menu_type === 0) {
          item.disabled = true;
        }
        // 菜单时，菜单不可选
        if (menuType == 1 && item.menu_type === 1) {
          item.disabled = true;
        }
        // 目录时，菜单和按钮不可选
        if (menuType == 0) {
          if ([1, 2].includes(item.menu_type)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        }

        if (item.children) {
          loopFn(item.children, menuType);
        }
      });
      return data;
    };
    return loopFn(data, menuType);
  }, []);

  useEffect(() => {
    setTreeData((prev) =>
      setDisabled(JSON.parse(JSON.stringify(prev)), menuType),
    );
  }, [menuType, setDisabled]);

  // form 表单配置
  const formColumns = useMemo(() => {
    return [
      {
        title: "ID",
        name: "id",
        style: { display: "none" },
        fieldProps: {
          disabled: true,
        },
        colProps: { span: 24, style: { display: "none" } }, // 隐藏掉不占用空间
      },
      {
        title: "菜单类型",
        name: "menu_type",
        valueType: "radio",
        fieldProps: {
          optionType: "button",
          options: dict.menu_type.options,
          onChange: (e: any) => {
            const value = e.target.value;
            formRef.current?.setFieldValue("menu_type", value);
            setMenuType(value);
          },
        },
        formItemProps,
        colProps,
      },
      ...(DIR_MENU.includes(menuType)
        ? [
            {
              title: "Layout布局",
              name: "layout",
              valueType: "select",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  请在顶级目录设置和菜单页设置，其它子目录和菜单页默认继承，子目录和菜单页设后会被嵌套在顶级Layout下
                </div>
              ),
              formItemProps,
              colProps,
              fieldProps: {
                options: dict.layout.options.map((item: any) => ({
                  label: item.label,
                  value: item.code,
                })),
              },
            },
          ]
        : []),
      {
        title: "上级菜单",
        dataIndex: "parent_id",
        valueType: "treeSelect",
        formItemProps: formItemPropsFull,
        colProps: colPropsFull,
        treeData,
        fieldProps: {
          showSearch: true,
          placeholder: "请选择上级菜单",
          fieldNames: {
            label: "title",
            value: "id",
            children: "children",
          },
          treeData,
        },
      },
      {
        title: "菜单名称",
        name: "title",
        colProps,
        formItemProps: {
          ...formItemProps,
          rules: [{ required: true, message: "必须输入菜单名称" }],
        },
      },
      ...(DIR_MENU.includes(menuType)
        ? [
            {
              title: "路由名称",
              name: "name",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  默认不填则和路由地址相同：如地址为：user，则名称为user（注意：为避免名字的冲突，特殊情况下请自定义，保证唯一性）
                </div>
              ),
              colProps,
              formItemProps: {
                ...formItemProps,
                rules: [
                  {
                    required: DIR_MENU.includes(menuType),
                    message: "必须输入路由名称",
                  },
                ],
              },
            },
          ]
        : []),
      ...(MENU == menuType
        ? [
            {
              title: "组件路径",
              name: "lazy",
              formItemProps,
              colProps,
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  访问的组件路径，如：pages/system/index，默认在pages目录
                </div>
              ),
            },
          ]
        : []),
      {
        title: "权限码",
        name: "perm_code",
        tooltip: (
          <div style={{ fontSize: 12 }}>
            控制器中定义的权限字符，如：
            {`hasPermission('system:user:list'))`}
          </div>
        ),
        formItemProps,
        colProps,
      },
      ...(DIR_MENU.includes(menuType)
        ? [
            {
              title: "是否外链",
              valueType: "radio",
              name: "isLink",
              fieldProps: {
                defaultValue: 0,
                options: dict.link_status.options,
                onChange: (evt: any) => {
                  setIsLink(evt.target.value);
                },
              },
              formItemProps,
              colProps,
            },
            {
              title: isLink ? "外链地址" : "路由地址",
              name: "path",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头
                </div>
              ),
              formItemProps: {
                ...formItemProps,
                rules: [
                  {
                    required: true,
                    message: `必须输入${isLink ? "外链地址" : "路由地址"}`,
                  },
                ],
              },
              colProps,
            },
          ]
        : []),
      ...(MENU == menuType
        ? [
            {
              title: "路由参数",
              name: "query",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  访问路由的默认传递参数，如：{`{"id": 1, "name": "ry"}`}
                </div>
              ),
              formItemProps,
              colProps,
            },
          ]
        : []),
      {
        title: "菜单图标",
        name: "icon",
        formItemProps,
        colProps,
        renderFormItem: () => {
          return <IconPicker isCopy={false} />;
        },
      },
      {
        title: "排序",
        name: "sort_order",
        valueType: "digit",
        fieldProps: {
          style: { width: "100%" },
          min: 0,
          max: 1e10,
        },
        formItemProps,
        colProps,
      },
      {
        title: "状态",
        name: "status",
        valueType: "radio",
        fieldProps: {
          defaultValue: 1,
          options: dict.enabled_status.options,
        },
        formItemProps,
        colProps,
      },
      ...(MENU == menuType
        ? [
            {
              title: "显隐菜单",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  是否在侧边栏显示菜单，路由可访问
                </div>
              ),
              name: "hide_in_menu",
              valueType: "radio",
              fieldProps: {
                defaultValue: 1,
                options: dict.hide_status.options,
              },
              formItemProps,
              colProps,
            },
          ]
        : []),

      ...(DIR == menuType
        ? [
            {
              title: "显隐子菜单",
              name: "hide_child_in_menu",
              valueType: "radio",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  是否在侧边栏中显示子菜单，路由可访问
                </div>
              ),
              fieldProps: {
                defaultValue: 1,
                options: dict.show_status.options,
              },
              formItemProps,
              colProps,
            },
          ]
        : []),

      ...(MENU == menuType
        ? [
            {
              title: "显隐标题",
              name: "hide_title",
              valueType: "radio",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  是否隐藏标题，隐藏后页面主体部分将不显示标题
                </div>
              ),
              fieldProps: {
                defaultValue: 0,
                options: dict.hide_status.options,
              },
              formItemProps,
              colProps,
            },
            {
              title: "是否缓存",
              name: "is_cache",
              valueType: "radio",
              tooltip: (
                <div style={{ fontSize: 12 }}>
                  选择是则会被keep-alive缓存，需要匹配组件的name和地址保持一致
                </div>
              ),
              fieldProps: {
                defaultValue: 1,
                options: dict.cache_status.options,
              },
              formItemProps,
              colProps,
            },
          ]
        : []),
      ...(DIR_MENU.includes(menuType)
        ? [
            {
              title: "默认页面",
              name: "index",
              valueType: "radio",
              fieldProps: {
                defaultValue: 0,
                options: dict.whether_status.options,
              },
              formItemProps,
              colProps,
            },
          ]
        : []),
    ].filter(Boolean);
  }, [dict, formRef, isLink, menuType, treeData]);
  return (
    <BetaSchemaForm
      formRef={formRef}
      title={`${isEdit ? "编辑" : "添加"}${title}`}
      colProps={colProps}
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
      columns={formColumns as any}
    />
  );
};

export default MenuForm;
