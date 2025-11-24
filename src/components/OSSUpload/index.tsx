/*
 * @Author: colpu
 * @Date: 2025-10-31 20:11:31
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-24 15:24:35
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useRef, useState } from "react";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Progress, Upload, UploadFile, App } from "antd";
import upload from "./upload";

const AvatarButton = ({ file }: any) => {
  const status = file && file.status;
  if (status === "done" && file.response) {
    return (
      <img
        draggable={false}
        src={file.response.url}
        alt="avatar"
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />
    );
  }
  return (
    <div>
      {status === "uploading" ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ fontSize: 12 }}>
        上传{status === "uploading" ? "中…" : ""}
      </div>
    </div>
  );
};
const OSSUpload = (props: any) => {
  const {
    fileList = [],
    onChange,
    maxCount = 1,
    isAvatar = false, // 是否是头像上传
    listType = "picture-card",
    returnType = "url",
  } = props;
  const [uploadFileList, setUploadFileList] = useState<any[]>([...fileList]);
  const [uploadProgress, setUploadProgress] = useState<any>({});
  const uploadRef = useRef();
  const [newMaxCount] = useState(isAvatar ? 1 : maxCount);
  const { message } = App.useApp();

  // 使用分片上传显示进度
  const customRequest = async (options: any) => {
    const { file, onProgress, onSuccess, onError } = options;
    try {
      const response = await upload({
        ...options,
        onProgress(percent: any) {
          // 更新进度
          setUploadProgress((prev: any) => ({
            ...prev,
            [file.uid]: percent,
          }));
          if (onProgress) {
            onProgress({ percent });
          }
        },
      });

      // 上传成功
      const fileUrl = response.src;
      const newFile = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        originFileObj: file,
        percent: 100,
        size: file.size,
        status: "done",
        type: file.type,
        uid: file.uid,
        url: fileUrl,
        thumbUrl: fileUrl,
        response,
      };

      // 清理进度
      setUploadProgress((prev: any) => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });

      // 更新文件列表
      const newFileList =
        newMaxCount === 1 ? [newFile] : [...uploadFileList, newFile];
      setUploadFileList(newFileList);
      if (onChange) {
        const res: any = returnFilesHanddle(newFileList, returnType);
        onChange(res);
      }

      onSuccess(response, file);
      message.success("上传成功");
    } catch (error) {
      console.error("上传失败:", error);
      setUploadProgress((prev: any) => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });
      message.error("上传失败");
      onError(error);
    }
  };

  // 自定义列表项渲染
  const itemRender = (
    originNode: any,
    file: any,
    _fileList: any[],
    actions: any
  ) => {
    const progress = uploadProgress[file.uid];
    if (progress !== undefined && file.status === "uploading") {
      return (
        <div style={{ padding: "8px 0" }}>
          <div style={{ marginBottom: 4 }}>
            {file.name} - 上传中 {progress}%
          </div>
          <Progress
            percent={progress}
            size="small"
            status={progress === 100 ? "success" : "active"}
          />
          <Button
            type="link"
            size="small"
            onClick={actions.remove}
            style={{ padding: 0, height: "auto" }}
          >
            取消
          </Button>
        </div>
      );
    }

    return originNode;
  };

  // 根据 returnType 返回不同的值
  const returnFilesHanddle = (
    fileList: UploadFile<any>[],
    returnType: "url" | "object" | "file" | "fileList"
  ) => {
    switch (returnType) {
      case "url":
        if (maxCount === 1) {
          return fileList[0]?.url || fileList[0]?.response?.url || "";
        } else {
          return fileList
            .filter((file) => file.status === "done")
            .map((file) => file.url || file.response?.url)
            .filter(Boolean);
        }
      case "object":
        if (maxCount === 1) {
          const file = fileList[0];
          return file
            ? {
                uid: file.uid,
                name: file.name,
                url: file.url || file.response?.url,
                size: file.size,
                type: file.type,
              }
            : null;
        } else {
          return fileList.map((file) => ({
            uid: file.uid,
            name: file.name,
            url: file.url || file.response?.url,
            size: file.size,
            type: file.type,
          }));
        }
      case "file":
        if (maxCount === 1) {
          return fileList[0] || null;
        } else {
          return fileList;
        }
      case "fileList":
      default:
        return fileList;
    }
  };

  const uploadProps = {
    ref: uploadRef,
    customRequest,
    itemRender,
    fileList,
    listType: isAvatar ? "picture-circle" : listType,
    style: isAvatar ? { width: 80, height: 80 } : undefined,
    showUploadList: !isAvatar || newMaxCount > 1,
    onChange: (values: any) => {
      console.log("onChange", values);
      const { fileList } = values;
      setUploadFileList(fileList);
      if (onChange) {
        const res: any = returnFilesHanddle(fileList, returnType);
        onChange(res);
      }
    },
    multiple: newMaxCount > 1,
    maxCount: newMaxCount,
  };
  return (
    <Upload {...uploadProps}>
      {uploadFileList.length < newMaxCount || isAvatar ? (
        isAvatar ? (
          <AvatarButton file={uploadFileList[0]} />
        ) : (
          props.children || <Button icon={<UploadOutlined />}>选择文件</Button>
        )
      ) : null}
    </Upload>
  );
};

export default OSSUpload;
