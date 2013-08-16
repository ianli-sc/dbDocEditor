/**
 * 文档编辑区
 */
KISSY.add('doc-editor/biz/doc', function(S, DOM, IO, Anim) {
    var curDocUrl;
    var doc = {
        init : function() {
            var editor = ace.edit('docEditor');
            var editorDOM = DOM.get('#docEditor');
            editor.setTheme('ace/theme/tomorrow_night');
            this.editor = editor;
            this.editorDOM = editorDOM;
        },
        loadData : function(url, type) {
            var editor = this.editor;
            var editorDOM = this.editorDOM;
            new IO({
                type : "get",
                url : url,
                success : function(data) {
                    //保存当前读取文件的url
                    curDocUrl = url;
                    //更新编辑器内容
                    editor.getSession().setMode('ace/mode/markdown');
                    editor.getSession().setValue(data);
                    editor.gotoLine(1);
                    editor.setReadOnly(false);
                    new Anim(editorDOM, {
                        'display' : 'block',
                        'opacity' : 1
                    }, 0.3).run();
                },
                dataType : 'text'
            });
        },
        save : function() {
            var data = this.editor.getValue();
            var self = this;
            new IO({
                type : "post",
                url : '/saveAction/',
                data : {
                    curDocUrl : curDocUrl,
                    data : data
                },
                success : function(data) {
                    if(data) {
                        self.fire('change');
                    }
                },
                dataType : 'text'
            });
        }
    };
    doc = S.mix(doc, S.EventTarget);
    return doc;
}, {
    requires : [
        'dom', 'ajax', 'anim'
    ]
});
