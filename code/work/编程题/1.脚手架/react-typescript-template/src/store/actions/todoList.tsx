import { ADDTODO, REMOVETODO } from "../action-types";

// 1. 将常量值定义为type变量的类型
export interface Addtodo {
  type: typeof ADDTODO;
  data: any;
}
export interface Reovetodo {
  type: typeof REMOVETODO;
  index: number;
}
// 2. Action类型包括上面两种类型
export type Action = Addtodo | Reovetodo;

// 3. 定义store的动作的返回值类型
export function addTodo(data: any): Addtodo {
  return { type: ADDTODO, data };
}
export function removeTodo(index: number): Reovetodo {
  return { type: REMOVETODO, index };
}
