import { Modal, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { startOAuthLogin, pollOAuthLogin } from "@/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setUserToken } from "@/store/slices/user";
import type { UserToken } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function WechatLoginModal({ open, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const stateRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const stopPoll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
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
          onClose();
          return;
        }
        setError(res?.message || "登录失败或二维码已过期");
      } catch {
        stopPoll();
        setError("轮询失败，请重试");
      }
    }, 2000);
  }, [dispatch, onClose, onSuccess, stopPoll]);

  const loadQrcode = useCallback(async () => {
    setLoading(true);
    setError("");
    setQrImage("");
    stopPoll();
    try {
      const res: any = await startOAuthLogin("wechat");
      stateRef.current = res?.state || "";
      setQrImage(res?.qr_image || "");
      startPoll();
    } catch (e: any) {
      setError(e?.message || "获取二维码失败");
    } finally {
      setLoading(false);
    }
  }, [startPoll, stopPoll]);

  useEffect(() => {
    if (open) {
      loadQrcode();
    } else {
      stopPoll();
      stateRef.current = "";
    }
    return () => stopPoll();
  }, [open, loadQrcode, stopPoll]);

  return (
    <Modal
      title="微信扫码登录"
      open={open}
      onCancel={onClose}
      footer={null}
      width={320}
      destroyOnClose
    >
      <div style={{ textAlign: "center", minHeight: 260 }}>
        {loading && <Spin style={{ margin: "80px 0" }} />}
        {!loading && qrImage && (
          <img
            src={qrImage}
            alt="微信登录二维码"
            style={{ width: 220, height: 220 }}
          />
        )}
        <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
          请使用微信扫描二维码
        </Typography.Paragraph>
        {error && (
          <Typography.Text type="danger" style={{ display: "block" }}>
            {error}
          </Typography.Text>
        )}
        {error && (
          <Typography.Link onClick={loadQrcode} style={{ marginTop: 8 }}>
            刷新二维码
          </Typography.Link>
        )}
      </div>
    </Modal>
  );
}
