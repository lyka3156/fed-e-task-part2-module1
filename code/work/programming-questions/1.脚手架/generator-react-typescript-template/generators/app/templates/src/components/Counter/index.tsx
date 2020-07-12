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
  incrementAsync: any;
  decrementAsync: any;
}

function Counter(props: Props) {
  console.log(props);
  const {
    number,
    increment,
    decrement,
    goTodoList,
    incrementAsync,
    decrementAsync,
  } = props;
  const handleAdd = () => {
    increment();
  };
  const handleMinus = () => {
    decrement();
  };
  return (
    <div>
      <button
        onClick={() => {
          decrementAsync();
        }}
      >
        async--
      </button>
      <button onClick={handleMinus}>--</button>
      <span>{number}</span>
      <button onClick={handleAdd}>++</button>
      <button
        onClick={() => {
          incrementAsync();
        }}
      >
        async++
      </button>
      <br />
      <button onClick={goTodoList}>通过actions跳转route</button>
    </div>
  );
}
export default connect((state: Store) => state.counter, actions)(Counter);
