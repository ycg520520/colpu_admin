/**
 * 与 indian 项目一致的 CDN 图片路径处理（相对路径 → 可访问 URL）
 */
const defaultCdn =
  import.meta.env.VITE_CDN || "https://colpu-ai.oss-cn-shanghai.aliyuncs.com";

export function getImageSrc(
  src?: string | null,
  options?: { rule?: string; cdn?: string },
): string {
  if (!src) return "";
  const { rule, cdn = defaultCdn } = options || {};
  if (/^(\/(static|assert)|\/\/|https?:\/\/|data:image)/.test(src)) {
    return src;
  }
  let url = cdn + (src.startsWith("/") ? src : `/${src}`);
  if (rule && /\.(png|jpe?g|gif|webp)$/i.test(url)) {
    url += rule;
  }
  return url;
}

/** 存库用：CDN 完整 URL → upload/ 或 static/ 相对路径 */
export function stripImageSrc(url?: string | null): string {
  if (!url) return "";
  const uploadParts = url.split("upload/");
  if (uploadParts.length > 1) return `upload/${uploadParts.pop()}`;
  const staticParts = url.split("static/");
  if (staticParts.length > 1) return `static/${staticParts.pop()}`;
  return url;
}
