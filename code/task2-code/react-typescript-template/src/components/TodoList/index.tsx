import * as React from "react";
import { connect } from "react-redux";
import Store from "../../store/types"; // state的类型
import * as actions from "../../store/actions/todoList"; // actions
const { useState, useEffect } = React;
interface Props {
  todoList: Array<any>;
  addTodo: any;
  removeTodo: any;
}

const TodoList = function (props: Props) {
  // console.log(props);
  const { todoList, addTodo, removeTodo } = props;
  let [value, changeInput] = useState("");
  // 双向绑定输入框input中的值
  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInput(e.target.value);
  };
  // 向todoList中添加值
  const handleAdd = () => {
    addTodo(value);
    changeInput("");
  };
  // 向todoList中移除莫个值
  const handleRemove = (index: number) => {
    removeTodo(index);
  };
  return (
    <div>
      {/* 渲染todoList */}
      {todoList &&
        todoList.map((item, index) => {
          return (
            <p key={index}>
              {item}
              <button
                onClick={() => {
                  handleRemove(index);
                }}
              >
                移除
              </button>
            </p>
          );
        })}
      <input onChange={handelChange} value={value} placeholder="请输入"></input>
      <button onClick={handleAdd}>添加</button>
    </div>
  );
};

export default connect((state: Store) => state.todoList, actions)(TodoList);
