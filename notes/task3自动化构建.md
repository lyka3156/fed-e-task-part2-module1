# 3. 自动化构建

一切重复工作本应自动化

自动化

自动化构建
![avatar](../images/自动化构建01.png)

自动化构建工具流

自动化构建初体验

- 正常编写 css 运行在浏览器中
  ![avatar](../images/自动化构建初体验01.png)

- 编写 less 文件，通过自动化构建将 less 转换成浏览器认识的 css 文件
  ![avatar](../images/自动化构建初体验02.png)

NPM Scripts

- 实现自动化构建工作流的最简方式

常用的自动化构建工具

- Grunt
- Gulp
- FIS

## 3.1 Grunt

基本使用

```js
// 步骤1  安装 grunt 模块
yarn add grunt -D
// 步骤2  添加 gruntfile.js 文件, 是入口文件，在这里实现你的意图。  (相当于webpack的webpack.config.js)
mkdir gruntfile.js
// 步骤3  在 gruntfile.js 文件中编写自己的配置
// 3.1) grunt默认导出一个函数，此函数接收一个 grunt 的对象类型的形参, grunt 对象中提供一些创建任务时会用到的 API
// 3.2) grunt.initConfig 是为任务添加一些配置选项
// 3.3) grunt.registerTask 是注册任务，通过这些任务实现你自己的功能
// 3.3.1) default是默认任务名称，通过 grunt 执行时可以省略任务名    yarn grunt
// 3.3.2) 其他任务名称执行， 使用 yarn grunt 任务名 去运行
// 3.3.3) 在注册的任务中可以通过 grunt.config(任务名) 拿到 grunt.initConfig中的配置选项
module.exports = (grunt) => {
  // grunt.initConfig() 用于为任务添加一些配置选项
  grunt.initConfig({
    // 键一般对应任务的名称
    // 值可以是任意类型的数据
    task1: {
      name: "我是任务1",
    },
  });

  // 注册默认任务 default
  // 通过 grunt 执行时可以省略          yarn grunt
  grunt.registerTask("default", () => {
    console.log("default task");
  });

  // 注册task1任务              yarn grunt task1
  grunt.registerTask("task1", () => {
    // 任务中可以使用 grunt.config() 获取配置
    console.log(grunt.config("task1"));
    // 如果属性值是对象的话，config 中可以使用点的方式定位对象中属性的值
    console.log(grunt.config("task1.name"));
  });
};

```

注册同步任务和异步任务，以及任务内部使用其他任务的使用如下所示

```js
// 默认导出一个函数， 函数有个形参 grunt, grunt 对象中提供一些创建任务时会用到的 API

module.exports = (grunt) => {
  // 注册任务1
  grunt.registerTask("task1", () => {
    console.log("我是任务1");
  });
  // 注册任务2
  grunt.registerTask("task2", () => {
    console.log("我是任务2");
  });
  // grunt.registerTask
  // 第一个参数是任务名
  // 第二个参数是实例任务  可以是字符串也可以是数组，还可以是函数
  // 第三个参数可以是函数，也可以不存在

  // 注册默认任务         通过 yarn grunt 执行
  // 第二个参数是函数，执行这个任务的时候会直接执行这个函数
  grunt.registerTask("default", () => {
    console.log("我是默认任务");
  });
  // 输出   我是默认任务

  // 这种情况和上面的是一样的
  grunt.registerTask("default", "task11", () => {
    console.log("我是默认任务");
  });
  // 输出   我是默认任务

  // 第二个参数是字符串，会执行此字符串的任务
  grunt.registerTask("default", "task1"); // 执行task1任务
  // 输出  我是任务1

  // 第二个参数是数组    这里映射的任务会按顺序依次执行，不会同步执行
  grunt.registerTask("default", ["task1", "task2"]); // 执行task1任务
  // 输出
  // 我是任务1
  // 我是任务2

  // 也可以在任务函数中执行其他任务     (grunt.task.run)
  grunt.registerTask("task3", () => {
    // task1 和 task2 会在当前任务执行完成过后自动依次执行
    grunt.task.run("task1", "task2");
    console.log("current task runing~");
  });
  // 输出
  // current task runing~
  // 我是任务1
  // 我是任务2

  // 注册异步任务
  // 默认 grunt 采用同步模式编码
  // 如果需要异步可以使用 this.async() 方法创建回调函数
  // 由于函数体中需要使用 this，所以这里不能使用箭头函数
  grunt.registerTask("async-task", function () {
    const done = this.async();
    setTimeout(() => {
      console.log("async task working~");
      done();
    }, 3000);
  });
  // 过3秒输出
  // async task working~
};
```

通过上述总结出

