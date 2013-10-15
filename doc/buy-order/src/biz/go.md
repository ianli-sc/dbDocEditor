# 天猫交易-下单（结算）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 管理下单页面的提交，包括注册提交前检测，发送提交event和管理按钮
* 当使用货到付款时，提交按钮变成`下一步`

### 函数
#### 外部函数
* `submit` 进行提交操作
  * **难点&业务点解析**
    * 用closure值`isSubmiting`控制整个业务是否继续处理。当点击后激活成true
    * 留言的异步校验
      * 留言使用`buy-base/util/inputmask`控件，当报错时（输入超过200字），会产生错误提示
    * `self.fire('testSubmit', {` 发送提交前检测事件，参数为通用checker组件，形成closure值
    * `checker.validate(function(pass){`检测closure checker内注册的function
      * 如果都返回true，使用closure函数submit
      * 如果有任何false，启用提交按钮
* `notify` 接受外部通知，注册检测点来启用或禁用提交按钮
* `testEnable` 检测注册的检测点，启用 或 禁用提交

#### 内部函数
* `submit` 提交form
* `enable` 启用提交按钮

#### 监听event
* `Model.on('afterIsCodChange', function(ev){` 当选择货到付款时，改变提交按钮文案
  * 标示TODO 的那块儿逻辑不知道想表达什么

### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档






