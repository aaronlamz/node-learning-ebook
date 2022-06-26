# 模块机制
在JavaScript的发展历程中，它主要在浏览器前端发光发热。由于官方规范（ECMAScript）规范化的时间较早，规范涵盖的范畴非常小。这些规范中包含词法、类型、上下文、表达式、声明（statement）、方法、对象等语言的基本要素。在实际应用中，JavaScript的表现能力取决于宿主环境中的API支持程度。在Web 1.0时代，只有对DOM、BOM等基本的支持。随着Web 2.0的推进，HTML5崭露头角，它将Web网页带进Web应用的时代，在浏览器中出现了更多、更强大的API供JavaScript调用，这得感谢W3C组织对HTML5规范的推进以及各大浏览器厂商对规范的大力支持。但是，Web在发展，浏览器中出现了更多的标准API，这些过程发生在前端，后端JavaScript的规范却远远落后。对于JavaScript自身而言，它的规范依然是薄弱的，还有以下缺陷。

* 没有模块系统。
* 标准库较少。ECMAScript仅定义了部分核心库，对于文件系统，I/O流等常见需求却没有标准的API。就HTML5的发展状况而言，W3C标准化在一定意义上是在推进这个过程，但是它仅限于浏览器端。
* 没有标准接口。在JavaScript中，几乎没有定义过如Web服务器或者数据库之类的标准统一接口。
* 缺乏包管理系统。这导致JavaScript应用中基本没有自动加载和安装依赖的能力。

CommonJS规范的提出，主要是为了弥补当前JavaScript没有标准的缺陷，以达到像Python、Ruby和Java具备开发大型应用的基础能力，而不是停留在小脚本程序的阶段。他们期望那些用CommonJS API写出的应用可以具备跨宿主环境执行的能力，这样不仅可以利用JavaScript开发富客户端应用，而且还可以编写以下应用。

* 服务器端JavaScript应用程序。
* 命令行工具。
* 桌面图形界面应用程序。
* 混合应用（Titanium和Adobe AIR等形式的应用）。

如今，CommonJS中的大部分规范虽然依旧是草案，但是已经初显成效，为JavaScript开发大型应用程序指明了一条非常棒的道路。目前，它依旧在成长中，这些规范涵盖了模块、二进制、Buffer、字符集编码、I/O流、进程环境、文件系统、套接字、单元测试、Web服务器网关接口、包管理等。

## CommonJS 规范
CommonJS对模块的定义十分简单，主要分为模块引用、模块定义和模块标识3个部分。

### 模块饮用
模块引用的示例代码如下：
```javascript
var math = require('math');
```
在CommonJS规范中，存在require()方法，这个方法接受模块标识，以此引入一个模块的API到当前上下文中。

### 模块定义
在模块中，上下文提供require()方法来引入外部模块。对应引入的功能，上下文提供了exports对象用于导出当前模块的方法或者变量，并且它是唯一导出的出口。在模块中，还存在一个module对象，它代表模块自身，而exports是module的属性。在Node中，一个文件就是一个模块，将方法挂载在exports对象上作为属性即可定义导出的方式：
```javascript
// math.js
exports.add = function () {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}
```
在另一个文件中，我们通过require()方法引入模块后，就能调用定义的属性或方法了：
```javascript
var math = require('math');
console.log(math.add(1, 2, 3, 4, 5));
```
### 模块标识
模块标识其实就是传递给require()方法的参数，它必须是符合小驼峰命名的字符串，或者以．、.．开头的相对路径，或者绝对路径。它可以没有文件名后缀．js。模块的定义十分简单，接口也十分简洁。它的意义在于将类聚的方法和变量等限定在私有的作用域中，同时支持引入和导出功能以顺畅地连接上下游依赖。如图2-3所示，每个模块具有独立的空间，它们互不干扰，在引用时也显得干净利落。

<div align="center"><img src="~@img/module.png"></div>



## Node.js 模块实现

## C/C++ 扩展模块


## 参考链接
[《深入浅出Node.js》](https://m.ituring.com.cn/book/1290)



