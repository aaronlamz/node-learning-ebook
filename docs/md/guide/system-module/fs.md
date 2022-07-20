# 文件系统
文件系统（File System）是 Node 中使用最为频繁的模块之一，该模块提供了读写文件的能力，是借助于底层的 libuv 的 C++ API 来实现的。

前端常见的构建工具，比如 Webpack、Gulp 等，都会使用文件系统模块来读取文件，并且把文件内容输出到磁盘上。

## 模块使用

node:fs 模块支持以标准 [POSIX](https://www.zhihu.com/question/21048638) 函数建模的方式与文件系统进行交互。

Node API 支持Promise 异步、同步和回调的形式。来看一个简单的例子：

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

## 常用 API

> 下面的例子均使用同步API的形式

1、fs.accessSync(path[, mode])
* path `string` | `Buffer` | `URL`
* mode `integer` 默认值: fs.constants.F_OK

同步地测试用户对 path 指定的文件或目录的权限。 mode 参数是可选的整数，指定要执行的可访问性检查。 mode 应该是值 fs.constants.F_OK 或由 fs.constants.R_OK、fs.constants.W_OK 和 fs.constants.X_OK 中的任何一个（例如 fs.constants.W_OK | fs.constants.R_OK）的按位或组成的掩码。 查看[文件访问的常量](http://nodejs.cn/api/fs.html#file-access-constants)以获取可能的 mode 值。

如果任何可访问性检查失败，将抛出 Error。 否则，该方法将返回 undefined。

```javascript
import { accessSync, constants } from 'fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

2、fs.copyFileSync(src, dest[, flags])
* src `string` | `Buffer` | `URL`
* dest `string` | `Buffer` | `URL`
* flags `integer` 默认值: 0


## FileHandle 类
FileHandle 对象是一个文件描述符的对象包装器，它可以用来读取、写入、或者删除文件。

FileHandle 对象的实例通过 fs.open() 或 fs.openFile() 方法创建。

所有 FileHandle 对象都是 EventEmitter

如果 FileHandle 对象不是使用 filehandle.close() 方法关闭的话，则会尝试自动关闭文件描述符并且会抛出异常，避免内存泄漏。但是最好不要依赖这个特性，因为它可能在以后的版本中被移除。

## 公共对象

## 示例代码

## 参考链接
* [File System API](https://nodejs.org/api/fs.html)
* [fs源代码](https://github.com/nodejs/node/blob/v18.4.0/lib/fs.js)

