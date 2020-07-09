// 配置grunt

// 步骤1. grunt默认导出一个函数，函数里面有个grunt的参数
module.exports = (grunt) => {
  // 步骤2. grunt.initConfig() 用于为任务添加一些配置选项
  grunt.initConfig({
    // 键一般对应任务的名称
    // 值可以是任意类型的数据
    task1: {
      name: "我是任务1",
    },
  });

  // 步骤3  grunt.registerTask 是注册任务，通过这些任务实现你自己的功能
  // 注册默认任务 default
  // 通过 grunt 执行时可以省略          yarn grunt
  grunt.registerTask("default", () => {
    console.log("default task");
  });

  // 注册task1任务              yarn grunt task1
  grunt.registerTask("task1", () => {
    // 任务中可以使用 grunt.config() 获取配置
    console.log(grunt.config("task1"));
    // 如果属性值是对象的话，config 中可以使用点的方式定位对象中属性的值
    console.log(grunt.config("task1.name"));
  });
};
