# 文件系统
文件系统（File System）是 Node 中使用最为频繁的模块之一，该模块提供了读写文件的能力，是借助于底层的 libuv 的 C++ API 来实现的。

前端常见的构建工具，比如 Webpack、Gulp 等，都会使用文件系统模块来读取文件，并且把文件内容输出到磁盘上。

## 文件系统模块导入

node:fs 模块支持以标准 [POSIX](https://www.zhihu.com/question/21048638) 函数建模的方式与文件系统进行交互。

```javascript
// 基于 Node.js 18.4.0 版本 ES6 的文件系统模块
// 基于 promise 的 API
import * as fs from 'node:fs/promises';

// 使用回调和同步的 API：
import * as fs from 'node:fs';
```

所有文件系统操作都具有同步、回调和基于 promise 的形式，并且可以使用 CommonJS 语法和 ES6 模块进行访问。

* Promise 示例
```javascript
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello'); // unlink(path) 如果 path 指向符号链接，则删除该链接，但不影响链接所指向的文件或目录。 如果 path 指向的文件路径不是符号链接，则删除文件。
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

* 回调的示例
回调的形式将完成回调函数作为其最后一个参数，并异步地调用该操作。 传给完成回调的参数取决于方法，但是第一个参数始终为异常预留。 如果操作成功完成，则第一个参数为 null 或 undefined。
```javascript
import { unlink } from 'fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

* 同步的示例
同步的 API 会阻止 Node.js 事件循环和进一步的 JavaScript 执行，直到操作完成。 立即抛出异常，可以使用 try…catch 进行处理，也可以使其冒泡。
```javascript
import { unlinkSync } from 'fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // 处理错误
}
```

## 常用的文件系统模块 API 


## 参考链接
* [Node.js 中文网 fs](http://nodejs.cn/api/fs.html)
* [Node.js fs](https://nodejs.org/api/fs.html)
* [fs.js 源代码](https://github.com/nodejs/node/blob/v18.4.0/lib/fs.js)