# 天猫交易-下单（构建脚本）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽
* 基础：基于node.js。
* 第三方依赖：
  * clean-css：css的压缩和简化等
  * uglify-js：js的压缩，格式检测等

### 选项和功能
* 选项
  * 命令：`node transfer.js [option]`
  * option:
    * -c : 生成压缩文件
* 功能
  * 将src内的js和css文件传输到build目录下
  * 在build目录跟目录下生成`aio.js`,`aio.css`他们分别是所有指定的js和css的压缩合集
* js和css的自定义压缩
  * `excludeJs`定义了不会被压缩进`aio.js`的所有js。其意义分别如下
    * `init.js`初始化脚本
    * `biz/addrmaker.js`创建新地址的管理软件
    * `biz/authhk.js`tmall境外的处理
    * `biz/district.js`地址库
  * css的合并需要自己定义顺序，顺序的不同会导致样式被覆盖的层次问题。所以构建脚本采用了自己书写层次。

### 使用情况和存在的问题
  * 使用情况：
    * 交易通用`buy-base`
    * mobile交易通用`buy-base-m`
    * 购物车`buy-cart`
    * 下单`buy-order`
    * 订单详情`buy-detail`
    * mobile购物车`buy-cart-m`
    * mobile下单`buy-order-m`
  * 存在的问题：
    * 需要定制的书写`excludeJs`和css的combo次序。如果不知道如何修改或忘记修改，会导致使用的问题。

### 本文档相关：
* 修改记录：
  * 130819 承风 创建了文档






