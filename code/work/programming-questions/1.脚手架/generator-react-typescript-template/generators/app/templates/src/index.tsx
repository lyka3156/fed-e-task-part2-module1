import * as React from "react";
import * as ReactDOM from "react-dom";
import Counter from "./components/Counter"; // 引入Counter组件
import TodoList from "./components/TodoList"; // 引入TodoList组件
import store from "./store"; // 引入store仓库
import { Provider } from "react-redux"; // redux和react的桥梁
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // 引入react-router

import { ConnectedRouter } from "connected-react-router"; // 联接react-router和redux的桥梁    (替代BrowserRouter as Router)
import history from "./store/history"; // 指定history对象
ReactDOM.render(
  // 提供store
  <Provider store={store}>
    {/* <Router> */}
    <ConnectedRouter history={history}>
      <p>
        <Link to="/counter">counter</Link>
      </p>
      <p>
        <Link to="todoList">todoList</Link>
      </p>
      <Route path="/counter" component={Counter} />
      <Route path="/todoList" component={TodoList} />
    </ConnectedRouter>
    {/* </Router> */}
  </Provider>,
  document.getElementById("root")
);
