# 天猫交易-下单（渲染整个订单-除地址）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 整个页面的核心渲染方法，被`buy-order/app`调用
* ps:有大量方法和`buy-order/render/order`相同，千万主要参数是不一样的

### 函数
* `toBundleHeader` 渲染店铺的头部
  * `if('chaoshi' === Model.get('mode')){` 商超的头部不会渲染旺旺！
  * `if('chaoshi' === Model.get('mode')) {` 商超会在价格位置加上重量
* `toBundleFooter` 渲染店铺尾部
  * `if(isShop && 'chaoshi' != Model.get('mode')){` 商超没有留言
  * `if(isWrt){` 万人团的文案改变
* `toBundlePromo` 渲染店铺优惠
  * `if(bundleData.discount){`非店铺是优惠活动文案不同
* `toScrollPromos` 渲染店铺头部的滚动优惠
* `toCheckbar` 渲染结算区域
  * `if(Model.get('isForceAnony')){` 本应在`buy-order/biz/paytype`中渲染的`匿名购买`配送方式，此处渲染了
* `toOrder` 渲染每个店铺下的主订单下的最小行：订单
  * `if('act'=== data.type && 0 === data.idx){`
    * 一个店铺有多个主订单时，留言的模块会放到具体的主订单之下，可以参见线上品牌站
    * 多个品牌都属于品牌站这个店铺，但自成主订单
* `toUnable` 渲染完整的无效订单

### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档






