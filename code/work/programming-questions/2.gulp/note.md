

# 1. Gulp 完成项目的自动化构建

- 前期安装插件

```js
yarn add gulp -D    // gulp核心插件
yarn add gulp-load-plugins -D   // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
```

- 样式文件编译任务

```js
// 1. 安装插件
yarn add gulp-sass -    // 编译 sass
// 2. 样式编译的任务
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist'));
}
```

- 脚本文件编译任务

```js
// 1. 安装插件
yarn add gulp-babel -D      // 使用 babel 编译 JS 文件
yarn add @babel/core @babel/preset-env @babel/plugin-proposal-class-properties -D    // babel的辅助插件
// 2. 脚本编译的任务
const script = () => {
    return src("src/assets/scripts/*.js", { base: "src" })
        .pipe(plugins.babel({ presets: ["@babel/preset-env"], plugins: ["@babel/plugin-proposal-class-properties"] }))  // webpack的babel配置
        .pipe(dest("dist"));
}

```

- 页面模板文件编译任务

```js
// 1. 安装插件
yarn add gulp-swig -D   // swig 一个简单的，强大的，可扩展的JavaScript模板引擎。
yarn add bootstrap jquery popper.js // 辅助index.html页面布局的插件

// 2. 页面模板的编译的任务
const page = () => src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest('dist'))
```

- 图片和字体文件的转换

```js
// 1. 安装插件
yarn add gulp-imagemin -D // 压缩jpg、png、gif等图片的gulp插件
// 2.图片编译的任务
const image = () =>
  src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));

// 3.字体编译的任务
const font = () =>
  src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
```

- 其他文件及文件清除

```js
// 1. 安装插件
yarn add del  -D  // 清除目录
// 2. 移除打包目录的任务
const clean = () => del(["dist"]);
// 3.额外文件的任务(原封不动拷贝过去)
const extra = () => src("public/**", { base: "public" }).pipe(dest("dist"));
```

- 自动加载插件

```js
// 1. 安装插件
yarn add gulp-load-plugins -D   // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
// 2. 使用插件
const loadPlugins = require("gulp-load-plugins"); // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
const plugins = loadPlugins(); // plugins的属性就是page.json中的gulp插件
// plugins.插件名
```

- 热更新开发服务器

```js
// 1. 安装插件
yarn add browser-sync -D        // 开发服务器
// 2. 热更新开发服务器的任务
const server = () => {
  // 初始化服务器的配置
  bs.init({
    port: 2080,
    open: false, // 是否打开浏览器
    server: {
      // 以哪个目录为静态服务器的目录   (从左往右依次查找资源)
      // dist   打包之后的目录  (上线的代码)
      // src    源代码目录      (开发的代码)
      // public 静态资源目录    (开发上线都需要的代码)
      baseDir: ["dist", "src", "public"],
      // 路由映射   为了解决打包后的文件引用不到node_modules中的模块 (/node_modules/bootstrap/dist/css/bootstrap.css)
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};
```

通过上面的配置的服务器只是静态服务器，style script page image font 的 变化之后还是之前的展示的内容，不是最新修改的内容，为了解决上面的问题需要用到 gulp 的 watch 来监听文件的变化来触发指定的任务重新编译文件，达到实时编译预览的效果。

- 监视变化以及构建过程优化

```js
// 1. 引入watch
const { src, dest, watch } = require("gulp");

// 样式编译的任务
const style = () =>
  src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" })) // webpack的sass配置
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下

// 脚本编译的任务
const script = () =>
  src("src/assets/scripts/*.js", { base: "src" })
    .pipe(
      plugins.babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      })
    ) // webpack的babel配置
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下

// 页面模板的编译的任务
const page = () =>
  src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data: dataConfig.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下

// 热更新开发服务器的任务
const server = () => {
  // 2. 监听指定的文件变化，变化之后找对应的任务重新编译生成最新的文件，并且对应的任务需要bs.reload重新加载一下，不然看不到效果
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);

  // 图片和字体以及静态资源就不需要重新执行对应的任务了
  // 因为他们仅仅只是拷贝过去和压缩，没有对其进行特殊的操作，所以不需要执行对应的任务，只需要bs.reload一下就可以了
  // 开发环境可以使用src的资源
  // 生产环境，执行一下对应的任务，然后使用dist打包之后的资源
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  // 初始化服务器的配置
  bs.init({
    port: 2080,
    open: false, // 是否打开浏览器
    server: {
      // 以哪个目录为静态服务器的目录   (从左往右依次查找资源)
      // dist   打包之后的目录  (上线的代码)
      // src    源代码目录      (开发的代码)
      // public 静态资源目录    (开发上线都需要的代码)
      baseDir: ["dist", "src", "public"],
      // 路由映射   为了解决打包后的文件引用不到node_modules中的模块 (/node_modules/bootstrap/dist/css/bootstrap.css)
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};
```

