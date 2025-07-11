import { CustomLocale } from "../types";

/*
 * @Author: colpu
 * @Date: 20250318 20:41:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-03-19 15:43:58
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
const settings: CustomLocale = {
  basic: {
    name: "基本设置",
    avatar: "头像",
    changeAvatar: "更换头像",
    email: "邮箱",
    emailMessage: "请输入您的邮箱!",
    nickname: "昵称",
    nicknameMessage: "请输入您的昵称!",
    profile: "个人简介",
    profileMessage: "请输入个人简介!",
    profilePlaceholder: "个人简介",
    country: "国家/地区",
    countryMessage: "请输入您的国家或地区!",
    geographic: "所在省市",
    geographicMessage: "请输入您的所在省市!",
    address: "街道地址",
    addressMessage: "请输入您的街道地址!",
    phone: "联系电话",
    phoneMessage: "请输入您的联系电话!",
    update: "更新基本信息",
  },
  security: {
    name: "安全设置",
    strong: "强",
    medium: "中",
    weak: "弱",
    password: "账户密码",
    passwordDescription: "当前密码强度",
    phone: "密保手机",
    phoneDescription: "已绑定手机",
    question: "密保问题",
    questionDescription: "未设置密保问题，密保问题可有效保护账户安全",
    email: "备用邮箱",
    emailDescription: "已绑定邮箱",
    mfa: "MFA 设备",
    mfaDescription: "未绑定 MFA 设备，绑定后，可以进行二次确认",
    modify: "修改",
    set: "设置",
    bind: "绑定",
  },
  binding: {
    name: "账号绑定",
    taobao: "绑定淘宝",
    taobaoDescription: "当前未绑定淘宝账号",
    alipay: "绑定支付宝",
    alipayDescription: "当前未绑定支付宝账号",
    dingding: "绑定钉钉",
    dingdingDescription: "当前未绑定钉钉账号",
    bind: "绑定",
  },
  notification: {
    name: "新消息通知",
    password: "账户密码",
    passwordDescription: "其他用户的消息将以站内信的形式通知",
    messages: "系统消息",
    messagesDescription: "系统消息将以站内信的形式通知",
    todo: "待办任务",
    todoDescription: "待办任务将以站内信的形式通知",
  },
  open: "开",
  close: "关",
};
export default settings;
