# 基本原理
 下面是一张 Node.js 早期的架构图，来自 Node.js 之父 Ryan Dahl 的演讲稿，在今天依然不过时，Node.js 是基于 Chrome V8 引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环只要等待执行结果就可以了。

<div align="center"><img src="~@img/node_architrcture.png"></div>

## 核心概念

* Chrome V8 是 JavaScript 引擎
* Node.js 内置 Chrome V8 引擎，所以它使用的 JavaScript 语法
* JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事
* 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。
* 如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 I/O 很慢，不得不等着结果出来，再往下执行
* CPU 完全可以不管 I/O 设备，挂起处于等待中的任务，先运行排在后面的任务
* 将等待中的 I/O 任务放到 Event Loop 里
* 由 Event Loop 将 I/O 任务放到线程池里
* 只要有资源，就尽力执行




