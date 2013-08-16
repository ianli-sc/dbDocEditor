/**
 * 文档编辑器入口函数
 */
KISSY.add('doc-editor/app', function(S, DOM, Event, Anim,
    Tree,
    Code,
    Preview,
    Toolbar,
    Doc,
    Dashboard
) {
    var app = {
        init : function() {
            Tree.init();
            Code.init();
            Preview.init();
            Toolbar.init();
            Doc.init();
            Dashboard.init();
            this.bindEvents();
        },
        /**
         * 绑定页面的基本响应
         */
        bindEvents : function() {
            //关于页面
            var aboutBtn = DOM.get('#about');
            var aboutTimer;
            Event.on(aboutBtn, 'mouseenter', function(e) {
                clearTimeout(aboutTimer);
                S.each(DOM.query('dd', aboutBtn), function(item) {
                    DOM.css(item, {
                        'display' : 'block'
                    });
                });
                new Anim(aboutBtn, {
                    'width' : '340px',
                    'height' : '175px'
                }, 0.1, 'easing').run();
            });

            Event.on(aboutBtn, 'mouseleave', function(e) {
                aboutTimer = setTimeout(function() {
                    new Anim(aboutBtn, {
                        'width' : '140px',
                        'height' : '30px'
                    }, 0.1, 'easing', function() {
                        S.each(DOM.query('dd', aboutBtn), function(item) {
                            DOM.css(item, {
                                'display' : 'none'
                            });
                        });
                    }).run();
                }, 50);
            });

        }
    };
    return app;
}, {
    requires : [
        'dom', 'event', 'anim',
        'doc-editor/biz/tree',
        'doc-editor/biz/code',
        'doc-editor/biz/preview',
        'doc-editor/biz/toolbar',
        'doc-editor/biz/doc',
        'doc-editor/biz/dashboard'
    ]
});

