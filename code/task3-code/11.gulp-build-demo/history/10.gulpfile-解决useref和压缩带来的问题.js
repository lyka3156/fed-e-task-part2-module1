// 导出的函数就是一个任务
// gulp 中的任务都是异步任务

const { src, dest, watch } = require("gulp");

const dataConfig = require("./data.config.js"); // 引入数据

const loadPlugins = require("gulp-load-plugins"); // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
const plugins = loadPlugins(); // plugins的属性就是page.json中的gulp插件

const del = require("del"); // 清除目录的插件

const browserSync = require("browser-sync"); // 开发服务器插件
const bs = browserSync.create(); // 创建bs

const serverPath = "temp"; // 开发环境的目录        只有js,css,html会变动的文件才存到temp中(开发服务器/开发环境)
const buildPath = "dist"; // 打包之后的目录         打包发布的时候,最终生成的目录(生产环境)

// 移除打包目录的任务
const clean = () => del([serverPath, buildPath]);

// 样式编译的任务
const style = () =>
  src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" })) // webpack的sass配置
    .pipe(dest(serverPath))
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
    .pipe(dest(serverPath))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下

// 页面模板的编译的任务
const page = () =>
  src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data: dataConfig.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(serverPath))
    .pipe(bs.reload({ stream: true })); // bs以流的形式重新加载一下

// 图片编译的任务
const image = () =>
  src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest(buildPath));

// 字体编译的任务
const font = () =>
  src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest(buildPath));

// 额外文件的任务(原封不动拷贝过去)
const extra = () => src("public/**", { base: "public" }).pipe(dest(buildPath));

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
      baseDir: [serverPath, "src", "public"], // 开发环境的时候使用temp目录的js,css,html
      // 路由映射   为了解决打包后的文件引用不到node_modules中的模块 (/node_modules/bootstrap/dist/css/bootstrap.css)
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

// useref任务: (将HTML引用的多个CSS和JS合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。)
// gulp-useref根据注释将HTML中需要合并压缩的区块找出来，对区块内的所有文件进行合并。
// html中的注释格式如下
// <!-- build:css assets/styles/vendor.css -->
// <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
// <!-- endbuild -->
const useref = () =>
  // 生成环境将temp目录的文件进行合并压缩编译到dist目录
  src("temp/*.html", { base: serverPath })
    .pipe(plugins.useref({ searchPath: [serverPath, "."] }))
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
    .pipe(dest(buildPath));

module.exports = {
  clean,
  style,
  script,
  page,
  image,
  font,
  extra,
  server,
  useref,
};
