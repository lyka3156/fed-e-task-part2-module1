// 默认导出一个函数， 函数有个形参 grunt, grunt 对象中提供一些创建任务时会用到的 API

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
