# 天猫交易-下单（天猫点券卡）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 提供天猫点券卡的弹出浮层。
* 当用户有点券卡，提供直接输入使用
* 为没有点券卡的用户提供充值浮层
* 当读取点券卡出错时提供刷新点券卡的操作

### 函数
#### 外部函数
* `refresh` 刷新数据，重新获取点券卡数据
* `fill` 打开充值浮层，充值浮层关闭时再次获取点券卡数目

#### 内部函数
* `getFeedback` 创建错误提示组件并返回
* `closeFeedback` 关闭错误提示
* `updateCoupon` 使用点券卡的数据更新Model,关闭提示，更新dom，启用点券卡
* `updateDOM` 更新点券卡显示部位的文字，并再度绑定响应
* `queryCoupon` ajax请求点券卡的数据
* `error` 显示点券卡的错误文案
* `draw` 渲染整个点券卡的dom
* `check` 校验点券卡的输入
* `bindEvent` 绑定点券卡的输入数量变化监听
* `turnon` 启用点券卡

#### 事件监听
* `Paytype.on('updateCoupon'`支付方式中的使用点券卡变更
  * 勾选使用点券卡时，调用内部函数触发。取消使用点券卡时，清除DOM。
* `Model.on('reRender',`当全局刷新时，解除对点券卡使用的绑定
* `Model.on('after_actualPaidChange'`实付款实木变更时重新调整点券卡，进行check
* `Model.on('afterCanUseTmallCouponCardChange'`当请求点券卡数据返回可用时候，修改支付方式中点券卡的值
### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档






