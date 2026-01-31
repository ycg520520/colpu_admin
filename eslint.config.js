/**
 * @Author: colpu
 * @Date: 2024-11-04 20:44:03
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-29 21:05:10
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   {
      //     "argsIgnorePattern": "^_",  // 允许以 _ 开头的参数
      //     "varsIgnorePattern": "^_",  // 允许以 _ 开头的变量
      //     "caughtErrorsIgnorePattern": "^_"  // 允许以 _ 开头的错误变量
      //   }
      // ]
    },
  }
);
