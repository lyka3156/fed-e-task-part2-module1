# 3：提交时如果发现.gitignore 无效的话，可使用 git rm -r --cached .删除本地缓存，然后在进行提交

# 1. ts+react 项目

## 1.1 安装依赖

- @types 开头的包都是 typeScript 的声明文件，可以进入 node_modules/@types/XX/index.d.ts 进行查看
- [声明文件](https://github.com/DefinitelyTyped/DefinitelyTyped)

```js
yarn add react react-dom @types/react @types/react-dom react-router-dom @types/react-router-dom react-transition-group @types/react-transition-group react-swipe @types/react-swipe  -S
yarn add webpack webpack-cli webpack-dev-server html-webpack-plugin -D
yarn add typescript ts-loader source-map-loader -D
yarn add redux react-redux @types/react-redux redux-thunk  redux-logger @types/redux-logger -S
yarn add connected-react-router -S
```

- ts-loader 可以让 Webpack 使用 TypeScript 的标准配置文件 tsconfig.json 编译 TypeScript 代码。
- source-map-loader 使用任意来自 Typescript 的 sourcemap 输出，以此通知 webpack 何时生成自己的 sourcemaps,这让你在调试最终生成的文件时就好像在调试 TypeScript 源码一样。

## 1.2 支持 typescript

需要生成一个 tsconfig.json 文件来告诉 ts-loader 如何编译代码 TypeScript 代码

```js
yarn tsc --init
```

```js
{
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react"
  },
  "include": [
    "./src/**/*"
  ]
}
```

- outDir 指定输出目录
- sourceMap：把 ts 文件编译成 js 文件的时候，同时生成对应的 sourceMap 文件
- noImplicitAny：如果为 true 的话，TypeScript 编译器无法推断出类型时，它仍然会生成 JavaScript 文件，但是它也会报告一个错误
- module：代码规范
- target：转换成 es5
- jsx：react 模式会生成 React.createElement，在使用前不需要再进行转换操作了，输出文件的扩展名为.js
- include：需要编译的目录。

## 1.3 编写 webpack 配置文件

```js
const webpack = require("webpack"); // webpack插件
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html模板插件
const path = require("path");

// 手动配置 webpack 文件
module.exports = {
  mode: "development", //   开发模式 (production/development)
  entry: "./src/index.tsx", // 入口文件
  output: {
    // 输出目录
    filename: "bundle.js", // 输出文件名
    path: path.join(__dirname, "dist"), // 输出目录地址
  },
  devtool: "source-map", // devtool配置：可以更好的查看错误信息
  devServer: {
    // 开发服务器
    hot: true, // 开启热更新
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: {
      // 没有找到目录重定向指定页面
      index: "./index.html",
    },
  },
  resolve: {
    // 模块名称后面自动添加的后缀名
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  // 解析模块
  module: {
    rules: [
      // 解析.tsx模块的loader
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      // 解析.js模块的loader
      {
        enforce: "pre", // 前置loader在正常loader之前执行
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  plugins: [
    // 配置html模板
    new HtmlWebpackPlugin({
      template: "./src/index.html", // html模板路劲
      filename: "index.html", // 打包生成的html文件名
    }),
    // 开启热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

## 1.4 计数器组件

### 1.4.1 src/index.tsx

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import Counter from "./components/Counter";
ReactDOM.render(<Counter number={100} />, document.getElementById("root"));
```

### 1.4.2 components/Counter.tsx

src/components/Counter.tsx

```js
import * as React from "react";
export interface Props {
  number: number;
}
export default class Counter extends React.Component<Props> {
  render() {
    const { number } = this.props;
    return (
      <div>
        <p>{number}</p>
      </div>
    );
  }
}
```

## 1.5 使用 redux

-

## 1.6 合并多个 reduces

-

## 1.7 配置路由

### 1.7.1 src/index.tsx

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import Counter1 from "./components/Counter1";
import Counter2 from "./components/Counter2";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.Fragment>
        <Link to="/counter1">counter1</Link>
        <Link to="/counter2">counter2</Link>
        <Route path="/counter1" component={Counter1} />
        <Route path="/counter2" component={Counter2} />
      </React.Fragment>
    </Router>
  </Provider>,
  document.getElementById("root")
);
```

## 1.8 connected-react-router (redux 中的 action 可以操作 react 的 route 跳转)

[connected-react-router](https://github.com/supasate/connected-react-router)是一个绑定 react-router 到 redux 的组件，来实现双向绑定 router 的数据到 redux store 中，这么做的好处就是让应用更 Redux 化，可以在 action 中实现对路由的操作。  
[connected-react-router 在所有环境下开发案例](https://github.com/supasate/connected-react-router/tree/master/examples)
[知乎文章](https://zhuanlan.zhihu.com/p/93228510)

- 这个组件的关键就在于使用了 react-router 中的一个关键组件，也就是 ReactTraining/history，这个组件看了下文档，作者是这么解释的
  > The history library is a lightweight layer over browsers' built-in History and Location APIs. The goal is not to provide a full implementation of these APIs, but rather to make it easy for users to opt-in to different methods of navigation.
- 按照我的理解应该是对浏览器原本的 history 对象做了一定的增强，同时应该对 ReactNative 等环境做了一定的 polyfill。
- 使用 connected-react-router 这个库的关键点就在于创建合适的 history 对象

实现步骤如下：

- 1. 创建 history 对象

```js
//  store/history.tsx
import { createBrowserHistory } from "history"; // 引入创建history的工厂方法
// 创建history
const history = createBrowserHistory();
// 默认导出history对象  可以操作route的跳转
export default history;
```

- 2. 在 reduces 中注册管理 route 的 reduce 管理员

```js
// store/reuces/index.tsx
import { combineReducers } from "redux";
import counter from "./counter"; // 引入counter的管理员
import todoList from "./todoList"; // 引入todoList的管理员
import history from "../history"; // 引入history
import { connectRouter } from "connected-react-router";

