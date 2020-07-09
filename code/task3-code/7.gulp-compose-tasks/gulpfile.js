// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 2. gulp 组合任务的使用
const { series, parallel } = require("gulp");

// 创建任务1
const task1 = (done) => {
  console.log("run task1");
  done();
};

// 创建任务2
const task2 = (done) => {
  setTimeout(() => {
    console.log("run task2");
    done();
  }, 1000);
};

// 创建任务3
const task3 = (done) => {
  console.log("run task3");
  done();
};

// 创建串行任务队列
exports.seriesTask = series(task1, task2, task3);
// 执行 yarn gulp seriesTask 输入如下
// [17:05:22] Starting 'seriesTask'...
// [17:05:22] Starting 'task1'...
// run task1
// [17:05:22] Finished 'task1' after 1.96 ms
// [17:05:22] Starting 'task2'...
// run task2
// [17:05:23] Finished 'task2' after 1.01 s
// [17:05:23] Starting 'task3'...
// run task3
// [17:05:23] Finished 'task3' after 2.98 ms
// [17:05:23] Finished 'seriesTask' after 1.04 s

// 创建并行任务队列
exports.parallelTask = parallel(task1, task2, task3);
// 执行 yarn gulp parallelTask
// [17:06:29] Starting 'parallelTask'...
// [17:06:29] Starting 'task1'...
// [17:06:29] Starting 'task2'...
// [17:06:29] Starting 'task3'...
// run task1
// [17:06:29] Finished 'task1' after 3.54 ms
// run task3
// [17:06:29] Finished 'task3' after 4.25 ms
// run task2
// [17:06:30] Finished 'task2' after 1.01 s
// [17:06:30] Finished 'parallelTask' after 1.04 s