- 注册的任务如果一样的话，后面注册的会覆盖前面注册的任务
- 注册的默认任务通过 yarn grunt 执行，注册的其他任务通过 yarn grunt 任务名 去执行
- 注册任务指定的第二个参数如果是字符串或者数组的话,第三个参数并且不是一个函数的话，如果没有找到第二个参数的任务会报错
- 可以在任务内部使用 grunt.task.run 执行其他任务，其他任务在此任务结束之后执行
- 默认 grunt 采用同步模式编码, 如果需要异步可以使用 this.async() 方法创建回调函数，并且函数体中不能使用箭头函数

标记任务失败

```js
module.exports = (grunt) => {
  // 执行任务失败的几种方式

  // 同步任务函数执行过程中返回false就意味着任务执行失败
  grunt.registerTask("task1", () => {
    console.log("run task1");
    return false;
  });
  grunt.registerTask("task2", () => {
    console.log("run task2");
  });
  // 如果一个任务列表中的某个任务执行失败
  // 则后续任务默认不会运行
  // 除非 grunt 运行时指定 --force 参数强制执行
  grunt.registerTask("default", ["task1", "task2"]);
  // 使用 yarn grunt    输出如下
  // run task1
  // 报错
  // 使用 yarn grunt --force  输出如下
  // run task1
  // run task2

  // 异步函数中标记当前任务执行失败的方式是为回调函数指定一个 false 的实参
  grunt.registerTask("bad-async", function () {
    const done = this.async();
    setTimeout(() => {
      console.log("async run bad-async~");
      done(false); // 标记任务失败
    }, 1000);
  });
  // 输出如下
  // async run bad-async~
  // 报错
};
```

通过上述所得:

- 同步任务 return false 就代表此任务失败
- 如果一个任务列表中的某个任务执行失败，则后续任务默认不会运行，除非 grunt 运行时指定 --force 参数强制执行
- 异步函数中标记当前任务执行失败的方式是为回调函数指定一个 false 的实参

配置选项方法 和 多目标任务

```js
module.exports = (grunt) => {
  // 多目标模式，可以让任务根据配置形成多个子任务
  grunt.initConfig({
    dev: {
      foo: 100,
      bar: "456",
    },
    build: {
      options: {
        msg: "task options",
      },
      foo: {
        options: {
          msg: "foo target options",
        },
      },
      bar: "456",
    },
  });
  // 根据dev配置的几个选项就执行几个子任务
  // this.target 是子任务名称  foo/bar
  // this.data 是子任务的数据   100/456
  grunt.registerMultiTask("dev", function () {
    console.log(`task: dev, target: ${this.target}, data: ${this.data}`);
  });
  // 输出
  // Running "dev:foo" (dev) task
  // task: dev, target: foo, data: 100
  // Running "dev:bar" (dev) task
  // task: dev, target: bar, data: 456

  // this.options拿到的就是子任务配置的options
  // 如果子任务没有options就拿最顶层的options配置
  grunt.registerMultiTask("build", function () {
    console.log(this.options());
  });
  // 输出
  // Running "build:foo" (build) task
  // { msg: 'foo target options' }
  // Running "build:bar" (build) task
  // { msg: 'task options' }
};
```

综上所得：

- 多目标模式，可以让任务根据配置形成多个子任务， 使用 grunt.registerMultiTask 注册多任务模式，并且可以拿到子任务的配置（例如：data 和 options）

插件的使用

- grunt 的插件都是以 grunt-开头的插件 （例如：grunt-babel,grunt-sass,grunt-contrib-watch）

```js
// 1. 安装所需的插件
yarn add grunt 	-D              // grunt插件
yarn add load-grunt-tasks -D    // 自动加载所有的 grunt 插件中的任务
yarn add grunt-babel @babel/core @babel/preset-env -D // 安装babel插件用来解析js文件
yarn add grunt-sass sass	-D      // 安装sass插件用来解析sass文件
yarn add grunt-contrib-watch -D  // watch的使用会自动监听修改，并grunt自动构建

// 2. 配置 gruntfile.js 文件
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
```

综上所得：

