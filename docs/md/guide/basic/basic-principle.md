# 基本原理
 下面是一张 Node.js 早期的架构图，来自 Node.js 之父 Ryan Dahl 的演讲稿，Node.js 是基于 Chrome V8 引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环只要等待执行结果就可以了。

<div align="center"><img src="~@img/node_architrcture.png"></div>

* Chrome V8 是 Google 发布的开源 JavaScript 引擎，采用 C/C++ 编写，在 Google 的 Chrome 浏览器中被使用。Chrome V8 引擎可以独立运行，也可以用来嵌入到 C/C++ 应用程序中执行。
* Event Loop 事件循环（由 libuv 提供）
* Thread Pool 线程池（由 libuv 提供）

## 事件循环（Event Loop）
### 什么是事件循环
事件循环是 Node.js 处理非阻塞 I/O 操作的机制——尽管 JavaScript 是单线程处理的——当有可能的时候，它们会把操作转移到系统内核中去。
既然目前大多数内核都是多线程的，它们可在后台处理多种操作。当其中的一个操作完成的时候，内核通知 Node.js 将适合的回调函数添加到轮询队列中等待时机执行。

### 事件循环机制解析
当 Node.js 启动后，它会初始化事件循环，处理已提供的输入脚本（或丢入 REPL），它可能会调用一些异步的 API、调度定时器，或者调用 process.nextTick()，然后开始处理事件循环。
下面的图表展示了事件循环操作顺序的简化概览。

```html
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```
> 注意：每个框被称为事件循环机制的一个阶段。

每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段，等等。

由于这些操作中的任何一个都可能调度更多的操作和由内核排列在轮询阶段被处理的新事件，且在处理轮询中的事件时，轮询事件可以排队。因此，长时间运行的回调可以允许轮询阶段运行长于计时器的阈值时间。

> 注意： 在 Windows 和 Unix/Linux 实现之间存在细微的差异，但这对演示来说并不重要。最重要的部分在这里。实际上有七或八个步骤，但我们关心的是 Node.js 实际上使用以上的某些步骤。

### 阶段概述
* timer（定时器）：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
* pending callback（待定回调）：执行延迟到下一个循环迭代的 I/O 回调。
* idle, prepare：仅系统内部使用。
* poll（轮询）：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
* check（检测）：setImmediate() 回调函数在这里执行。
* close callbacks（关闭的回调函数）：一些关闭的回调函数，如：socket.on('close', ...)。

在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。

### 阶段的详细概述
#### 定时器
计时器指定 可以执行所提供回调的阈值，而不是用户希望其执行的确切时间。在指定的一段时间间隔后，计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们。

例如，假设您调度了一个在 100 毫秒后超时的定时器，然后您的脚本开始异步读取会耗费 95 毫秒的文件:

```javascript
const fs = require('fs');

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```




## 参考链接
[Node.js 事件循环，定时器和 process.nextTick()](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
