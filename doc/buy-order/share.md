# Mobile上的特殊CSS&HTML

## pandect

* 根据当前的[MGBS](http://velocity.alibaba-inc.com/projects/cross-end-web/wiki/mgbs),我们的Mobile页面只支持webkit核心的浏览器。所以本文的主要内容绝大部分为webkit的特殊用法。
* 此外，mobile浏览器支持大量的HTML5属性，一些在PC上不敢用的标签，在这儿可以放开手脚。

## Webkit CSS

* `-webkit-appearance` 改变标签的外观，可以针对任何标签进行改变
  * 常用的值
    * `button`，`checkbox` 
      * 表现为一个button或checkbox，它具有了button、checkbox的特性：点击时的效果，也保留原有的效果。但`checkbox`却不享有`checked`效果。在快速demo等时候，可以方便的使用该属性来伪装`a`标签成为`button`
      * 例（input-button）
    * `none`
      * 取消标签的默认外观。是使用最多的值。特别是当要定制自己的`checkbox`,`select`样式时。
      * 例（checkbox,select）

* `-webkit-animation`
  * 最喜闻乐见的动画效果，[基于CSS的动画在mobile下效率远远高于JS的动画](http://stackoverflow.com/questions/8671078/which-is-the-most-efficient-on-ios-css3-or-jquery-animations) & [测试用例](http://css3.bradshawenterprises.com/legacy/)。详细的内容，各位已经比较了解，就不多介绍了。
  * 此处关注的是[animationEvent](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent)。我们如何去捕获，event，并对其进行操作。
    * | W3C standard | webkit | IE10 |
| ------------ | ------------- | ------------ |
| animationstart | webkitAnimationStart | MSAnimationStart |
| animationiteration | webkitAnimationIteration | MSAnimationIteration |
| animationend | webkitAnimationEnd | MSAnimationEnd |
    * 三个event分别标示动画的开始，迭代和结束
    * `event`参数：
      * `animationName`动画名，使用者自定义的
      * `elapsedTime`时间，动画开始时到响应触发的时间
    * 特殊的Event`webkitAnimationKeyframe`,监听整个动画的进程。
      * 非原生，由CSS3 big fans [Jon](http://blog.joelambert.co.uk/author/admin/)实现，详细见[连接](http://blog.joelambert.co.uk/2011/05/17/keyframe-events-for-css3-animations/).
      * 如果觉得自己需要，用KISSY实现应该不是难事。
    * 例子
* `-webkit-backface-visibility`,Determines whether or not a transformed element is visible when it is not facing the screen. 
  * 只有两个取值，`visible` & `hidden`。
  * 例子
* `-webkit-background-clip`截取背景图
  * `text`,为文字添上背景图片！[safari官方介绍](https://www.webkit.org/blog/164/background-clip-text/)
  * 官方的方式，不支持非webkit的浏览器，如果要兼容，可用参考本例，综合使用了多个属性。
  * 例子
* `-webkit-border-image`使用图片生成border
  * -webkit-border-image: <uri> <top> <right> <bottom> <left> <x_repeat> <y_repeat>;
  * 除了table中`border-collapse`为`collapse`的所以元素可用
  * 例子
* `webkit-columns`定义文字分行的长度，与`-webkit-column-rule`合用，产生文字的间隔
  * [MOZ官方例子](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule  )
* `-webkit-marquee`CSS3的跑马灯
  * -webkit-marquee: [direction] [increment] [repetition] [style] [speed]
  * [例子](http://ued.ctrip.com/blog/wp-content/webkitcss/prop/marquee-style.html)
* `-webkit-mask`遮罩
  * [更多例子](http://css-tricks.com/webkit-image-wipes/)，**能做3个or3个以上的么？**
* `-webkit-tap-highlight-color`，高亮颜色
  * 本指一个`a`或者`可点击元素`被tap后，其高亮的颜色。它和outline一起控制了元素蓝色的外框.
* `-webkit-text-security`,将文字以密文显示
  * 例子
* `webkit box`综合介绍
  * 这是一个布局方式的整合，基于[w3c的CSS3布局](http://www.w3.org/TR/css3-layout/)。
  * 这个布局主要为了解决多行自适应宽度布局什么问题？
    * float的元素，不能撑开父级的高度(一边固定，一边absolute也是如此)
    * 固定长度的设计，只能说句`呵呵`
    * 因此，W3C产出了Flexible box model，重点在`灵活`
  * 使用方式
    * container赋值`display: -webkit-box;box-orient: horizontal;`。形成横排的box
    * cell使用`-webkit-box-flex: number;`来赋值某个子元素，占据空白位置的百分比
       * 以3个子元素为例，为每个子元素赋值`-webkit-box-flex: 1;`，`-webkit-box-flex: n2;``-webkit-box-flex: 3;`.那么他们在自身宽度之外，还会占据剩余宽度X的X/(1+2+3)*number
    * 如果cell的宽度之和超过了父元素，会被撑开
      * 如果子元素某个元素为input，它在mobile下默认宽度165px，可用为它赋值display: -webkit-box;它就能自适应宽度了。
      * 如果是自己定义死的宽度，应当在布局考虑上避免这个情况。

## HTML

### ApplicationCache

* `manifest`
  * 优点
    1. 离线使用
    1. 本地保存加快加载速度
    1. 减轻服务器负载。只当catch的内容变更才请求服务器
  * 是个啥？咋个用？和浏览器自身的catch有什么区别？
    * 就是一个简单的TEXT。
    * 为html标签添加属性`manifest="file"`file指向某个manifest文件
    * 区别：
      * 传统：当服务器端文件修改后，浏览器会去获取信息，比较文件，决定是否重新拉去。
      * manifest：当manifest本身没被修改时，根本不去请求服务器的内容。因而减少了请求。
  * 使用后浏览器的行为
    * 当manifest被定义后，浏览器直接从本地缓存去读取指定的被缓存的内容，而非发起http请求。
    * 浏览器检测menifest在服务器上是否被更新
    * 如果发现更新，浏览器下载新的manifest和manifest里列出的内容
  * 注意点
    * file可以是相对/绝对定位的文件。如果是绝对定位，需要同域。
    * 返回的file的`mime-type`必须为`text/cache-manifest`
    * 文件后缀建议以`manifest`,此外`appcache`，`cfm`,`mf`也被某些浏览器支持。但是`safari`**声称**只支持`manifest`结尾！（实际测试中，它似乎也支持`cfm`格式。。。你有深入研究么？）
    * 不要在menifest里面写menifest自身，这样做会导致menifest失效
  * 文件语法格式
    * 第一行`CACHE MANIFEST`
    * 以 `#` 开头的为注释
    * 有主要3大功能块，以特定的字段`CACHE`,`NETWORK`,`FALLBACK`。分别代表需要缓存的内容，需要用户online使用的模块，加载文件失败后的处理
  * 举个例子
    * 文件体
    > CACHE MANIFEST
    > 
    > CACHE:
    > /favicon.ico
    >
    > NETWORK:
    > login.php
    >
    > FALLBACK:
    > *.html /offline.html
     
  * 更新文件
    * js监控和操作文件更新，见[菜鸟教程](http://www.html5rocks.com/en/tutorials/appcache/beginner/#toc-updating-cache)
    * 文件更新的条件：**manifest本身被改变**。常用的操作如下
      * 在注释里面，更新时间戳
      * 更新文件本身的内容
      * 改变文件的顺序
  * 缺点
    * 它默认会catch整个HTML，对于HTML多变的场景完全不适应
  * 更多相关介绍
    * [导师级菜鸟教程](http://www.html5rocks.com/en/tutorials/appcache/beginner/#toc-updating-cache)
    * [safari离线html开发](https://developer.apple.com/library/safari/documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html#//apple_ref/doc/uid/TP40007256-CH7-SW2)
    * [moz离线html应用介绍](https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache)
    * [appcatch.info](http://appcachefacts.info/)
    * [口味蛮重的视频介绍](http://www.bennadel.com/blog/1944-Experimenting-With-HTML5-s-Cache-Manifest-For-Offline-Web-Applications.htm)

### hashchange & popstate

* `hash change`触发条件：url的hash值被改变(没有到有，有到更多，更多到更少，有到没有)
  * `location.href += '#hash'`
  * `history.back()` or `history.forward()`对bred的改变，涉及到了hash改变
  * `location.hash` 的字符串改变操作
* `popstate`触发：只在浏览器行为，跳转两个history entries时触发
  * `history.pushState（state, title, href）`如果触发hash跳转，为history添加新的值，不触发`popstate`，浏览器不刷新（不是浏览器行为）
  * `history.replaceState`如果更改当前hash，不为history添加新的值，不触发`popstate`，浏览器不刷新（不是浏览器行为）
  * `location.href += '#hash'`会触发hash跳转，为history添加新的值
  * `history.forward()` & `history.back()`同样触发`popstate`
* 不理解的地方
  * `history.pushState（state, title, href）`不会触发上诉任何响应，即使涉及到hash改变。
  
#### event handler

* `popstate`可以通过e.state获取push进去的state的值
* `history.pushState/replaceState（state, title, href）`可做如下改变
  * href改变当前的最末尾文件名，eg：为href传值`abc.txt`,tmall.com/test.html变成了`tmall.com/abc.txt`；
  * href改变hash和parameter，eg：为href传值`?123`,或者`#123`,tmall.com/test.html变成了`tmall.com/test.html?123`或者`tmall.com/test.html#123`；
* 改变state可以起到剪短url的功能。用户刷新页面，浏览器会直接load这个被改变后的地址