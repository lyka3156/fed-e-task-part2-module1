// 默认导出一个函数， 函数有个形参 grunt, grunt 对象中提供一些创建任务时会用到的 API

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
