const webpack = require("webpack");     // webpack插件
const HtmlWebpackPlugin = require("html-webpack-plugin");   // html模板插件
const path = require("path");

// 手动配置 webpack 文件
module.exports = {
  mode: "development", //   开发模式 (production/development)
  entry: "./src/index.tsx",   // 入口文件
  output: {     // 输出目录
    filename: "bundle.js",      // 输出文件名
    path: path.join(__dirname, "dist"),   // 输出目录地址
  },
  devtool: "source-map",  // devtool配置：可以更好的查看错误信息
  devServer: {    // 开发服务器
    hot: true,    // 开启热更新
    contentBase: path.join(__dirname, "dist"),    
    historyApiFallback: {       // 没有找到目录重定向指定页面
      index: "./index.html",
    },
  },
  resolve: {      // 模块名称后面自动添加的后缀名
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  // 解析模块
  module: {
    rules: [
      // 解析.tsx模块的loader   
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      // 解析.js模块的loader
      {
        enforce: "pre",     // 前置loader在正常loader之前执行
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  plugins: [
    // 配置html模板
    new HtmlWebpackPlugin({
      template: "./src/index.html", // html模板路劲
      filename: "index.html"      // 打包生成的html文件名
    }),
    // 开启热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
};
