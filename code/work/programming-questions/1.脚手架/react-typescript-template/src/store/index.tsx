import { createStore,applyMiddleware } from "redux"; // 引入redux模块
import reduces from "./reducers"; // 引入管理员reduces
import thunk from "redux-thunk";        // 引入thunk中间件      处理redux异步操作
import logger from "redux-logger";      // 引入logger中间件

import history from "./history";        // 引入history
import { routerMiddleware } from "connected-react-router";  // 通过routerMiddleware方法创建redux的中间件
let router = routerMiddleware(history);     // 创建router中间件

// 创建store仓库
// let store = createStore(reduces,applyMiddleware(thunk,logger));
let store = createStore(reduces,applyMiddleware(router,thunk,logger));

export default store;
