/*
 * @Author: colpu
 * @Date: 2025-11-15 11:28:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-31 23:14:16
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React, { useState, useMemo, useEffect } from "react";
import { Input, Card, Button, Row, Col, Dropdown, Empty, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as AntdIcons from "@ant-design/icons";
import { dynamicIcon } from "@/utils/public";
import useToken from "antd/es/theme/useToken";

// 图标分类
const iconCategories = {
  all: [],
  direction: [
    "Up",
    "Down",
    "Left",
    "Right",
    "Arrow",
    "Caret",
    "Vertical",
    "Horizontal",
  ],
  suggestion: ["Question", "Exclamation", "Info", "Close", "Check", "Warning"],
  editor: [
    "Edit",
    "Copy",
    "Delete",
    "Add",
    "Minus",
    "Save",
    "Upload",
    "Download",
  ],
  data: ["Table", "Database", "PieChart", "BarChart", "LineChart"],
  brand: ["Github", "Wechat", "Alipay", "Taobao", "Weibo", "Qq"],
  other: [
    "Setting",
    "User",
    "Team",
    "Home",
    "Star",
    "Heart",
    "Like",
    "Message",
  ],
};

// 图标数据
const allIcons = Object.keys(AntdIcons)
  .filter((iconName) => iconName.endsWith("Outlined"))
  .map((iconName) => {
    const displayName = iconName.replace("Outlined", "");
    let category = "other";
    for (const [cat, keywords] of Object.entries(iconCategories)) {
      if (keywords.some((keyword) => displayName.includes(keyword))) {
        category = cat;
        break;
      }
    }
    return {
      name: iconName,
      displayName,
      category,
      component: (AntdIcons as any)[iconName],
    };
  });
interface IconPickerProps {
  style?: any;
  styles?: any;
  copyType?: "text" | "component" | "none";
  onChange?: (value: string, evt: any) => void;
  isCopy?: boolean;
}
const IconPicker: React.FC<IconPickerProps> = (props) => {
  const {
    style = {},
    styles = {},
    onChange,
    copyType = "text",
    isCopy = false,
  } = props || {};
  const [, token] = useToken();

  const [searchText, setSearchText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  // 过滤图标
  const filteredIcons = useMemo(() => {
    if (!searchText) return allIcons;
    return allIcons.filter(
      (icon) =>
        icon.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText]);

  // 按分类分组
  const categorizedIcons = useMemo(() => {
    const categories: Record<string, typeof allIcons> = {};
    filteredIcons.forEach((icon) => {
      if (!categories[icon.category]) {
        categories[icon.category] = [];
      }
      categories[icon.category].push(icon);
      if (!categories["all"]) {
        categories["all"] = [];
      }
      categories["all"].push(icon);
    });

    return categories;
  }, [filteredIcons]);

  // 获取分类名称
  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      all: "全部",
      direction: "方向",
      suggestion: "提示",
      editor: "编辑",
      data: "数据",
      brand: "品牌",
      other: "其他",
    };

    return names[category] || category;
  };

  // 复制图标代码
  const copyIconCode = (iconName: string) => {
    let code = "";
    if (copyType === "component") {
      code = `import { ${iconName} } from '@ant-design/icons';\n\n<${iconName} />`;
    } else {
      code = iconName;
    }
    navigator.clipboard
      .writeText(code)
      .then(() => {
        message.success(`已复制${iconName}`);
      })
      .catch(() => {
        message.error("复制失败");
      });
  };

  const onClick = (iconName: string, _evt: any) => {
    setSelectedIcon(iconName);
    if (isCopy) copyIconCode(iconName);
    if (onChange) onChange(iconName, _evt);
  };

  // 生成图标预览
  const items = Object.entries(iconCategories).map(([category]) => ({
    label: getCategoryName(category),
    key: category,
    children: (
      <>
        {categorizedIcons[category]?.length ? (
          <Row gutter={24}>
            {categorizedIcons[category].map((icon: any) => {
              const IconComponent = icon.component;
              return (
                <Col span={8}>
                  <Button
                    size="small"
                    style={{ padding: "0 3px" }}
                    color="default"
                    variant="text"
                    onClick={(evt) => onClick(icon.name, evt)}
                  >
                    <IconComponent />
                    <span style={{ fontSize: 12 }}>{icon.displayName}</span>
                  </Button>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    ),
  }));

  const [prefixIxon, setPrefixIcon] = useState<React.ReactNode>(
    <SearchOutlined />,
  );
  useEffect(() => {
    if (selectedIcon) {
      const IconCompoment = dynamicIcon(selectedIcon);
      setPrefixIcon(IconCompoment);
    } else {
      setPrefixIcon(<SearchOutlined />);
    }
  }, [selectedIcon]);

  const [activeTabKey, setActiveTabKey] = useState<string>("all");
  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onChangeHanddle = (evt: any) => {
    const value = evt.target.value;
    setSearchText(value);
  };

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomLeft"
      arrow={{ pointAtCenter: false }}
      popupRender={() => (
        <Card
          variant="borderless"
          style={{ width: 540, paddingBottom: 5, ...style }}
          tabProps={{
            tabBarStyle: { padding: 0, height: 40, marginTop: 10 },
          }}
          styles={{
            ...styles,
            header: {
              height: "auto",
              padding: "0 12px",
              ...(styles.header || {}),
            },
            body: {
              height: 200,
              overflowX: "hidden",
              overflowY: "auto",
              padding: "0 12px 0 10px",
              marginTop: 12,
              ...(styles.body || {}),
            },
          }}
          title={
            <Input
              placeholder="搜索图标..."
              prefix={<SearchOutlined style={{ color: "#ddd" }} />}
              value={searchText}
              onChange={onChangeHanddle}
            />
          }
          tabList={items.map((item) => ({ key: item.key, label: item.label }))}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
        >
          {items.filter((item) => item.key === activeTabKey)[0]?.children}
        </Card>
      )}
    >
      <Input
        prefix={prefixIxon}
        value={selectedIcon}
        placeholder="点击选择图标"
        style={{ color: selectedIcon ? token.colorPrimary : "#ddd" }}
        readOnly
      />
    </Dropdown>
  );
};

export default IconPicker;
