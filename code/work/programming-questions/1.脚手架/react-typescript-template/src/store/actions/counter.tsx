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

// 4. 异步actions
export function incrementAsync(): any {
  return (dispatch: any, getState: any) => {
    // 隔1秒后调用同步increment方法
    setTimeout(function () {
      dispatch({
        type: INCREMENT,
      });
    }, 1000);
  };
}
export function decrementAsync(): any {
  return (dispatch: any, getState: any) => {
    // 隔1秒后调用同步decrement方法
    setTimeout(function () {
      dispatch({
        type: DECREMENT,
      });
    }, 1000);
  };
}

// 5. 通过connected-react-router在actions中跳转router
export function goTodoList(): any {
  return push("/todoList");
}
