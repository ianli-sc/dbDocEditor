# 天猫交易-下单（运费险&退货保障卡）
* 文档版本号：1.0.0

## 总览
* 作者：仙羽

### 功能
* 运费险和配送方式一样，是和主订单相关的
* 运费险分为4种，`天猫强制送`，天猫送，`卖家送`，自己购买，其中天猫强制送，当前仅在1111时存在
* 运费险存在3种状态：不渲染，渲染不默认选中，渲染默认选中不可修改
  * 主订单中如果没有`insuranceList`则不渲染
  * 如果是`天猫强制送`和`卖家送`，则运费险默认选中不可勾选。

### 函数
#### 外部函数
* `init` 初始化
  * **难点&业务点解析**
    * `selectObj.on('change', function(){`当用户进行下拉框选择时，就勾选checkbox
      * 因为天猫送的运费险每日数量有限，所以需要检查剩余可用数`checkCardCount`
      * 因为自己购买的运费险是要钱的，所以需要计算价格`Model.calculate();`
* `render` 渲染
  * 如果`mainData.insuranceList;`主订单未返回可用运费险，就不渲染
  * `if(1 < size){`如果超过1种运费险就渲染下拉选项框，否则直接使用文字
* `toggle` 运费险checkbox的点击相应，触发计算价格`Model.calculate();`

#### 内部函数
* `passData` 更新当前运费险的选择状态和对主订单价格数据的变化
* `checkCardCount` 检查运费险的数量
  * **难点&业务点解析**
    * `S.each(DOM.query('div.insure', '#J_orders'), function(insureEl){`
      * 每次进行检查都需要遍历所以的运费险,计算`天猫送`使用的数量`selectedCount`
    * `S.each(datas, function(insuranceList, idx){`
      * 再遍历运费险的list，禁用掉其余的运费选项框中`天猫送`的项目

#### 事件监听
* `Model.on('afterIsCodChange', `
  * 当配送方式设置为货到付款时，将checkbox还原成初始的状态

### 本文档相关：
* 修改记录：
  * 130903 承风 创建了文档






