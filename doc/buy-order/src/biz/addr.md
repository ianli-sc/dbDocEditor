# 天猫交易-地址管理
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 在页面初始化时，创建整个与地址相关的dom及绑定操作
* 地址栏本身存在如下操作：
  * 地址超过4个，出现`显示全部地址`按钮。
  * 地址小于20个，出现`新建地址`按钮
  * 当用户点击不同地址，会进行全局刷新，调用app.js的run方法重新绘制整个页面。
* 每个地址存在如下操作：
  * `orderData.gloableData`里面有`isShowStation`，显示`代收包裹`
  * `orderData.gloableData`里面有`supportShopPickUp`，显示`门店自提`
    * `orderData.gloableData`里面有`shopPickUpData`，表示有意见绑定过的门店自提地址，选择门店自提时应当默认展示。
  * `orderData.gloableData`里面有`supportForward`，显示`国际转运`
  * 可以被设置为默认地址
* 地址额外的操作，包括去`地址管理页面`的连接。
* 如果是购物车下单，渲染`返回购物车`的链接

### 函数
#### 外部函数
* `init` 初始化整个地址的数据和dom
  * **参数**
    * `addrData`，来至orderData.addrData
    * `globalData`,来至orderData.globalData
  * **难点&业务点解析**
    * `addrControlData`传递给创建地址时的参数，它的两部分
      * `tpAreaId`：{{Array}} 最低级（区，某些地址没有区，就是市，如此类推）所支持的地址区域，创建地址时只能出现如下区
      * `showNewAddressText` : {{Boolean}} 是否显示地址被过滤后的提示文案
    * `filterAddressCount` 因为只能创建20个地址，当某些地址被过滤后，实际从addrData.valOptions这个Array里面取出的数量就是未被过滤的地址的数目。必须加上被过滤的地址数来统一计算总地址数
    * `tpId`: 商超的购物车传递过来的参数。
      * 需要在提交时候传递给后端。
      * 创建返回购物车的连接时，加上tpId这个参数，才能跳转到商超购物车
* `showAll` 修改class以显示全部地址，该点击操作不可逆
* `gerAddrControlData` 获取地址的过滤&提示文案控制信息，暴露方法方便其余函数调用
* `getCurAddrData` 获取缓存的当前地址，它是orderData.valOptions这个array里的某个特定值，或者新建地址的值
* `closeStation` 调用局部方法，来关闭代收货的选择浮层
* `addNewAddr` 创建新地址
  * **参数**
    * `addrData`同orderData.valOptions内的值的类型
  * **难点&业务点解析**
    * 新建的地址会被放到第一的位置，如果页面有`显示全部地址`将该dom提前一步
    * `addrElList.push(el);addrMap[addrData.id] = addrData;`将新地址的dom和data缓存起来

#### 内部函数
* `coreRender`渲染整个地址列表
  * **参数**，见`init`
  * **难点&业务点解析**
    * 没有地址的时候，直接弹出创建新地址的浮层
    * 否则读取缓存的地址data渲染地址。
      * 当前选中的地址放在第一位置`data.isSelected`
      * `realAddrCount`作为真实的地址的数目，判断<20否
* `renderAddr` 渲染一个地址
  * **参数**，`data` 包含一个地址的详细数据
  * **难点&业务点解析**
    * `data.isDefault`标示改地址是默认地址。默认地址会额外的在地址区域加上label`默认地址`
* `renderAddrFloater` 渲染地址浮动提示层。
  * **难点&业务点解析**
    * 当用户成功的使用了海外转运的时候，地址栏的内部addr会改变，变成xx转运仓 转 xx地址，而当hover到转运仓的文字上面会弹出个浮层，显示完整的转运仓地址
* `renderOptions` 渲染吐出部分
  * **难点&业务点解析**
    * 如果当前地址支持`门店自提`或者`代收包裹`，那么当该地址处于激活（选中）状态的时候，会在地址栏内部吐出一个选中区，里面为支持操作的2个or1个选择器
