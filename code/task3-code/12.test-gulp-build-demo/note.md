## 之前打包的 svg 图片用不了，需要在服务器中运行

## 1. 安装静态服务器

```js
yarn add http-server
```

## 2. 启动项目

```js
yarn http-server ./dist

// npx 可以使用未安装的模块，他会安装未安装的模块，使用完之后再删除
npx http-server ./dist
```

## 3. 测试 gulp 打包之后的项目
