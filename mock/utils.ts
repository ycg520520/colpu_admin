/*
 * @Author: colpu
 * @Date: 2025-10-28 14:58:01
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-30 09:26:16
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import url from "url";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { MAXAGE, SECRET_KEY } from "./config";
function parseJson(req: any) {
  return new Promise((resolve) => {
    let jsonStr = {};
    let str = "";
    req.on("data", function (chunk: string) {
      str += chunk;
    });
    req.on("end", () => {
      try {
        jsonStr = JSON.parse(str);
      } catch (e: any) {
        const params = new URLSearchParams(str);
        const body: any = {};
        params.forEach((value, key) => {
          body[key] = value;
        });
        jsonStr = body;
      }
      resolve(jsonStr);
      return;
    });
  });
}
export async function verifyToken(req: any, res: any, callback: any) {
  console.log('ddd')
  const { headers } = req;
  const tokenStr = headers.authorization?.split(" ")[1];
  let tokens: any;
  try {
    tokens = jwt.verify(tokenStr, SECRET_KEY);
  } catch (error) {
    console.error(error);
  }
  const now = Date.now() / 1000;
  if (!tokens || now < tokens.iat || now > tokens.exp) {
    res.statusCode = 401;
    res.end("Invalid token");
  } else {
    res.statusCode = 200;
    let data = callback;
    if (typeof callback === "function") {
      if (!res.locals) {
        res.locals = Object.create(null);
      }
      res.locals.tokens = tokens;
      data = callback(req, res);
    }
    res.end(JSON.stringify(data));
  }
}

export function rawResponse(callback: any, isVerify = false) {
  if (typeof callback === "function" && !isVerify) {
    return callback;
  } else {
    return async (req: any, res: any) => {
      // res.setHeader("Content-Type", "application/json");
      let queryParams: any = {};
      if (req.url) {
        queryParams = url.parse(req.url, true);
      }
      const body = await parseJson(req);
      req.query = queryParams.query;
      req.body = body;
      console.log('-------')
      if (isVerify) {
        await verifyToken(req, res, callback);
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(callback));
      }
    };
  }
}

export function generateToken(data:any) {
  const expires_in = Math.floor(Date.now() / 1000) + MAXAGE; // 服务器过期时间
  const accessToken = jwt.sign(
    {
      uid: data.uid
    },
    SECRET_KEY,
    { expiresIn: MAXAGE }
  );
  const refreshToken = crypto.randomBytes(16).toString("hex").toUpperCase();
  return {
    token_type: "Bearer",
    access_token: accessToken,
    expires_in,
    refresh_token: refreshToken,
  };
}
