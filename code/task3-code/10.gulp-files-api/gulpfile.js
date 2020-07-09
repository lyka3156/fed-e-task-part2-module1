// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 3. gulp 文件操作 API + 插件的使用

const { src, dest } = require("gulp");
const cleanCss = require("gulp-clean-css"); // 压缩css的插件
const rename = require("gulp-rename"); // 文件重命名

exports.default = () => {
  return src("src/*.css") // 读取流
    .pipe(cleanCss()) // 压缩css
    .pipe(rename({ extname: ".min.css" })) // 修改后缀名
    .pipe(dest("dist")); // 输入流
};
