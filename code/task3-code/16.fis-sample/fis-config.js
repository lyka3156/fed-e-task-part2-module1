


// fis.match 为匹配到的文件添加一些配置

fis.match('*.{js,scss,png}', {
    release: '/assets/$0'        // 当前文件的输入目录
})

// 编译scss文件
fis.match('**/*.scss', {
    rExt: '.css',       // 修改扩展名
    parser: fis.plugin('node-sass'),        // 使用此插件编译scss
    optimizer: fis.plugin('clean-css')      // 使用此插件压缩css     fis内置的
})

fis.match('**/*.js', {
    parser: fis.plugin('babel-6.x'),        // 使用babel编译js
    optimizer: fis.plugin('uglify-js')      // 使用此插件压缩js      fis内置的
})