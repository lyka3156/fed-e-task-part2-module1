// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 3. gulp 异步任务的几种方式

// 3.1 done方式
exports.callback = (done) => {
  console.log("run callback");
  done(); // 标识任务执行完成
};

exports.callback_error = (done) => {
  console.log("run callback_error");
  done(new Error("callback_error failed"));
};

// 3.2 promise方式
exports.promise = () => {
  console.log("run promise");
  return Promise.resolve();
};
exports.promise_error = () => {
  console.log("run promise_error");
  return Promise.rejecgt(new Error("promise_error failed"));
};

// 3.3 async+await方式
const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
exports.async = async () => {
  await timeout(1000);
  console.log("run async");
};
