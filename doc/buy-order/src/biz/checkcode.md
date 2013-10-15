# 天猫交易-下单（验证码）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 提供存在危险账户的验证码输入功能，包括验证、刷新和注册check来禁止提交按钮

### 函数
#### 外部方法
* `alter` 更改验证码图片
* `render` 渲染验证码
  * 当orderData.globalData有值的时候，通过 Model.get('checkCodeData')得到内容
* `showErr` 验证失败的错误提示

#### 事件监听注册
* `Go.on('testSubmit', function(vo){`
  * 使用`buy-order/biz/go`提供的event **testSubmit** 和它的处理方法，注册对提交按钮生效之前的异步验证逻辑
    * 当切仅当`return tagFn(true)`时，表示验证通过，然后提交按钮生效
    * 当切仅当`return tagFn(false)`时，表示验证失败，然后提交按钮生效
    * 其余状况将一直禁用提交

### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档






