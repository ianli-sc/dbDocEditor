# 天猫交易-下单（单品优惠）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* **在可以期望的未来，将禁止用户选择单品优惠！**
* 单品优惠和商品相关，是bundle-main-order层内的一个order内的数据
* 所有可用的单品优惠都由后端反馈到前端进行渲染，默认选中最优惠的优惠
* 当优惠变化时，触发局部刷新，当局部刷新错误时，回滚使用上次成功的优惠

### 函数
#### 外部函数
* `init`初始化
  * 监听select的响应
  * 监听单品优惠是否是积分加钱购
* `render` 简单的渲染

#### 内部函数
* `renderPromoDesc` 渲染某个优惠的描述信息，当存在`promoData.desc`时
* `toCamp` 如果是满减折优惠，会提供特别的icon

#### 事件监听
* `Model.on('updateOrderData',`
  * 当订单的数据变化，需要重新渲染该优惠
  * 调用初始化，重新绑定该优惠的select响应
* `Model.on('partError', function(vo){`
  * 局部刷新报错后的数据回滚

### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档





