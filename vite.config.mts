/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2024-11-04 20:44:03
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-07-11 16:43:37
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
  plugins: [react(), viteMockServe(), vitePluginDynamicImport()],
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
