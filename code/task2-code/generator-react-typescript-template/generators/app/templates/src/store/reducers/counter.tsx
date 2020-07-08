import { INCREMENT, DECREMENT } from "../action-types";
// import { Store } from "../types"; // 引入store的类型
import { Counter } from "../types"; // 引入store的类型
import { Action } from "../actions/counter"; // 引入action的类型

// 声明reduces管理员用来管理状态
export default function (state: Counter = { number: 0 }, action: Action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, number: state.number + 1 };
    case DECREMENT:
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
}
