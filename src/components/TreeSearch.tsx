/*
 * @Author: colpu
 * @Date: 2025-11-23 16:44:31
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 12:59:02
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Empty, Input, Tree } from "antd";
import type { InputRef, TreeProps } from "antd";
import { filterTree, treeToPlan } from "@/utils";
import debounce from "lodash/debounce";
import { SearchProps } from "antd/es/input";
const { Search } = Input;
type TreeSearchProps = {
  treeProps: TreeProps;
  searchProps?: SearchProps;
  style?: React.CSSProperties;
  showSearch?: boolean;
};

// 处理筛选出来的节点
function predicateFilter(item: any, keyword: string, titleKey = "title") {
  const strTitle = item[titleKey] || "";
  const index = strTitle.indexOf(keyword);
  const beforeStr = strTitle.substring(0, index);
  const afterStr = strTitle.slice(index + keyword.length);
  // 处理筛选出来的节点显示方式
  const title =
    index > -1 ? (
      <span>
        {beforeStr}
        <strong style={{ color: "red", fontWeight: "bold" }}>{keyword}</strong>
        {afterStr}
      </span>
    ) : (
      strTitle
    );
  item[titleKey] = title;
  // 这里返回true，表示该节点需要显示, 如果全部返回true，则表示全部显示，再之前可以对复合条件的数据进行处理高亮显示
  return index > -1;
  // return true;
}

export interface TreeSearchRef {
  clear: () => void;
}
const TreeSearch = forwardRef<TreeSearchRef, TreeSearchProps>((props, ref) => {
  const { treeProps, style, searchProps = {}, showSearch = true } = props || {};
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState<any[]>([]);
  const onExpand = (newExpandedKeys: React.Key[]) => {
    console.log("onExpand");
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const changeTreeData = useCallback(
    (value: string) => {
      let data = treeProps.treeData || [];
      if (data.length) {
        const keyword = value.trim();
        if (keyword !== "") {
          data = filterTree(data, (item: any) =>
            predicateFilter(item, keyword, treeProps.fieldNames?.title)
          );
        }
        const allKey = treeToPlan(data).map((item: any) => item.id);
        setExpandedKeys(allKey);
        setTreeData(data);
      }
      setAutoExpandParent(true);
    },
    [treeProps.treeData, treeProps.fieldNames?.title]
  );
  const debounceChange = debounce(
    (value: string) => changeTreeData(value),
    500
  );
  const onChangeSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    if (searchProps?.onChange) {
      searchProps.onChange!(evt);
    }
    setSearchValue(value);
    debounceChange(value);
  };

  useEffect(() => {
    changeTreeData("");
  }, [changeTreeData]);

  const searchRef = useRef<InputRef>(null);
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clear: (): void => {
      setSearchValue("");
      changeTreeData("");
    },
    focus: () => {
      searchRef.current?.focus();
    },
  }));
  const composeSearchProps: any = {
    ref: searchRef,
    style: { marginBottom: 8 },
    placeholder: "请输入关键词",
    allowClear: true,
    size: "middle",
    ...searchProps,
    onChange: onChangeSearch,
  };
  return (
    <div style={style}>
      {showSearch ? (
        <Search {...composeSearchProps} value={searchValue} />
      ) : null}
      {treeData.length ? (
        <Tree
          {...{
            onExpand,
            expandedKeys,
            autoExpandParent,
            ...treeProps,
            treeData,
          }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂未搜索到相关数据"
        />
      )}
    </div>
  );
});

TreeSearch.displayName = "TreeSearch";
export default TreeSearch;
