/*
 * @Author: colpu
 * @Date: 2025-06-18 17:10:52
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-06-25 09:14:05
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import React from "react";
type LoadingProps = {
  fullScreen?: boolean | true; // 是否全屏加载
};
const Loading: React.FC = (prop: LoadingProps) => {
  return (
    <div className="loading-container" {...prop}>
      <div className="loading-spinner"></div>
      <p>Loading...</p>
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #000;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