- useref 文件引用处理

  [gulp-userref 的使用例子](https://www.cnblogs.com/jiaoshou/p/12040144.html)

```js
// 1. 安装插件
yarn add gulp-useref -D   // 将HTML引用的多个CSS和JS合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。
// 2. useref任务: (将HTML引用的多个CSS和JS合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。)
// gulp-useref根据注释将HTML中需要合并压缩的区块找出来，对区块内的所有文件进行合并。
// html中的注释格式如下
// <!-- build:css assets/styles/vendor.css -->
// <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
// <!-- endbuild -->
const useref = () =>
  src("dist/*.html", { base: "dist" })
    .pipe(plugins.useref({ searchPath: ["dist", "."] }))
    .pipe(dest("dist"));
```

上面是在 gulpfile.js 中的调用代码，但是还需要在 HTML 写一些代码配合使用，下面我们就来看看在 html 中需要怎么配合使用。

```html
<!-- build:<type>(alternate search path) <path> <parameters> -->
... HTML Markup, list of script / link tags.
<!-- endbuild -->
```

> - type (键入): 可以是 js ，css 或 remove ; remove 将完全删除构建块，而不会生成文件
> - alternate search path (替代搜索路径):（可选）默认情况下，输入文件是相对于已处理文件的。替代搜索路径允许更改此路径。该路径还可以包含使用
>   JSON 大括号数组表示法（例如）从右到左处理的一系列路径<!-- build:js({path1,path2}) js/lib.js -->。
> - path: 优化文件的文件路径，目标输出
> - parameters(参数): 应该添加到标签中的其他参数

完整形式的示例如下所示：

```html
<!-- build:css assets/styles/vendor.css -->
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
<!-- endbuild -->
<!-- build:css assets/styles/main.css -->
<link rel="stylesheet" href="assets/styles/main.css" />
<!-- endbuild -->
```

生成的 HTML 将是：

```html
<link rel="stylesheet" href="assets/styles/vendor.css" />
<link rel="stylesheet" href="assets/styles/main.css" />
```

- 分别压缩 HTML、CSS、JavaScript

```js
// 1. 安装
yarn add gulp-htmlmin -D  // 压缩html
yarn add gulp-clean-css -D  // 压缩css
yarn add gulp-uglify -D   // 压缩js
yarn add gulp-if -D   // 如果要压缩或执行其他一些修改，则可以使用 gulp-if 有条件地处理特定类型的资产。

// 2. 使用useref将HTML引用的多个CSS和JS合并起来之后 再压缩 html,css,js
const useref = () =>
  src("dist/*.html", { base: "dist" })
    .pipe(plugins.useref({ searchPath: ["dist", "."] }))
    // 这里执行压缩css,js的代码
    .pipe(plugins.if(/\.js$/, plugins.uglify())) // 压缩js
    .pipe(plugins.if(/\.css$/, plugins.cleanCss())) // 压缩css
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          // 压缩html
          collapseWhitespace: true, // 去掉空格
          minifyCSS: true, // 小型css
          minifyJS: true, // 小型js
        })
      )
    )
    .pipe(dest("dist"));

// 3. 通过上述使用 yarn gulp server的时候，如果重新修改html,css,js就会重新执行对应的任务进行编译，编译之后的文件又会替换调上面useref合并和压缩插件之后的文件，为了解决上面的问题，我们在开发(开发环境)的时候把编译之后的html,css,js的存到temp目录上,等到打包合并和压缩阶段(生产环境)再将temp目录编译到dist。需要改的代码如下所示


// 移除打包目录的任务
const clean = () => del(["temp", "dist"]);      // 1. 清空目录的时候多加个temp目录

// 样式编译的任务
const style = () =>
  src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"))                     // 2. 将style输出到temp中
    .pipe(bs.reload({ stream: true }));

// 脚本编译的任务
const script = () =>
  src("src/assets/scripts/*.js", { base: "src" })
    .pipe(
      plugins.babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      })
    )
    .pipe(dest("temp"))          // 3. 将js输出到temp中
    .pipe(bs.reload({ stream: true }));

// 页面模板的编译的任务
const page = () =>
  src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data: dataConfig.data, defaults: { cache: false } }))
    .pipe(dest("temp"))      // 4. 将html输出到temp中
    .pipe(bs.reload({ stream: true }));

// 热更新开发服务器的任务
const server = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  // 初始化服务器的配置
  bs.init({
    port: 2080,
    open: false,
    server: {
      baseDir: ["temp", "src", "public"], // 5. 开发环境的时候使用temp目录的js,css,html
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

// 合并并且压缩文件
const useref = () =>
  // 6. 生成环境将temp目录的文件进行合并压缩编译到dist目录
  src("temp/*.html", { base: "temp" })
    .pipe(plugins.useref({ searchPath: ["temp", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest("dist"));
```

- 重新规划构建过程

```js
// 1. 我们开发的时候会分开发环境和生成环境
// 并行编译css,js,html的任务
const compile = parallel(style, script, page);

// 1.1. 配置开发环境     (串行任务)
// 1. 把css,js,html编译成浏览器支持的语法
// 2. 开启静态服务器运行项目
const dev = series(clean, compile, server);

// 1.2 配置生产环境     (串行任务执行)
// 1. 先把之前打包的目录删除
// 2. 并行处理以下任务
// 2.1 把css,js,html编译成浏览器支持的语法，然后合并html中引入的资源，以及压缩css,js,html    这个是并行的任务
// 2.2 将图片和字体压缩一下放到打包目录
// 2.3 把静态资源拷贝到打包目录
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

module.exports = {
  dev,
  build,
};

// 2. 最后在packpage.json 中配置脚本
// yarn dev -> yarn gulp dev
// yarn build -> yarn gulp build
"scripts": {
  "dev": "yarn gulp dev",
  "build": "yarn gulp build"
}
```

[gulp构建项目](https://blog.csdn.net/guang_s/article/details/84673204)

- 使用watch实现按需刷新
``` js
// 样式编译的任务
const style = doneOrFileName => {
  console.log("styleFileName", doneOrFileName);
  // fileName默认是done函数就编译"src/assets/styles/*.scss"，如果是字符串就代表watch监听的莫个文件("src/assets/styles/index.scss")改变了,按需更新
  let fileName = typeof (doneOrFileName) === "string" ? doneOrFileName : "src/assets/styles/*.scss";
  return src(fileName, { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" })) // webpack的sass配置
    .pipe(dest(serverPath))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下
}


// 脚本编译的任务
const script = doneOrFileName => {
  console.log("scriptFileName", doneOrFileName);
  // fileName默认是done函数就编译"src/assets/scripts/*.js"，如果是字符串就代表watch监听的莫个文件(src/assets/scripts/main.js)改变了,按需更新
  let fileName = typeof (doneOrFileName) === "string" ? doneOrFileName : "src/assets/scripts/*.js";
  return src(fileName, { base: "src" })
    .pipe(
      plugins.babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      })
    ) // webpack的babel配置
    .pipe(dest(serverPath))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下
}


// 页面模板的编译的任务
const page = doneOrFileName => {
  console.log("pageFileName", doneOrFileName);
  // fileName默认是done函数就编译"src/*.html"，如果是字符串就代表watch监听的莫个文件(src\index.html)改变了,按需更新
  let fileName = typeof (doneOrFileName) === "string" ? doneOrFileName : "src/*.html";
  return src(fileName, { base: "src" })
    .pipe(plugins.swig({ data: dataConfig.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(serverPath))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下
}

// 热更新开发服务器的任务
const server = () => {
  // 2. 监听指定的文件变化，变化之后找对应的任务重新编译生成最新的文件，并且对应的任务需要bs.reload重新加载一下，不然看不到效果
  // watch("src/assets/styles/*.scss").on("change", (fileName) => style(fileName));     // 使用次方式会造成scss内部引入的样式文件改变不会触发。
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js").on("change", (fileName) => script(fileName));
  watch("src/*.html").on("change", (fileName) => page(fileName));

  // 图片和字体以及静态资源就不需要重新执行对应的任务了
  // 因为他们仅仅只是拷贝过去和压缩，没有对其进行特殊的操作，所以不需要执行对应的任务，只需要bs.reload一下就可以了
  // 开发环境可以使用src的资源
  // 生产环境，执行一下对应的任务，然后使用dist打包之后的资源
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  // 初始化服务器的配置
  bs.init({
    port: 2080,
    open: false, // 是否打开浏览器
    server: {
      // 以哪个目录为静态服务器的目录   (从左往右依次查找资源)
      // dist   打包之后的目录  (上线的代码)
      // src    源代码目录      (开发的代码)
      // public 静态资源目录    (开发上线都需要的代码)
      baseDir: [serverPath, "src", "public"], // 开发环境的时候使用temp目录的js,css,html
      // 路由映射   为了解决打包后的文件引用不到node_modules中的模块 (/node_modules/bootstrap/dist/css/bootstrap.css)
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};
```
综上所得：是通过watch监听change方法来知道到底是哪个文件改变了，然后触发任务只编译改变的文件。
