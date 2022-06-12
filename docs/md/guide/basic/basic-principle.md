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
#### timer（定时器）
计时器指定 可以执行所提供回调的阈值，而不是用户希望其执行的确切时间。在指定的一段时间间隔后，计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们。

> 注意：轮询 阶段 控制何时定时器执行。

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
当事件循环进入 轮询 阶段时，它有一个空队列（此时 fs.readFile() 尚未完成），因此它将等待剩下的毫秒数，直到达到最快的一个计时器阈值为止。当它等待 95 毫秒过后时，fs.readFile() 完成读取文件，它的那个需要 10 毫秒才能完成的回调，将被添加到轮询队列中并执行（执行回调函数需要花费10ms）。当回调完成时，队列中不再有回调，因此事件循环机制将查看最快到达阈值的计时器，然后将回到 计时器 阶段，以执行定时器的回调。在本示例中，您将看到调度计时器到它的回调被执行之间的总延迟将为 105 毫秒（并不是计时器预期设定的100ms）。

> 注意：为了防止 轮询 阶段饿死事件循环，libuv（实现 Node.js 事件循环和平台的所有异步行为的 C 函数库），在停止轮询以获得更多事件之前，还有一个硬性最大值（依赖于系统）。

#### pending callback（待定回调）
此阶段对某些系统操作（如 TCP 错误类型）执行回调。例如，如果 TCP 套接字在尝试连接时接收到 ECONNREFUSED，则某些 *nix 的系统希望等待报告错误。这将被排队以在 挂起的回调 阶段执行。

#### poll（轮询）
轮询 阶段有两个重要的功能：
1、计算应该阻塞和轮询 I/O 的时间。
2、然后，处理 轮询 队列里的事件。

当事件循环进入 轮询 阶段且 没有被调度的计时器时 ，将发生以下两种情况之一：
* 如果 轮询 队列 不是空的 ，事件循环将循环访问回调队列并同步执行它们，直到队列已用尽，或者达到了与系统相关的硬性限制。
* 如果 轮询 队列 是空的 ，还有两件事发生：
  * 如果脚本被 setImmediate() 调度，则事件循环将结束 轮询 阶段，并继续 check(检查) 阶段以执行那些被调度的脚本。
  * 如果脚本 未被 setImmediate()调度，则事件循环将等待回调被添加到队列中，然后立即执行。
一旦 轮询 队列为空，事件循环将检查 _已达到时间阈值的计时器_。如果一个或多个计时器已准备就绪，则事件循环将绕回计时器阶段以执行这些计时器的回调。

#### check（检查阶段）
此阶段允许人员在轮询阶段完成后立即执行回调。如果轮询阶段变为空闲状态，并且脚本使用 setImmediate() 后被排列在队列中，则事件循环可能继续到 检查 阶段而不是等待。

setImmediate() 实际上是一个在事件循环的单独阶段运行的特殊计时器。它使用一个 libuv API 来安排回调在 轮询 阶段完成后执行。

通常，在执行代码时，事件循环最终会命中轮询阶段，在那等待传入连接、请求等。但是，如果回调已使用 setImmediate()调度过，并且轮询阶段变为空闲状态，则它将结束此阶段，并继续到检查阶段而不是继续等待轮询事件。

#### close callbacks（关闭的回调函数）
如果套接字或处理函数突然关闭（例如 socket.destroy()），则'close' 事件将在这个阶段发出。否则它将通过 process.nextTick() 发出。


### setImmediate() 对比 setTimeout()
setImmediate() 和 setTimeout() 很类似，但是基于被调用的时机，他们也有不同表现。
* setImmediate() 设计为一旦在当前 轮询 阶段完成， 就执行脚本。
* setTimeout() 在最小阈值（ms 单位）过后运行脚本。

执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）。
例如，如果运行以下不在 I/O 周期（即主模块）内的脚本，则执行两个计时器的顺序是非确定性的，因为它受进程性能的约束：
```javascript
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

```javascript
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

但是，如果你把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用：
```javascript
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```javascript
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```
使用 setImmediate() 相对于setTimeout() 的主要优势是，如果setImmediate()是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关。（看事件循环阶段就可以理解，setTimeout总是在下一个事件循环阶段执行，所以setImmediate优先执行）

## 参考链接
[Node.js 事件循环，定时器和 process.nextTick()](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
