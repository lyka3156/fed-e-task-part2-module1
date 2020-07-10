// 导出的函数就是一个任务
// gulp 中的任务都是异步任务

const { src, dest, watch } = require("gulp");

const dataConfig = require("./data.config.js"); // 引入数据

const loadPlugins = require("gulp-load-plugins"); // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
const plugins = loadPlugins(); // plugins的属性就是page.json中的gulp插件

const del = require("del"); // 清除目录的插件

const browserSync = require("browser-sync"); // 开发服务器插件
const bs = browserSync.create(); // 创建bs

// 移除打包目录的任务
const clean = () => del(["dist"]);

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

// 图片编译的任务
const image = () =>
  src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));

// 字体编译的任务
const font = () =>
  src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));

// 额外文件的任务(原封不动拷贝过去)
const extra = () => src("public/**", { base: "public" }).pipe(dest("dist"));

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

module.exports = {
  clean,
  style,
  script,
  page,
  image,
  font,
  extra,
  server,
};
