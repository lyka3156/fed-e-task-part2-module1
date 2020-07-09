// 导出的函数都会作为 gulp 任务
// gulp 的任务函数都是异步的

// 3. gulp 构建过程

const fs = require("fs"); // 引入node的fs核心模块
const { Transform } = require("stream"); // 引入node的strem核心模块

exports.default = () => {
  // 创建文件读取流
  const readStream = fs.createReadStream("normalize.css");

  // 创建文件写入流
  const writeStream = fs.createWriteStream("normalize.min.css");

  // 创建文件转换流
  const transformStream = new Transform({
    // 核心转换过程
    // 在此对读取流文件进行逻辑操作   (例如：css,js,html文件压缩，es6+转换成es5等等)
    transform: (chunk, encoding, callback) => {
      const input = chunk.toString(); // 获取读取的文件
      // 去除掉input内容的空格和注释
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");
      callback(null, output);
    },
  });

  // 通过pipe管道将一个流输入到另外一个流
  return readStream
    .pipe(transformStream) // 转换
    .pipe(writeStream); // 写入

  // 最后当读取流读取完成内部会执行done方法来标识任务完成
  // read.on('end', () => {
  //     done()
  //   })
};
