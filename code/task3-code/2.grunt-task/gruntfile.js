// 默认导出一个函数， 函数有个形参 grunt, grunt 对象中提供一些创建任务时会用到的 API

// 注意：
// 注册的任务如果一样的话，后面注册的会覆盖前面注册的任务
// 注册的默认任务通过yarn grunt 执行，注册的其他任务通过 yarn grunt 任务名 去执行
// 注册任务指定的第二个参数如果是字符串或者数组的话,第三个参数并且不是一个函数的话，如果没有找到第二个参数的任务会报错

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
