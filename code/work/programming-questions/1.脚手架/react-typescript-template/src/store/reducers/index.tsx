import { combineReducers } from "redux";
import counter from "./counter"; // 引入counter的管理员
import todoList from "./todoList"; // 引入todoList的管理员
import history from "../history";   // 引入history
import {connectRouter} from "connected-react-router";

// combineReducers整合所有reduces
let reduces = combineReducers({
  router: connectRouter(history),     // 注册管理router的管理员
  counter,
  todoList,
});

export default reduces;
