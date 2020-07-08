// 此文件作为 Generator 的核心入口
// 1. 需要导出一个继承自 Yeoman Generator 的类型
// 2. Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require("yeoman-generator");

// 步骤1    导出继承自 Yeoman Generator 的类型
module.exports = class extends Generator {
  // 步骤2  通过调用类型的一些生命周期方法

  // promting生命周期 Yeoman 在询问用户环节会自动调用此方法
  prompting() {
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: "input",
        name: "title", // 变量名
        message: "Your project name", // 提示信息
        default: this.appname, // appname 为项目生成目录名称
      },
    ]).then((answers) => {
      // answers  => {title:"用户输入的内容"}
      this.userInputObj = answers; // 接受用户输入的信息
    });
  }

  // writing生命周期 Yeoman 自动在生成文件阶段调用此方法
  writing() {
    // 3. 在这些生命周期方法中实现自己的功能

    // 1) 在这里尝试在项目目录中写入文件
    // this.fs 和 node.js 的fs 模块不一样，这个fs是高度封装的,功能更加强大些
    this.fs.write(this.destinationPath("1.txt"), Math.random().toString());

    // 2) 通过模板方式写入文件到目标目录   (大大提高了效率)

    // 模板文件路径
    const tmpl = this.templatePath("2.txt");
    // 输出目标路径
    const output = this.destinationPath("2.txt");
    // 模板数据上下文
    const context = this.userInputObj; // this.userInputObj  为用户在cmd中输入的内容
    // 将模板文件自动映射到输出文件中
    this.fs.copyTpl(tmpl, output, context);

    // -------------------------------------------------------

    // 模板文件路径
    const tmpl2 = this.templatePath("index.html");
    // 输出目标路径
    const output2 = this.destinationPath("index.html");
    // 模板数据上下文
    const context2 = this.userInputObj; // this.userInputObj  为用户在cmd中输入的内容
    // 将模板文件自动映射到输出文件中;
    this.fs.copyTpl(tmpl2, output2, context2);
  }
};
