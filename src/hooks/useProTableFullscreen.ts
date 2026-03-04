/*
 * @Author: colpu
 * @Date: 2025-11-08 21:12:34
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-09 19:03:13
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";

export default function useProTableFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [msg] = message.useMessage();
  const isUnmounted = useRef(false); // 添加一个引用来跟踪组件是否已卸载

  // 检查全屏状态
  const checkFullscreen = useCallback(() => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }, []);

  // 监听全屏状态变化
  useEffect(() => {
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    const handleFullscreenChange = () => {
      console.log("0000");
      const fullscreen = checkFullscreen();
      setIsFullscreen(fullscreen);

      // 状态变化时的回调
      if (fullscreen) {
        document.body.style.overflow = "hidden";
        msg.success("已进入全屏模式");
      } else {
        document.body.style.overflow = "auto";
        msg.info("已退出全屏模式");
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    // 初始检查
    setIsFullscreen(checkFullscreen());

    return () => {
      isUnmounted.current = true;
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [checkFullscreen, msg]);

  return {
    isFullscreen,
  };
}
