import Counter from "./counter";
import TodoList from "./todoList";

// 1. 默认导出store总仓库的类型校验
// important Store from "../" 引入
export default interface Store {
  counter: Counter;
  todoList: TodoList;
}

// 2.导出指定仓库的类型校验
// important {Counter,TodoList} from "../" 引入
export {
  Counter,        
  TodoList
}
