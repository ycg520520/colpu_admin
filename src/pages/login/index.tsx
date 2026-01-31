import { getUserToken } from "@/api/user";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  AlipayOutlined,
  TaobaoOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import { LoginFormPage } from "@ant-design/pro-components";
import { Divider, Space, Tabs, theme, message } from "antd";
import { createStyles } from "antd-style";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import UserForm from "./components/UserForm";
import PhoneForm from "./components/PhoneForm";
import Lang from "@/components/Lang";
import { useTranslation } from "react-i18next";
import { ObjectMaps } from "@/types";
type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: "8px",
      color: "rgba(255, 255, 255, 1)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      position: "fixed",
      zIndex: 999,
      right: 16,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "auto",
      backgroundImage:
        "url(https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr)",
      backgroundSize: "100% 100%",
    },
    thirdWrap: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    forgotPassword: {
      float: "right",
    },
    marginBlockEnd: {
      marginBlockEnd: 40,
    },
  };
});

const Page = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { token } = theme.useToken();
  const { styles } = useStyles();
  const { userToken } = useAppSelector((state) => state.user);
  if (userToken) {
    return <Navigate to={searchParams.get("redirect") || "/"} replace />;
  }
  return (
    <LoginFormPage
      // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
      logo="https://github.githubassets.com/favicons/favicon.png"
      backgroundVideoUrl="https://res.creatiai.ai/web/creatiai/stuido-landing-top-video-202509041951.webm"
      title="Github"
      // style={{
      //   backgroundColor: "rgba(0,0,0,.75)",
      // }}
      containerStyle={{
        backdropFilter: "blur(4px)",
      }}
      subTitle={t("pages.layouts.userLayout.title", {
        defaultValue: "全球最大的代码托管平台",
      })}
      // activityConfig={{
      //   style: {
      //     boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
      //     color: token.colorTextHeading,
      //     borderRadius: 8,
      //     backgroundColor: "rgba(255,255,255,0.25)",
      //     backdropFilter: "blur(4px)",
      //   },
      //   title: "活动标题，可配置图片",
      //   subTitle: "活动介绍说明文字",
      //   action: (
      //     <Button
      //       size="large"
      //       style={{
      //         borderRadius: 20,
      //         background: token.colorBgElevated,
      //         color: token.colorPrimary,
      //         width: 120,
      //       }}
      //     >
      //       去看看
      //     </Button>
      //   ),
      // }}
      actions={
        <div className={styles.thirdWrap}>
          <Divider plain>
            <span
              style={{
                color: token.colorTextPlaceholder,
                fontWeight: "normal",
                fontSize: 14,
              }}
            >
              {t("pages.login.loginWith", {
                defaultValue: "其他登录方式",
              })}
            </span>
          </Divider>
          <Space align="center" size={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: 40,
                width: 40,
                border: "1px solid " + token.colorPrimaryBorder,
                borderRadius: "50%",
              }}
            >
              <AlipayOutlined style={{ ...iconStyles, color: "#1677FF" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: 40,
                width: 40,
                border: "1px solid " + token.colorPrimaryBorder,
                borderRadius: "50%",
              }}
            >
              <TaobaoOutlined style={{ ...iconStyles, color: "#FF6A10" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: 40,
                width: 40,
                border: "1px solid " + token.colorPrimaryBorder,
                borderRadius: "50%",
              }}
            >
              <WeiboOutlined style={{ ...iconStyles, color: "#1890ff" }} />
            </div>
          </Space>
        </div>
      }
      submitter={{
        searchConfig: {
          submitText: t("pages.login.submit", { defaultValue: "去登录" }),
        },
      }}
      onFinish={(values) => {
        dispatch(getUserToken(values as ObjectMaps))
          .then(() => {
            message.success(
              t("pages.login.success", {
                defaultMessage: "登录成功！",
              }),
            );
          })
          .catch(() => {
            message.error(
              t("pages.login.failure", {
                defaultMessage: "登录失败，请重试！",
              }),
            );
          });
      }}
    >
      <Tabs
        centered
        activeKey={loginType}
        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        items={[
          {
            label: t("pages.login.tab.account", {
              defaultValue: "账号密码登录",
            }),
            key: "account",
            children: <UserForm token={token} />,
          },
          {
            label: t("pages.login.tab.phone", {
              defaultValue: "手机号登录",
            }),
            key: "phone",
            children: <PhoneForm token={token} />,
          },
        ]}
      ></Tabs>
      <div className={styles.marginBlockEnd}>
        <a className={styles.forgotPassword}>
          {t("pages.login.forgotPassword", {
            defaultValue: "忘记密码",
          })}
        </a>
      </div>
    </LoginFormPage>
  );
};

const LoginPage = () => {
  const { styles } = useStyles();
  return (
    <>
      <Lang className={styles.lang} hasButton />
      <Page />
    </>
  );
};

export default LoginPage;
