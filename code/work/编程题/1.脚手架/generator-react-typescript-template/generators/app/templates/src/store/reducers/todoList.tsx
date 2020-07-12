import { ADDTODO, REMOVETODO } from "../action-types";
// import { Store } from "../types"; // 引入store的类型
import { TodoList } from "../types"; // 引入store的类型
import { Action } from "../actions/todoList"; // 引入action的类型

// 声明reduces管理员用来管理状态
export default function (state: TodoList = { todoList: [] }, action: Action) {
  switch (action.type) {
    case ADDTODO:
      return { ...state, todoList: [...state.todoList, action.data] };
    case REMOVETODO:
      state.todoList.splice(action.index, 1);
      return {
        ...state,
        todoList: [...state.todoList],
      };
    default:
      return state;
  }
}
