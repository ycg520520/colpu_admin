/*
 * @Author: colpu
 * @Date: 2026-03-05 22:08:22
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-06 11:41:38
 *
 * Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import path from "path";
import vitePluginDynamicImport from "vite-plugin-dynamic-import";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
const PAGES_DIR = `/src/pages`;
const NODE_MODULES = `/node_modules`;
const chunksName = (
  chunks: Record<string, RegExp>,
  target: string,
): string | null => {
  const keys = Object.keys(chunks);
  const values = Object.values(chunks);
  let name: string | null = null;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let reg = values[i];
    if (reg.test(target)) {
      name = key;
      break;
    }
  }
  return name;
};
const splitChunks = {
  react: /^\/(react|react-dom|scheduler|react-is|react-router-dom)\//, // react相关
  redux: /^\/(@reduxjs|react-redux)\//, // redux相关
  ali_oss: /^\/(ali-oss)\//, // 阿里云oss
  utils: /^\/(lodash|lodash-es|dayjs|axios)\//, // 工具类
  tinymce: /^\/(tinymce)\//, // 富文本
  ace: /^\/(react-ace|ace-builds)\//, // 富文本
  antd: /^\/(antd|@ant-design|\@?rc-[^/]+|@babel|resize-observer-polyfill|safe-stable-stringify|classnames)\//, // antd相关
};

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    vitePluginDynamicImport(),
    // 压缩文件
    compression({ algorithm: "gzip", ext: ".gz" }),
    // viteMockServe({
    //   mockPath: "./mock/router",
    //   logger: true,
    // }),
    visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    outDir: "dist", // 指定输出目录
    emptyOutDir: true, // 打包前清空输出目录
    sourcemap: false, // 生成 sourcemap
    target: "es2015", // 指定 ES 模块化规范
    minify: "esbuild", // 代码压缩工具，可选 'terser' 或 'esbuild'
    chunkSizeWarningLimit: 500, // 调整块大小警告限制 (KB)
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        // 1. 定义手动分块逻辑
        manualChunks(id) {
          // 将路径转换为 POSIX 风格，防止 Windows 下反斜杠问题
          const normalizedId = id.replace(/\\/g, "/");
          // 匹配 src/pages 目录下的页面文件
          if (normalizedId.includes(PAGES_DIR)) {
            // 提取 pages 后面的路径部分
            const pagesPath = normalizedId.split(PAGES_DIR).pop() || "";
            // 排除pages页面下的组件
            if (!pagesPath.includes("/components")) {
              const page = pagesPath
                .replace(/^\//, "")
                .replace(/\/index/, "") // 删除 /index，可以将文件夹内只有一个index文件的文件名转为文件夹名
                .replace(/\.(t|j)sx?$/, "");
              return `pages/${page}`;
            }
          }
          if (normalizedId.includes(NODE_MODULES)) {
            const chunkPath = normalizedId.split(NODE_MODULES).pop() || "";
            const chunk = chunksName(splitChunks, chunkPath);
            if (chunk) {
              return chunk;
            }
            return "vendors";
          }
          return undefined;
        },
        chunkFileNames: ({ name }) => {
          if (name.includes("pages/")) {
            return `${name}-[hash].js`;
          }
          return `assets/js/${name}-[hash].js`;
        },
      },
    },
  },
  server: {
    host: "0.0.0.0", // 允许所有IP访问，包括localhost和127.0.0.1
    proxy: {
      // 代理配置 - 优先走代理
      // "/api": {
      //   target: "http://localhost:8610",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, "/api/"),
      //   configure: (proxy, _options) => {
      //     // 代理请求前的钩子
      //     proxy.on("proxyReq", (_proxyReq: any, _req: any, _res) => {
      //       // 添加必要的 CORS 头
      //       // console.log(`[PROXY] 代理请求: ${req.method} ${req.url}`);
      //     });
      //     // 代理响应处理
      //     // proxy.on("proxyRes", (proxyRes, req, res) => {
      //     //   console.log(
      //     //     `[PROXY] 代理响应: ${proxyRes.statusCode} ${req.url}`,
      //     //     res.statusCode
      //     //   );
      //     // });
      //   },
      // },
      "/oss": {
        target: "https://foindia.oss-cn-hangzhou.aliyuncs.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oss/, ""),
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "antd",
      "@ant-design",
      "lodash",
    ],
  },
});
