/*
 * @Author: colpu
 * @Date: 2025-10-31 20:11:31
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-01-15 17:34:08
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { useRef, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, Image, message } from "antd";
import oosUpload from "./oss";
import { getBase64, getImageObjectWithDimensions } from "./utils";
import { sseUpload } from "./sse";
import { UploadProps } from "antd/es/upload/interface";
import ImgCrop, { ImgCropProps } from "antd-img-crop";
import { singleUpload } from "./single";
import { createStyles } from "antd-style";

type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface CustomUploadProps {
  fileList?: any[];
  onChange?: (files: any) => void;
  isAvatar?: boolean;
  uploadType?: "oss" | "sse" | "single";
  query?: any; // 上传参数
  sseOptions?: any;
  imgCropProps?: Without<ImgCropProps, "children">;
  children?: React.ReactNode;
  uploadProps?: UploadProps; // 上传组件属性
}
const useStyles = createStyles(() => ({
  customUpload: {
    "& .ant-upload-list-item": {
      padding: "0!important",
      justifyContent: "center",
    },
    "& .ant-upload-list-item-progress": {
      bottom: "24px!important",
    },
    "& .ant-upload-list-item::before": {
      width: "100%!important",
      height: "100%!important",
      borderRadius: "4px",
    },
    "& .ant-upload-list-item-image": {
      borderRadius: "3px!important",
    },
  },
}));
const UploadButton = (props: any) => {
  const { loading = false, text = "上传图片" } = props;
  return (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ fontSize: 12 }}>{text}</div>
    </div>
  );
};
const CustomUpload = (props: CustomUploadProps) => {
  const {
    fileList = [],
    onChange,
    isAvatar = false,
    uploadType = "single",
    query = {},
    sseOptions = {
      ismd5: true,
    },
    imgCropProps,
    uploadProps = {},
  } = props;
  // 上传组件属性
  const maxCount = isAvatar ? 1 : uploadProps.maxCount;
  const multiple = maxCount !== 1;
  console.log(fileList);

  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewSrc, setPreviewSrc] = useState<string>(previewImages[0]);
  const uploadRef = useRef(undefined);
  const { styles } = useStyles();

  const uploadRequest = async (options: any) => {
    const { onProgress } = options;
    const commonConf = {
      ...options,
      query,
      onProgress(percent: any) {
        onProgress({ percent });
      },
    };
    switch (uploadType) {
      case "sse":
        return sseUpload({
          ...commonConf,
          sseOptions,
        });
      case "oss":
        return oosUpload(commonConf);
      default:
        return singleUpload(commonConf);
    }
  };

  // 使用分片上传显示进度
  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const response = await uploadRequest(options);
      onSuccess(response, file);
      message.success("上传成功");
    } catch (error) {
      console.error("上传失败:", error);
      message.error("上传失败");
      onError(error);
    }
  };

  const onPreview = async (file: any) => {
    const src = file.url || file.preview || file.response.url;
    setPreviewImages(
      fileList.map((file: any) => {
        return file.url || file.preview;
      })
    );
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const composeUploadProps = {
    ref: uploadRef,
    customRequest,
    fileList,
    showUploadList: true,
    onChange: async (info: any) => {
      const { file } = info;
      // 设置预览图
      if (!file.url && !file.preview) {
        // 预览图片
        file.preview = await getBase64(file.originFileObj);
        const { base64 } = await getImageObjectWithDimensions(
          file.originFileObj,
          {
            isThumb: true,
            width: 200,
            aspect: imgCropProps ? imgCropProps.aspect || 1 : 1,
          }
        );
        file.thumbUrl = base64;
      }
      if (file.response) {
        file.url = file.response.url;
      }
      console.log("file.status", file.status, file.url);
      if (onChange) {
        onChange(info);
      }
      if (file.status === "uploading") {
        setLoading(true);
      } else if (file.status === "done") {
        setLoading(false);
      }
    },
    onPreview,
    ...uploadProps,
    className: [styles.customUpload, uploadProps.className].join(" "),
    maxCount,
    multiple,
  };
  const uploadCom = (
    <Upload {...composeUploadProps}>
      {fileList.length == maxCount ? null : isAvatar ? (
        <UploadButton loading={loading} text="上传头像" />
      ) : (
        props.children || <UploadButton />
      )}
    </Upload>
  );
  return (
    <>
      {imgCropProps ? (
        <ImgCrop rotationSlider {...imgCropProps}>
          {uploadCom}
        </ImgCrop>
      ) : (
        uploadCom
      )}
      {previewImages.length > 0 && (
        <Image.PreviewGroup
          preview={{
            src: previewSrc,
            visible: previewOpen,
            onChange: (current) => {
              setPreviewSrc(previewImages[current]);
            },
            onVisibleChange: setPreviewOpen,
            afterOpenChange: (visible) => !visible && setPreviewImages([]),
          }}
          items={previewImages}
        />
      )}
    </>
  );
};

export default CustomUpload;
