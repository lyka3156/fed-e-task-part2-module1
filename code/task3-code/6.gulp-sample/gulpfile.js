// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 1. gulp 的基本使用
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
