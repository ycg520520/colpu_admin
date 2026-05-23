import {
  // AlipayOutlined,
  QqOutlined,
  // TaobaoOutlined,
  WechatOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import { message, Space } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  startOAuthLogin,
  pollOAuthLogin,
  type OAuthProvider,
} from "@/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setUserToken } from "@/store/slices/user";
import type { UserToken } from "@/types";
import WechatLoginModal from "./WechatLoginModal";

const iconStyle: CSSProperties = {
  fontSize: 22,
  verticalAlign: "middle",
  cursor: "pointer",
};

const wrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 40,
  width: 40,
  border: "1px solid var(--ant-color-primary-border)",
  borderRadius: "50%",
  cursor: "pointer",
};

type Props = {
  borderColor?: string;
  onSuccess?: () => void;
};

function OAuthIconButton({
  title,
  color,
  onClick,
  children,
}: {
  title: string;
  color: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      style={wrapStyle}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <span style={{ ...iconStyle, color }}>{children}</span>
    </div>
  );
}

export default function ThirdPartyLogin({ onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [wechatOpen, setWechatOpen] = useState(false);
  const stateRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const stopPoll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPoll = useCallback(() => {
    stopPoll();
    timerRef.current = setInterval(async () => {
      if (!stateRef.current) return;
      try {
        const res: any = await pollOAuthLogin(stateRef.current);
        if (res?.status === "pending") return;
        stopPoll();
        if (res?.status === "ok" && res?.tokens) {
          dispatch(setUserToken(res.tokens as UserToken));
          onSuccess?.();
          return;
        }
        message.error(res?.message || "登录失败或授权已过期");
      } catch {
        stopPoll();
        message.error("登录状态查询失败");
      }
    }, 2000);
  }, [dispatch, onSuccess, stopPoll]);

  const handleRedirectOAuth = async (provider: OAuthProvider) => {
    try {
      const res: any = await startOAuthLogin(provider);
      if (res?.qr_image) {
        setWechatOpen(true);
        return;
      }
      if (!res?.auth_url) {
        message.warning("未获取到授权地址");
        return;
      }
      stateRef.current = res.state || "";
      const w = window.open(
        res.auth_url,
        "oauth_login",
        "width=520,height=640,menubar=no,toolbar=no",
      );
      if (!w) {
        message.warning("请允许浏览器弹窗后重试");
        return;
      }
      startPoll();
    } catch (e: any) {
      message.error(e?.message || "发起登录失败");
    }
  };

  useEffect(() => () => stopPoll(), [stopPoll]);

  useEffect(() => {
    const onMessage = async (ev: MessageEvent) => {
      if (ev.data?.type !== "oauth-login") return;
      stopPoll();
      if (!ev.data?.ok || !stateRef.current) return;
      try {
        const res: any = await pollOAuthLogin(stateRef.current);
        if (res?.status === "ok" && res?.tokens) {
          dispatch(setUserToken(res.tokens as UserToken));
          onSuccess?.();
        } else if (res?.message) {
          message.error(res.message);
        }
      } catch {
        message.error("登录状态查询失败");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [dispatch, onSuccess, stopPoll]);

  return (
    <>
      <Space align="center" size={24}>
        <OAuthIconButton
          title="微信登录"
          color="#07c160"
          onClick={() => setWechatOpen(true)}
        >
          <WechatOutlined />
        </OAuthIconButton>
        <OAuthIconButton
          title="QQ登录"
          color="#12B7F5"
          onClick={() => handleRedirectOAuth("qq")}
        >
          <QqOutlined />
        </OAuthIconButton>
        {/* 支付宝 / 淘宝登录暂未开放
        <OAuthIconButton
          title="支付宝登录"
          color="#1677FF"
          onClick={() => handleRedirectOAuth("alipay")}
        >
          <AlipayOutlined />
        </OAuthIconButton>
        <OAuthIconButton
          title="淘宝登录"
          color="#FF6A10"
          onClick={() => handleRedirectOAuth("taobao")}
        >
          <TaobaoOutlined />
        </OAuthIconButton>
        */}
        <OAuthIconButton
          title="微博登录"
          color="#1890ff"
          onClick={() => handleRedirectOAuth("weibo")}
        >
          <WeiboOutlined />
        </OAuthIconButton>
      </Space>
      <WechatLoginModal
        open={wechatOpen}
        onClose={() => setWechatOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