- 我们要使用什么插件就去网上找 [grunt 插件](https://www.gruntjs.net/plugins)的使用
- 然后在 grunt.intiConfig 中配置 grunt 插件所需要的参数
- 然后在加载进来这些插件模块
- 最后注册任务使用这些插件(任务)
- [网上 grunt 插件的使用](https://www.cnblogs.com/haogj/p/4898349.html)
- [grunt 自动化构建](https://www.cnblogs.com/imwtr/p/4668186.html)

文件路劲的处理

实现常用的构建任务

## 3.2 Gulp

基本使用

```js
// 1. 安装 gulp
yarn add gulp -D
// 2. 创建 gulpfile.js 文件，配置gulp
// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的
exports.task1 = (done) => {
  console.log("run task1");
  done(); // 标识任务执行完成
};

// default 是默认任务
// 在运行是可以省略任务名参数
exports.default = (done) => {
  console.log("run default");
  done();
};

// v4.0 之前需要通过 gulp.task() 方法注册任务
// const gulp = require("gulp");
// gulp.task("task2", (done) => {
//   console.log("run task2");
//   done();
// });
```

综上所得：

- gulp 导出的函数都会作为 gulp 的任务
- gulp 区别于 grunt 的是它所有的任务函数都是异步的，函数有个形参 done，done 执行标识任务执行完成
- yarn gulp 任务名(默认任务可以省略名称)

创建组合任务

- series 执行串行任务
- parallel 执行并行任务

```js
// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 2. gulp 组合任务的使用
const { series, parallel } = require("gulp");

// 创建任务1
const task1 = (done) => {
  console.log("run task1");
  done();
};

// 创建任务2
const task2 = (done) => {
  setTimeout(() => {
    console.log("run task2");
    done();
  }, 1000);
};

// 创建任务3
const task3 = (done) => {
  console.log("run task3");
  done();
};

// 创建串行任务队列
exports.seriesTask = series(task1, task2, task3);
// 执行 yarn gulp seriesTask 输入如下
// [17:05:22] Starting 'seriesTask'...
// [17:05:22] Starting 'task1'...
// run task1
// [17:05:22] Finished 'task1' after 1.96 ms
// [17:05:22] Starting 'task2'...
// run task2
// [17:05:23] Finished 'task2' after 1.01 s
// [17:05:23] Starting 'task3'...
// run task3
// [17:05:23] Finished 'task3' after 2.98 ms
// [17:05:23] Finished 'seriesTask' after 1.04 s

// 创建并行任务队列
exports.parallelTask = parallel(task1, task2, task3);
// 执行 yarn gulp parallelTask
// [17:06:29] Starting 'parallelTask'...
// [17:06:29] Starting 'task1'...
// [17:06:29] Starting 'task2'...
// [17:06:29] Starting 'task3'...
// run task1
// [17:06:29] Finished 'task1' after 3.54 ms
// run task3
// [17:06:29] Finished 'task3' after 4.25 ms
// run task2
// [17:06:30] Finished 'task2' after 1.01 s
// [17:06:30] Finished 'parallelTask' after 1.04 s
```

通过上面代码得出：

- series 串行任务是一个任务执行完，再执行后面的任务
- parallel 并行任务是一起执行

异步任务的三种方式，如下代码所示:

```js
// 3. gulp 异步任务的几种方式

// 3.1 done方式
exports.callback = (done) => {
  console.log("run callback");
  done(); // 标识任务执行完成
};

exports.callback_error = (done) => {
  console.log("run callback_error");
  done(new Error("callback_error failed"));
};

// 3.2 promise方式
exports.promise = () => {
  console.log("run promise");
  return Promise.resolve();
};
exports.promise_error = () => {
  console.log("run promise_error");
  return Promise.rejecgt(new Error("promise_error failed"));
};

// 3.3 async+await方式
const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
exports.async = async () => {
  await timeout(1000);
  console.log("run async");
};
```

构建过程核心工作原理

![avatar](../images/构建过程核心工作原理.png)

流式构建系统

![avatar](../images/构建过程核心工作原理02.png)

```js
// 3. gulp 构建过程

const fs = require("fs"); // 引入node的fs核心模块
const { Transform } = require("stream"); // 引入node的strem核心模块

exports.default = () => {
  // 创建文件读取流
  const readStream = fs.createReadStream("normalize.css");

  // 创建文件写入流
  const writeStream = fs.createWriteStream("normalize.min.css");

  // 创建文件转换流
  const transformStream = new Transform({
    // 核心转换过程
    // 在此对读取流文件进行逻辑操作   (例如：css,js,html文件压缩，es6+转换成es5等等)
    transform: (chunk, encoding, callback) => {
      const input = chunk.toString(); // 获取读取的文件
      // 去除掉input内容的空格和注释
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");
      callback(null, output);
    },
  });

  // 通过pipe管道将一个流输入到另外一个流
  return readStream
    .pipe(transformStream) // 转换
    .pipe(writeStream); // 写入

  // 最后当读取流读取完成内部会执行done方法来标识任务完成
  // read.on('end', () => {
  //     done()
  //   })
};
```

文件操作 API + 插件的使用

```js
```

Gulp 自动化构建案例

- 样式文件编译任务
- 脚本文件编译任务
- 页面文件编译任务
- 图片和字体文件的转换
- 其他文件及文件清除
- 自动加载插件
- 热更新开发服务器
- 监视变化以及构建过程优化
- useref 文件引用处理
- 分别压缩 HTML、CSS、JavaScript
- 重新规划构建过程
- 补充

封装自动化构建工作流

![avatar](../images/封装自动化构建流01.png)

![avatar](../images/封装自动化构建流01.png)

- 提取 Gulpfile 到模块
- 解决模块中的问题
- 抽象路劲配置
- 包装 Gulp CLI
- 发布并使用模块
- 总结

## 3.3 FIS

基本使用

高度集成

编译与压缩
