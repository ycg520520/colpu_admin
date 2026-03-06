/**
 * @Author: colpu
 * @Date: 2026-03-01 22:33:32
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2026-03-06 12:07:57
 * @
 * @Copyright (c) 2026 by colpu, All Rights Reserved.
 */
import { getConfig } from "@colpu/cli";
const env = process.env.NODE_ENV;
const {
  name,
  config = {},
  pkg = {}
} = await getConfig(import.meta.dirname, { dir: './', env });
const WORKSPACE = `/var/www/${name}`;
const command = [
  "tar -xzf dist.tar.gz",
  // "git fetch",
  // `pm2 startOrRestart launched.config.json --env ${env}`,
  // 'pm2 save && pm2 startup'
];
// 将本地的配置文件复制到远程服务器
function deployLocal() {
  const arr = config.deploy.host.map(ip => {
    return [
      `scp -r dist.tar.gz root@${ip}:${WORKSPACE}/current/dist.tar.gz`,
      `scp -r launched.config.json root@${ip}:${WORKSPACE}/current/launched.config.json`].join(" && ");
  });
  arr.unshift('tar --no-xattrs -czf dist.tar.gz ./dist/')
  return arr.join(" && ");
}
const setDeployENV = () => {
  const map = {};
  map[env] = Object.assign(
    {
      repo: pkg.repository.url,
      ref: "origin/master",
      host: ["127.0.0.1"],
      user: "root",
      path: WORKSPACE,
    },
    {
      "pre-deploy-local": deployLocal(),
      "pre-setup": `mkdir -p ${WORKSPACE}`,
      "post-deploy": command.join(" && "),
      env: {
        NODE_ENV: env,
      },
    },
    config.deploy
  );
  return map;
};
const LAUNCHED = {
  apps: [],
  deploy: setDeployENV(),
};
export default LAUNCHED;
