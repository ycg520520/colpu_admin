/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * @doc 代理介绍 https://github.com/http-party/node-http-proxy#options
 * @doc 代理配置 https://cn.vitejs.dev/config/server-options.html#server-proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  devlopment: {
    "/api/": {
      // 要代理的地址
      target: "https://preview.pro.ant.design",
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
};
