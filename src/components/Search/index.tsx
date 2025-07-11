/*
 * @Author: colpu
 * @Date: 2025-06-21 10:35:41
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-25 12:10:57
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */

import { Input, theme } from "antd";
import { SearchOutlined, PlusCircleFilled } from "@ant-design/icons";
import "./style.scss";
const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      className="search-wrap"
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover,
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextDescription,
            }}
          />
        }
        placeholder="搜索方案"
        variant="borderless"
      />
      <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24,
        }}
      />
    </div>
  );
};
export default SearchInput;
