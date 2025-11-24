/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2024-11-04 20:44:03
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-01 21:14:27
 *
 * Copyright (c) 2025 by error: git config user.name & please set dead value or install git, All Rights Reserved.
 */
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
import vitePluginDynamicImport from "vite-plugin-dynamic-import";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
    // viteMockServe({
    //   mockPath: "./mock/router",
    //   logger: true,
    // }),
  ],
  build: {
    outDir: "dist", // 指定输出目录
    emptyOutDir: true, // 打包前清空输出目录
    sourcemap: true, // 生成 sourcemap
    minify: "terser", // 代码压缩工具，可选 'terser' 或 'esbuild'
    chunkSizeWarningLimit: 1000, // 调整块大小警告限制 (KB)
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        manualChunks: (id: string) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("src/pages") && !id.includes("/components")) {
            const page = id.split("pages/")[1].split("/");
            return page
              .join("-")
              .replace("-index", "")
              .replace(/\.(t|j)sx/, "");
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0", // 允许所有IP访问，包括localhost和127.0.0.1
    proxy: {
      // 代理配置 - 优先走代理
      "/api": {
        target: "http://localhost:8610",
        changeOrigin: true,
        configure: (proxy, _options) => {
          // 代理请求前的钩子
          proxy.on("proxyReq", (_proxyReq: any, _req: any, _res) => {
            // 添加必要的 CORS 头
            // console.log(`[PROXY] 代理请求: ${req.method} ${req.url}`);
          });
          // 代理响应处理
          // proxy.on("proxyRes", (proxyRes, req, res) => {
          //   console.log(
          //     `[PROXY] 代理响应: ${proxyRes.statusCode} ${req.url}`,
          //     res.statusCode
          //   );
          // });
        },
      },
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
    ],
  },
});
