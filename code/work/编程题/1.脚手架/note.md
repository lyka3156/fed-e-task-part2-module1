
# 1.脚手架实现的过程

以创建一个react项目(并且内部手动配置了ts,redux,redux-thunk) 基础的脚手架为例

## 1. 需要创建一个指定类型的模板项目，我们可以在项目中加入公共的配置 (例如 ts,redux,redux-thunk)
## 2. 创建一个generator的脚手架项目
## 3. 将之前创建的react模板项目放到generator的脚手架项目中
## 4. 在脚手架项目中配置一些用户输入(例如:项目名称，项目版本...)，通过用户的输入我们可以创建一个指定的react项目
## 5. 在脚手架项目中生成目录的时候把上面的react模板项目输出到生成的目录中
## 6. 使用 yarn/npm link 链接到全局，便于我们本地测试脚手架的功能
## 7. 最后没问题就把我没写的脚手架 yarn/npm publish 到npm仓库

以下就是脚手架实现的具体工程:
```js
// 1. 创建一个 react的项目  react-typescript-template
create-react-app react-typescript-template
// 2. 可以加入一些重复的配置  例如: (redux,ts,redux-thunk...)
// 这个项目结构会把重复使用的代码包含在里面


// 3. 然后我们封装一个全新的generatro用于去生成一个这样理想的项目结构
// 3.1 创建一个generator的目录结构    创建目录
mkdir generator-react-typescript-template

// 2. 初始化项目依赖
yarn init -y

// 3. 安装generator生成器的基类,这个基类提供一些工具函数让我们在对创建生成器的时候更加便捷
yarn add yeoman-generator

// 4. 创建generators/template模块目录将react-typescript-template目录所以文件放到这里

// 5. 在项目中创建一个generators/app的文件夹
// index.js 文件作为 Generator 的核心入口
// 1. 需要导出一个继承自 Yeoman Generator 的类型
// 2. Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入


// 6. 在index.js文件中把templates目录的所有文件全部写到生成器生成的文件中
const Generator = require("yeoman-generator");
module.exports = class extends Generator {

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

// 7. yarn link 把这个模块链接到全局范围使之成为全局模块包，这样yo就能找到我们些的generator-sample(我们自己写的generator包)了

// 6. 创建一个目录 test-generator-react-typescript-template 用来测试我们自己写的 generator(generator-react-typescript-template)
// 在命令行中运行  yo sample就可以运行react-typescript-template 就会生成我们react项目的基本结构了  (也就是上面的react-typescript-template的目录结构)

// 7. 注意：如果生成的项目目录有 <%= name %> ejs模板方式 需要改成 <%%= name %>
```