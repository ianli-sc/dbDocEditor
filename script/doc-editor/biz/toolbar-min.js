/**
 * 控制条
 */
KISSY.add('doc-editor/biz/toolbar', function(S, DOM, Event, Anim,
    Code,
    Preview,
    Doc
) {
    var toolbar = {
        init : function() {
            this.nav = DOM.get('#nav');
            this.showTree = DOM.get('#show_tree');
            this.changeCode = DOM.get('#change_code');
            this.saveCode = DOM.get('#save_code');
            this.cancelCode = DOM.get('#cancel_code');
            this.changeDoc = DOM.get('#change_doc');
            this.saveDoc = DOM.get('#save_doc');
            this.cancelDoc = DOM.get('#cancel_doc');
            this.bindEvens();
        },
        bindEvens : function() {
            /**
             * 隐藏和显示代码树
             */
            var showTree = this.showTree;
            Event.on(this.showTree, 'click', function() {
                var text = '显示代码树';
                if(DOM.hasClass(showTree, 'showed')) {
                    new Anim(DOM.get('#editor'), {
                        'left' : '10px',
                        'box-shadow' : '',
                        '-webkit-box-shadow' : '',
                        '-moz-box-shadow' : ''
                    }, 0.3).run();
                    new Anim(DOM.get('#tree'), {
                        'width' : ''
                    }, 0.3).run();
                    DOM.removeClass(showTree, 'showed');
                } else {
                    new Anim(DOM.get('#editor'), {
                        'left' : '200px',
                        'box-shadow' : '-5px 0 3px #AAA',
                        '-webkit-box-shadow' : '-5px 0 3px #AAA',
                        '-moz-box-shadow' : '-5px 0 3px #AAA'
                    }, 0.3).run();
                    new Anim(DOM.get('#tree'), {
                        'width' : '200px'
                    }, 0.3).run();
                    text = '隐藏代码树';
                    DOM.addClass(showTree, 'showed');
                }

                DOM.text(showTree, text);
            });
            /**
             * 修改代码
             */
            var changeCode = this.changeCode;
            var saveCode = this.saveCode;
            var cancelCode = this.cancelCode;
            Event.on(changeCode, 'click', function(e) {
                var editor = Code.editor;
                editor.setReadOnly(false);
                new Anim(saveCode, {
                    'display' : 'inline-block',
                    '*display' : 'inline',
                    'opacity' : 1
                }, 0.3).run();
                new Anim(cancelCode, {
                    'display' : 'inline-block',
                    '*display' : 'inline',
                    'opacity' : 1
                }, 0.3).run();
                //隐藏文档修改器,显示代码修改器
//                var docEditor = DOM.get('#docEditor');
//                new Anim(docEditor, {
//                    'opacity' : 0
//                }, 0.3, 'easing', function() {
//                    DOM.css(docEditor, {
//                        'display' : 'none'
//                    });
//                }, 0.3).run();
                var codeEditor = DOM.get('#editor');
                new Anim(codeEditor, {
                    'opacity' : 1,
                    'display' : 'block'
                }, 0.3, 'easing').run();
            });
            /**
             * 保存修改。TODO
             */
            Event.on(saveCode, 'click', function(e) {
                //TODO 等待后端代码的完善
            });
            /**
             * 取消修改代码
             */
            Event.on(cancelCode, 'click', function(e) {
                new Anim(saveCode, {
                    'opacity' : 0
                }, 0.3, 'easing', function(){
                    DOM.css(saveCode, {
                        'display' : 'none'
                    });
                }, 0.3).run();
                new Anim(cancelCode, {
                    'opacity' : 0
                }, 0.3, 'easing', function(){
                    DOM.css(cancelCode, {
                        'display' : 'none'
                    });
                }).run();
                var editor = Code.editor;
                editor.setReadOnly(true);
                //至于是否还原修改的内容，因涉及到重新定位的问题而暂时不处理
                //TODO
            });
            /**
             * 修改文档
             */
            var changeDoc = this.changeDoc;
            var saveDoc = this.saveDoc;
            var cancelDoc = this.cancelDoc;
            Event.on(changeDoc, 'click', function(e) {
                var url = Preview.url;
                Doc.loadData(url);
//                //显示文档编辑器，就隐藏code编辑器
//                var codeEditor = DOM.get('#editor');
//                new Anim(codeEditor, {
//                    'opacity' : 0
//                }, 0.3, 'easing', function() {
//                    DOM.css(codeEditor, {
//                        'display' : 'none'
//                    });
//                }).run();

                new Anim(saveDoc, {
                    'display' : 'inline-block',
                    '*display' : 'inline',
                    'opacity' : 1
                }, 0.3).run();
                new Anim(cancelDoc, {
                    'display' : 'inline-block',
                    '*display' : 'inline',
                    'opacity' : 1
                }, 0.3).run();
            });
            /**
             * 保存文档的修改
             */
            Event.on(saveDoc, 'click', function(e) {
                Doc.save();
            });
            /**
             * 取消修改文档
             */
            Event.on(cancelDoc, 'click', function(e) {
                new Anim(saveDoc, {
                    'opacity' : 0
                }, 0.3, 'easing', function(){
                    DOM.css(saveDoc, {
                        'display' : 'none'
                    });
                }).run();
                new Anim(cancelDoc, {
                    'opacity' : 0
                }, 0.3, 'easing', function(){
                    DOM.css(cancelDoc, {
                        'display' : 'none'
                    });
                }).run();
                //显示代码编辑器就隐藏文档编辑器
                var docEditor = DOM.get('#docEditor');
                new Anim(docEditor, {
                    'opacity' : 0
                }, 0.3, 'easing', function() {
                    DOM.css(docEditor, {
                        'display' : 'none'
                    });
                }).run();
                var editor = DOM.get('#editor');
                new Anim(editor, {
                    'display' : 'block',
                    'opacity' : 1
                }, 0.3).run();
            });
        }
    };
    return toolbar;
}, {
    requires : [
        'dom', 'event', 'anim',
        'doc-editor/biz/code',
        'doc-editor/biz/preview',
        'doc-editor/biz/doc'
    ]
});