* `renderAddrInner` 渲染每个地址的内部文案
  * **难点&业务点解析**
    * `data.country == 1` 代表中国当涉及到海外地址时，区、市、省都可能不存在,所以进行了大量判断
    * 整个内部分三层
      * `hdTitle` 大范围`国 省 市` + `(收件人姓名)`
      * `bdhtml` `区` + `用户收到输入的地址` + `电话`
      * 当存在国际转运时，在最下部分添加国际转运的`使用`、`更改`、`取消`按钮。
        * 已经使用时，出现`更改` + `取消国际转运`
        * 未使用时，出现`更改` + `使用国际转运`
* `updateCurAddrInner`当option 或者 国际转运的状态被用户收到改变时，需要更新每个地址内部和浮动层的文案
* `updateCurAddrOptions`改变option的值，option的状态会在xhr请求成功后调用该方法改变
* `bindAddrEvent` 绑定响应
  * 为地址绑定hover效果
  * 将click效果绑定到每个addr，调用`touchAddr`方法分派具体的点击元素的操作的响应
* `touchAddr` 具体的点击操作分配器
  * 不论点击了任何元素，如果该元素处于的地址dom不是当前地址，都会触发
    * 收回floater
    * 将点击的地址绑上当前地址的class标记
    * 重置model内缓存的门店自提和海外转运的数据。
    * `reload`进行全局刷新
* `reload` 移除海外转运的特殊css，发送change event，供app.js捕获后全局刷新
* `setCurAddr` 保存出入地址为当前地址
* `setDefaultAddr` 设置默认地址
  * **难点&业务点解析**
    * 当地址设置成功后2秒，才会消除提示浮层。如果在2秒内再次点击其他地址的`设为默认`，会导致卡住。
    * //TODO 解决方案？
* `unUseStation` 取消代收货或者门店自提。
  * **难点&业务点解析**
    * 该地址修改操作，会重载页面！
* `useStation` 使用代收货和门店自提
  * **难点&业务点解析**
    * 在ajax操作的时候记得传递t:S.now()来保证每次请求不会403
* `handleStationData` 当使用门店自提或代收包裹浮层返回了结果时，进行处理
  * `updateCurAddrInner`为了防止全局刷新时间较慢，先把数据更新了
  * `reload`再重载订单，当重载后通过默认会调用的`renderAddr`方法来渲染真正的可用数据的地址
* `showStation` 弹出代收包裹和门店自提的浮层
* `closeStation`关闭代收包裹和门店自提的浮层
* `useForward`使用海外转运，弹出浮层
* `cancelForward`取消海外转运，为浮层暴露取消操作
* `changeForward`改变海外转运，在逻辑上和使用海外转运没区别
* `handleForwardData`海外转运浮层返回数据的操作，更新当前地址的data，在reload时候传递到后端
* `closeForward` 关闭海外转运浮层，隐藏即可（会自动销毁）
* `fitBox` 当地址的内容过长，优先完整的展示电话号码，所以会不断的尝试去截断地址的内容
* `Model.on('fillData', function()` 当全局刷新完成后，Model会向内部写入data，在此时，地址已经渲染完毕了，根据数据判断，动态的去修改地址，以显示海外转运，门店自提和代收包裹的dom
* `bindForwardHoverEvent`当海外转运使用成功后，为转运仓绑定hover效果，展示通过`renderAddrFloater`渲染成的hover小浮层
  * **难点&业务点解析**
    * 在mouseenter的时候，记得设置当前hover处的addr的z-index，不然在IE6下无法出现浮动效果
* `window.TMB`为弹出框的iframe暴露对浮层控制&数据交互的方法

### 内容和未来？
* 密密麻麻的局部变量设置到scope链里面，效率很低下。option弹出层可以提出去生成一个子类
* 不远的未来，国际转运的操作会和门店自提&代收包裹的放置地点&操作整合

### 本文档相关：
* 修改记录：
  * 130902 承风 创建了文档






