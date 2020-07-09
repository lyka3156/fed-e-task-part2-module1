
// 导出的函数就是一个任务
// gulp 中的任务都是异步任务


const { src, dest, series, parallel } = require("gulp");

const loadPlugins = require("gulp-load-plugins");           // 引入自动加载 gulp 的插件的模块

const plugins = loadPlugins();              // 里面包含所有的 gulp插件
const data = require("./data.js");

// 编译css的任务
const style = () =>
    src("src/assets/styles/*.scss", { base: "src" })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))    // webpack的sass配置
        .pipe(dest("dist"));


// 编译js脚本的任务
const script = () =>
    src("src/assets/scripts/*.js", { base: "src" })
        .pipe(plugins.babel({ presets: ["@babel/preset-env"], plugins: ["@babel/plugin-proposal-class-properties"] }))  // webpack的babel配置
        .pipe(dest("dist"));

// 编译html的任务
const page = () => src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest('dist'))

module.exports = {
    style,
    script,
    page
}


