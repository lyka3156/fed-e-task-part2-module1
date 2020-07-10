// 导出的函数就是一个任务
// gulp 中的任务都是异步任务

const { src, dest } = require("gulp");

const loadPlugins = require("gulp-load-plugins"); // 自动加载 package.json 中的 gulp 插件，避免一个个require插件
const plugins = loadPlugins(); // plugins的属性就是page.json中的gulp插件

// 样式编译的任务
const style = () =>
  src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" })) // webpack的sass配置
    .pipe(dest("dist"));

module.exports = {
  style,
};
