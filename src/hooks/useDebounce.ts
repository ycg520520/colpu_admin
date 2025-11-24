/*
 * @Author: colpu
 * @Date: 2025-11-10 14:34:07
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-10 14:59:53
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useCallback, useRef } from "react";
import debounce from "lodash/debounce";

// 自定义防抖验证 Hook
export function useDebouncedValidation() {
  const validationRefs = useRef(new Map());

  const createDebouncedValidator = useCallback(
    (fieldName: string, validateFn: (arg0: any) => any, delay = 500) => {
      // 如果已存在验证器，先取消
      if (validationRefs.current.has(fieldName)) {
        validationRefs.current.get(fieldName).cancel();
      }
      const debouncedValidator = debounce(async (value, resolve, reject) => {
        try {
          await validateFn(value);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, delay);

      validationRefs.current.set(fieldName, debouncedValidator);
      return debouncedValidator;
    },
    []
  );

  const debouncedValidator = useCallback(
    (fieldName: string, validateFn: (arg0: any) => any, delay = 500) => {
      return (_: any, value: any) => {
        return new Promise<void>((resolve, reject) => {
          if (!value) {
            return resolve();
          }
          const validator = createDebouncedValidator(
            fieldName,
            validateFn,
            delay
          );

          validator(value, resolve, reject);
        });
      };
    },
    [createDebouncedValidator]
  );

  // 清理函数
  const debounceClean = useCallback(() => {
    validationRefs.current.forEach((validator) => {
      validator.cancel();
    });
    validationRefs.current.clear();
  }, []);

  return {
    debouncedValidator,
    debounceClean,
  };
}

// // 使用示例
// function FormWithDebouncedHook() {
//   const { debouncedValidator } = useDebouncedValidation();

//   // 验证函数
//   const validateUsername = async (username) => {
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     if (username.length < 3) {
//       throw new Error("用户名至少3个字符");
//     }

//     if (username.length > 20) {
//       throw new Error("用户名不能超过20个字符");
//     }

//     if (["admin", "test"].includes(username)) {
//       throw new Error("该用户名已被使用");
//     }
//   };

//   const validateEmail = async (email) => {
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       throw new Error("请输入有效的邮箱地址");
//     }
//   };

//   const columns = [
//     {
//       title: "用户名",
//       dataIndex: "username",
//       valueType: "text",
//       formItemProps: {
//         rules: [
//           { required: true, message: "请输入用户名" },
//           {
//             validator: debouncedValidator("username", validateUsername, 600),
//           },
//         ],
//       },
//     },
//     {
//       title: "邮箱",
//       dataIndex: "email",
//       valueType: "text",
//       formItemProps: {
//         rules: [
//           {
//             validator: debouncedValidator("email", validateEmail, 600),
//           },
//         ],
//       },
//     },
//   ];

//   return (
//     <BetaSchemaForm
//       layoutType="ModalForm"
//       columns={columns}
//       onFinish={async (values) => {
//         console.log("表单数据:", values);
//         return true;
//       }}
//     />
//   );
// }
