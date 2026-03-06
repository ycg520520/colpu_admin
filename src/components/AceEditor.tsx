/*
 * @Author: colpu
 * @Date: 2026-03-05 14:05:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-05 14:44:49
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import React, { Suspense, useEffect, useState } from "react";
const AceEditor = React.lazy(() => import("react-ace"));
export default function DyAceEditor(props: any) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const loadMode = async () => {
      try {
        // await import("ace-builds/src-noconflict/snippets/javascript");
        // await import("ace-builds/src-noconflict/snippets/typescript");
        await import("react-ace");
        await import("ace-builds/src-noconflict/theme-monokai");
        await import("ace-builds/src-noconflict/theme-github");
        await import("ace-builds/src-noconflict/mode-json");
        await import(`ace-builds/src-noconflict/mode-javascript`);
        await import("ace-builds/src-noconflict/ext-language_tools");
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load ace modes:", err);
      }
    };

    loadMode();
  }, [props.language]);

  if (!isReady) return <div>加载语言资源中...</div>;
  return (
    <Suspense fallback={<div>加载编辑器组件...</div>}>
      <AceEditor {...props} />
    </Suspense>
  );
}
