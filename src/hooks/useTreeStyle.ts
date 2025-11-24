import { useEmotionCss } from "@ant-design/use-emotion-css";

/*
 * @Author: colpu
 * @Date: 2025-11-23 16:16:48
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 00:57:09
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
export const useTreeStyle = () => {
  return useEmotionCss(() => ({
    "&.ant-tree": {
      borderRadius: 0,
      ".ant-tree-treenode": {
        marginBottom: 0,
      },
      ".ant-tree-node-content-wrapper:hover": {
        backgroundColor: "unset",
      },
      ".ant-tree-treenode:hover": {
        backgroundColor: "rgba(0,0,0,0.04)",
      },
      ".ant-tree-switcher:not(.ant-tree-switcher-noop):hover:before": {
        backgroundColor: "unset",
      },
      ".ant-tree-treenode-selected": {
        backgroundColor: "#e6f4ff",
      },
      ".ant-tree-node-content-wrapper.ant-tree-node-selected": {
        backgroundColor: "unset",
      },
    },
  }));
};