// combineReducers整合所有reduces
let reduces = combineReducers({
  router: connectRouter(history), // 注册管理router的管理员
  counter,
  todoList,
});
export default reduces;
```

- 3. 在 store 中使用 router 中间件和将 redux 和 react-router 绑定

```js
// store/index.tsx
import { createStore, applyMiddleware } from "redux"; // 引入redux模块
import reduces from "./reducers"; // 引入管理员reduces
import thunk from "redux-thunk"; // 引入thunk中间件      处理redux异步操作
import logger from "redux-logger"; // 引入logger中间件

import history from "./history"; // 引入history
import { routerMiddleware } from "connected-react-router"; // 通过routerMiddleware方法创建redux的中间件
let router = routerMiddleware(history); // 创建router中间件

// 创建store仓库
// let store = createStore(reduces,applyMiddleware(thunk,logger));
let store = createStore(reduces, applyMiddleware(router, thunk, logger));

export default store;
```

- 4. 在 index.tsx 入口文件中使用 ConnectedRouter 替换 BrowserRouter

```js
// src/index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import Counter from "./components/Counter"; // 引入Counter组件
import TodoList from "./components/TodoList"; // 引入TodoList组件
import store from "./store"; // 引入store仓库
import { Provider } from "react-redux"; // redux和react的桥梁
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // 引入react-router

import { ConnectedRouter } from "connected-react-router"; // 联接react-router和redux的桥梁
import history from "./store/history"; // 指定history对象
ReactDOM.render(
  // 提供store
  <Provider store={store}>
    {/* <Router> */}
    <ConnectedRouter history={history}>
      <Link to="/counter">counter</Link>
      <Link to="todoList">todoList</Link>
      <Route path="/counter" component={Counter} />
      <Route path="/todoList" component={TodoList} />
    </ConnectedRouter>
    {/* </Router> */}
  </Provider>,
  document.getElementById("root")
);
```

- 5. 在 actions 中跳转 router

```js
// store/actions/counter.tsx
import { INCREMENT, DECREMENT } from "../action-types";
import { push } from "connected-react-router";
// 1. 将常量值定义为type变量的类型
export interface Increment {
  type: typeof INCREMENT;
}
export interface Decrement {
  type: typeof DECREMENT;
}
// 2. Action类型包括上面两种类型
export type Action = Increment | Decrement;
// 3. 定义store的动作的返回值类型
export function increment(): Increment {
  return { type: INCREMENT };
}
export function decrement(): Decrement {
  return { type: DECREMENT };
}
// 4. 通过connected-react-router在actions中跳转router
export function goTodoList(): any {
  return push("/todoList");
}
```

- 6. 在组件中使用 actions 的方法跳转

```js
import * as React from "react";
import { connect } from "react-redux";
import Store from "../../store/types"; // state的类型
import * as actions from "../../store/actions/counter"; // actions
const { useState, useEffect } = React;
// 定义属性接口
export interface Props {
  number: number;
  increment: any;
  decrement: any;
  goTodoList: any;
}
function Counter(props: Props) {
  console.log(props);
  const { number, increment, decrement, goTodoList } = props;
  const handleAdd = () => {
    increment();
  };
  const handleMinus = () => {
    decrement();
  };
  return (
    <div>
      <button onClick={handleMinus}>-</button>
      <p>{number}</p>
      <button onClick={handleAdd}>+</button>
      <br />
      <button onClick={goTodoList}>通过actions跳转route</button>
    </div>
  );
}
export default connect((state: Store) => state.counter, actions)(Counter);
```
