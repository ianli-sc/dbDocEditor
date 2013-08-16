/**
 * 代码编辑和view的区域
 */
KISSY.add('doc-editor/biz/code', function(S, DOM, IO, Anim) {
    var code = {
        init : function() {
            var editor = ace.edit('editor');
            var editorDOM = DOM.get('#editor');
            editor.setTheme('ace/theme/github');
            this.editor = editor;
            this.editorDOM = editorDOM;
        },
        loadData : function(url, type) {
            url = url || 'doc/js.js';
            var editor = this.editor;
            var editorDOM = this.editorDOM;
            new IO({
                type : "get",
                url : url,
                success : function(data) {
                    editor.getSession().setMode('ace/mode/' + type);
                    editor.getSession().setValue(data);
                    editor.gotoLine(1);
                    editor.setReadOnly(true);
                    new Anim(editorDOM, {
                        'display' : 'block',
                        'opacity' : 1
                    }, 0.3).run();
                    //显示代码编辑器就隐藏文档编辑器
                    var docEditor = DOM.get('#docEditor');
                    new Anim(docEditor, {
                        'opacity' : 0
                    }, 0.3, 'easing', function() {
                        DOM.css(docEditor, {
                            'display' : 'none'
                        });
                    }).run();
                },
                dataType : 'text'
            });
        }
    };
    return code;
}, {
    requires : [
        'dom', 'ajax', 'anim'
    ]
});
