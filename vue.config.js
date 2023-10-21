const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const api = process.env.VUE_APP_BASE_API;
const url = process.env.VUE_APP_URL;

module.exports = defineConfig({
  // 环境变量      本地 and 测试(net)
  publicPath: "/",
  // build输出目录
  outputDir: "dist",
  // 配置打包后不出现map文件
  productionSourceMap: false,

  transpileDependencies: true,

  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "员工常见问题问答";
      return args;
    });
  },

  pluginOptions: {
    // 配置全局的less文件，（注意：单文件style的中间必须要有内容，注释也是，空行不行，这个配置才会被引用）
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/style/function.less")],
    },
  },

  // 代理
  devServer: {
    // // 是否自动弹出浏览器页面
    // open: true,
    // // 表示启动的时候使用的域名，默认可以不写则是使用localhost和本机IP
    // host: url,
    // // 设置端口号
    // port: "80",
    // // 是否使用https协议
    // https: false,
    // proxy: {
    //   "/admin": {
    //     // 如果是https接口，需要设置这个参数
    //     // secure: fasle
    //     // API服务器的地址
    //     target: api,
    //     // 代理websockets
    //     ws: false,
    //     // 是否跨域，虚拟的站点需要更管origin
    //     changeOrigin: true,
    //     pathRewrite: {
    //       // '^/api5'是一个正则表达式，表示要匹配请求的url中，全部'http://localhost:8080/api5' 转接为 http://localhost:8080/api/
    //       // '^/api5': '/api',
    //       // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //       "^/admin": "/",
    //     },
    //   },
    // },
  },
});
