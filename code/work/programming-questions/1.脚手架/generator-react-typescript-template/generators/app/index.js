// 此文件作为 Generator 的核心入口
// 1. 需要导出一个继承自 Yeoman Generator 的类型
// 2. Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

// 引入generator基类
const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");
// const pathName = path.join(__dirname, "templates");
// console.log(pathName);

// 步骤1    导出继承自 Yeoman Generator 的类型
module.exports = class extends Generator {
  // 步骤2  在对应的生命周期里面编写自己的功能

  // 接受用户输入时调用此方法
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // appname就是项目名称
      },
    ]).then((answers) => {
      // 保存用户输入的信息
      this.inputObj = answers;
    });
  }

  // 在生成文件阶段调用此方法
  writing() {
    // 把每一个文件都通过模板转换到目标路径
    const templates = [
      "note.md",
      "tsconfig.json",
      "webpack.config.js",
      "yarn.lock",
      ".gitignore",
      "package.json",
      "src/index.html",
      "src/index.tsx",
      "src/components/Counter/index.tsx",
      "src/components/TodoList/index.tsx",
      "src/store/action-types.tsx",
      "src/store/history.tsx",
      "src/store/index.tsx",
      "src/store/actions/counter.tsx",
      "src/store/actions/todoList.tsx",
      "src/store/reducers/index.tsx",
      "src/store/reducers/counter.tsx",
      "src/store/reducers/todoList.tsx",
      "src/store/types/index.tsx",
      "src/store/types/counter.tsx",
      "src/store/types/todoList.tsx",
    ];

    // const dirs = [];
    // const pathName = path.join(__dirname, "templates");
    // console.log(pathName, 9999);
    // const files = fs.readSync(pathName, (err, files) => {
    //   console.log(files, 888888888);
    //   for (let i = 0, len = files.length; i < len; i++) {
    //     fs.stat(path.join(pathName, files[i]), (err, data) => {
    //       if (data.isFile()) {
    //         dirs.push(files[i]);
    //       }
    //     });
    //   }
    // });
    // console.log(dirs);

    templates.forEach((item) => {
      // item => 每个文件路径
      //   console.log(item);
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.inputObj
      );
    });
  }
};
