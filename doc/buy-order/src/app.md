# 天猫交易-下单（总控）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽
* 代码统计：610行
* 主要作用：
  * 整个tmall下单页面的总控入口，它通过调用各类业务模块，控制其初始化、渲染和事件监听。以实现完整的业务逻辑。
  * 此外，其提供了初始化`init`，全局刷新`reload`，应用货到付款`applyCod`方法。

## 业务逻辑
* 通过init，调用各个模块，渲染整个页面。
* 其间，进行了如下操作
  * 调用各模块的初始化，为模块绑定部分与数据相关的变化监听事件
    * 数据变化，影响模块的变化
    * 模块变化，影响数据的变化
  * 发送埋点和布置反馈入口

## 函数详解
### 外部方法
* `init` {void} 初始化整个下单页面
  * 发送页面展示的埋点
  * 监听旺旺点击效果
  * 将与后端地址相关交互的url数据写入model
  * 从页面上获取用于渲染整个订单的json数据`orderData`
  * 通过页面上`input.hidden`，id为`F_authHK`判断是否为境外下单，动态加载其逻辑(`buy-order/biz/authhk`)

  * 初始化整个地址栏

  * 监听数据变化，在`Model`的`calculate`响应(表示`重新计算整个下单页价格`)，改变存储购物车内商品`编号`的`input.hiddden`
  * 监听数据变化，在`Model`的`after_usedPointsChange`和`calculate`响应时(表示`使用积分变化`和`重新计算整个下单页价格`)，改变实付款和总付款价
  * 监听数据变化，在`Model`的`calculateBundleFee`响应(表示`重新计算店铺价格`)，改变店铺总价的显示
  * 监听数据变化，在`Model`的`afterIsCodChange`响应(表示`使用/弃用货到付款`)，调用本身的货到付款逻辑
  * 监听数据变化，在`Model`的`calculateMainFee`响应(表示`计算主订单价格`)，改变订单实付款的`input.hiddden`

  * 监听业务：`数量`，`单品优惠`的`change`响应，调用`part`方法局部刷新
  * 监听业务：`店铺优惠`，的`change`响应，调用`part`方法局部刷新
  * 监听业务：`配送方式`，的`change`响应，调用`part`方法局部刷新
  * 监听业务：`地址`，的`change`响应，调用`reload`方法全局刷新

  * `run`方法，正式渲染页面

  * 添加下单页的反馈入口和发送页面初始化耗时的埋点数据

* `reload` {void} 当用户切换当前收货地址（包括新建和点击切换）时，重新渲染整个（不包括地址栏）的下单页面。
  * 参数：当前被用户选中的地址数据
  * 显示浮动提示
  * 构建XHR请求的`data`具体值和后端约定
  * 如果有`聚划算带key`(聚划算的具体业务，传递聚划算商品的值)，更新data内对应的值
  * `S.trace`是tamll buy自己封装的console.log
  * 发送全局刷新请求，容忍时间12s
    * 成功，发送`Model`的`reRender`响应(表示重绘页面)。再调用`run`重绘页面。隐藏提示
    * 失败，调整到报错页面
* `applyCod` {void} 使用货到付款
  * 从`Model`中取`isCod`的值，判断当前的状态是否为货到付款`isCod`
  * 通过`isCod`的boolean取值，来进行cod到非cod还是非cod到cod的改变
  * 修改进度条：
      * 进度条：`确认订单-付款到支付宝。。。`改为`拍下商品-确认货到付款订单信息。。。`
  * 修改实付款文案：
    * `实付款`改为`商品合计（不含运费）`
  * 修改店铺价格文案
    * `(含运费)`改为`(不含运费)`
  * 修改整个下单的表单的提交action，即修改表单`提交的地址`
  * 修改传递给后端的action，即`处理表单`的后端java
  * 修改提交表单时后端需要传递回得参数，`event_submit_do_confirm`为`event_submit_do_codSwitcher`

### 内部方法
* `run` 页面的渲染方法
* `renderOrders` 渲染所有订单
* `eventMonitor` 代理旺旺埋点
* `part` 局部刷新
* `partError` 局部刷新报错
* `preparePartParam`局部刷新数据封装
* `preparePartMainParam` 局部刷新的主订单数据准备
* `recordPromo` 记录最初始`orderData`里的优惠信息

### 调试数据
* `window.Model`，方便在develper tools里使用Model的方法获取数据，以供监控

### 本文档相关：
* 修改记录：
  * 130820 承风 创建了文档





