/**
 * 代码编辑和view的区域
 */
KISSY.add('doc-editor/biz/preview', function(S, DOM, IO, Doc) {
    var preview = {
        init : function() {
            var converter = new Showdown.converter();
            var previewDOM = DOM.get('#preview');
            var self = this;
            this.converter = converter;
            this.previewDOM = previewDOM;
            //监听文档的变更响应，实时更新内容
            Doc.on('change', function() {
               self.loadData(self.url);
            });
        },
        loadData : function(url) {
            //存储url
            this.url = url;
            var converter = this.converter;
            var previewDOM = this.previewDOM;

            new IO({
                type : "get",
                url : url,
                success : function(data) {
                    var text = converter.makeHtml(data);
                    DOM.html(previewDOM, text);
                    DOM.css(previewDOM, {
                        'display' : 'block'
                    });
                },
                dataType : 'text'
            });
        }
    };
    return preview;
}, {
    requires : [
        'dom', 'ajax', 'doc-editor/biz/doc'
    ]
});
