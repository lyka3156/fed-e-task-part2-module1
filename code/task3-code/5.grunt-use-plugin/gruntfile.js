// 默认导出一个函数， 函数有个形参 grunt, grunt 对象中提供一些创建任务时会用到的 API

const sass = require("sass"); // 引入sass模块
const loadGruntTasks = require("load-grunt-tasks"); // 使用这个插件自动加载已grunt-开头的所有任务插件
module.exports = (grunt) => {
  // 初始化任务配置
  grunt.initConfig({
    // 初始化 sass 任务配置
    sass: {
      options: {
        sourceMap: true, // 生成 soureceMap 映射文件
        implementation: sass, // 实现方式       使用sass解析
      },
      main: {
        files: {
          // 输出:输入
          "dist/css/main.css": "src/scss/main.scss",
        },
      },
    },
    // 使用babel插件解析js
    babel: {
      options: {
        sourceMap: true, // 生成 soureceMap 映射文件
        presets: ["@babel/preset-env"], // 使用preset-env 解析es6+最新语法
      },
      main: {
        files: {
          // 输出:输入
          "dist/js/app.js": "src/js/app.js",
        },
      },
    },
    // watch的使用会自动监听修改，并grunt自动构建
    watch: {
      js: {
        // files表示要监听的文件，可以是单个值或数组；tasks表示监听有改动后要执行什么任务
        files: ["src/js/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/scss/*.scss"],
        tasks: ["sass"],
      },
    },
    //html 压缩
    htmlmin: {
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
      },
      build: {
        expand: true,
        cwd: "./src",
        src: ["*.html"],
        dest: "./dist",
      },
    },
  });

  // 自动加载所有的 grunt 插件中的任务
  // 代替下面手动加载任务插件的使用
  loadGruntTasks(grunt);

  // 加载npm模块任务  (插件)
  //   grunt.loadNpmTasks("grunt-sass"); // 会注册一个sass任务
  //   grunt.loadNpmTasks("grunt-babel"); // 会注册一个babel任务
  //   grunt.loadNpmTasks("grunt-contrib-watch"); // 会注册一个watch任务
  //   grunt.loadNpmTasks("grunt-contrib-htmlmin"); // 会注册一个htmlmin任务

  grunt.registerTask("default", ["sass", "babel", "htmlmin"]);
  //   grunt.registerTask("default", ["sass", "babel", "htmlmin","watch"]);
};
