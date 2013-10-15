# 天猫交易-下单（天猫积分）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 积分使用分两个场景，1：积分加钱购（一种优惠）2：使用积分抵扣价格
  * 选择积分加钱购业务时，积分**默认使用固定积分**，**默认选中**，实际前端算价格时按照使用0积分计算，不然价格不平
  * 积分抵扣价格，100积分 = 1元rmb，默认不选中
* 使用积分的dom当且仅当用户有可用积分时出现，积分的数量在用户选择时异步获取
  * 获取成功，显示剩余积分数
  * 获取失败提供重试功能，获取失败不作为提交的检测条件，失败依然可以提交
* 使用积分时，输入非数字，>可用积分数的数目，提示错误，不能提交订单
* 有些店铺需要在结算区域获得积分处，展示其获得了店铺多倍积分文案

### 函数
#### 外部函数
* `toggle` 打开or收起使用积分的输入框
* `init` 初始化整个积分区域
  * `Model.set({`重置全局变量，这些变量会在model中重新赋值，这里是为了局部刷新时清除零时数据
  * `Event.on(self.inputEl, 'valuechange', check);`监听输入框的数据变化
* `render` 渲染积分dom
* `moneyPoint`当使用积分加钱购的业务时的处理
  * `if(!usePoint){ `取消积分加钱购
  * `update(0);`积分加钱购在展示上会显示积分，但是不参与价格计算

#### 内部函数
* `check` 检测积分的输入可用性
* `error` 显示错误文档，注册提交检测
* `update`更新积分的使用情况
  * 提交检测设置为通过
  * 修改全局数据`Model.set('_usedPoints', usedPoints);`代表使用多少积分
* `initShopVip`渲染店铺多倍积分，及其hover的注释

#### 事件监听
* `Model.on('after_availablePointsChange after_obtainPointsChange'`
  * 当可用积分和可获得积分变化时，分别
    * 修改获得积分的文案
    * 检测当前输入的积分可用性（4个商品可用100积分，改为3个商品，100就不适用了）
* `Model.on('afterIsCodChange', function(ev){`
  * 货到付款不能使用积分抵扣价格
### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档





