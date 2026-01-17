import { Editor } from "@tinymce/tinymce-react";
// 👇 必须导入核心模块（防止 tree-shaking）
import "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/code";
import "./style.scss";
import { useState } from "react";
import { apiUploadFile } from "@/api/common";
export default function RichTextEditor({
  onChange,
  value,
}: {
  onChange?: (value: any) => void;
  value?: string;
}) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initialContent, setInitialContent] = useState<string>("");
  // 首次收到有效内容，记录下来
  if (!hasInitialized && !!value) {
    setInitialContent(value);
    setHasInitialized(true);
  }
  return (
    <Editor
      initialValue={initialContent}
      licenseKey="gpl" // 明确使用社区版（可选但推荐）
      init={{
        height: 300,
        menubar: true, // 顶部菜单栏显示
        language_url: "/node_modules/tinymce-i18n/langs/zh_CN.js",
        language: "zh_CN",
        // ✅ 1. 指向本地资源
        base_url: "/node_modules/tinymce", // 用于加载主题、插件
        // ✅ 2. 显式指定皮肤路径（避免回退 CDN）
        skin: "oxide", // 或 false 禁用皮肤
        // ✅ 3. 禁用云相关功能
        promotion: false, // 隐藏“升级”横幅
        // 其他配置
        branding: true, // 隐藏 "Powered by Tiny"
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "wordcount",
        ],
        toolbar: `undo redo | blocks |
          bold italic forecolor backcolor fontsize | alignleft aligncenter
          alignright alignjustify | bullist numlist outdent indent | 
          code codesample link unlink | image media table
          fullscreen preview removeformat | help`,
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        images_upload_handler: async (blobInfo) => {
          const formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());
          try {
            const response: any = await apiUploadFile(formData);
            // 返回图片 URL（必须是绝对路径或可访问的相对路径）
            return response.url;
          } catch (error) {
            console.error("图片上传错误:", error);
            throw error; // TinyMCE 会显示错误提示
          }
        },
        automatic_uploads: true, // 启用自动上传（粘贴/拖拽图片时）
      }}
      onEditorChange={(content) => {
        console.log("编辑器内容:", content);
        if (onChange) {
          onChange(content);
        }
      }}
    />
  );
}
