import { get, post } from "@/utils/request";

/** 三方登录渠道 */
export type OAuthProvider = "wechat" | "alipay" | "taobao" | "weibo";

/** POST /api/sms/send — 发送手机登录验证码 */
export const sendLoginSms = (mobile: string) =>
  post("sms/send", { mobile });

/** GET /api/oauth/:provider/start — 发起三方登录（微信返回二维码） */
export const startOAuthLogin = (provider: OAuthProvider) =>
  get(`oauth/${provider}/start`);

/** GET /api/oauth/poll?state= — 轮询三方登录结果 */
export const pollOAuthLogin = (state: string) =>
  get("oauth/poll", { params: { state } });
