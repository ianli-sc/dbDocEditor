/**
 * 控制面板
 */
KISSY.add('doc-editor/biz/dashboard', function(S, DOM, Event, Anim, Code, Doc) {
    var Dashboard = {
        init : function() {
            //设置按钮
            var settingBtn = DOM.get('#setting');
            var dashboard = DOM.get('#dashboard');
            Event.on(settingBtn, 'click', function() {
                if(DOM.hasClass(dashboard, 'showed')) {
                    new Anim(dashboard, {
                        'left' : '-350px'
                    }, 0.1).run();
                    DOM.removeClass(dashboard, 'showed');
                } else {
                    new Anim(dashboard, {
                        'left' : '10px'
                    }, 0.1).run();
                    DOM.addClass(dashboard, 'showed');
                }
            });

            this._bindDashboardEvents(dashboard);
        },
        /**
         * 绑定设置的按钮与code editor和doc editor的关系
         */
        _bindDashboardEvents : function() {
            var codeEditor = Code.editor;
            var docEditor = Doc.editor;
            //theme
            var codeTheme = DOM.get('#code_theme');
            Event.on(codeTheme, 'change', function() {
                codeEditor.setTheme(DOM.val(codeTheme));
            });
            var docEditorTheme = DOM.get('#doc_editor_theme');
            Event.on(docEditorTheme, 'change', function() {
                docEditor.setTheme(DOM.val(docEditorTheme));
            });

            //full line selection
            var flsBtn = DOM.get('#select_style');
            Event.on(flsBtn, 'click', function() {
                var model = DOM.attr(flsBtn, 'checked') ? 'line' : 'text';
                codeEditor.setSelectionStyle(model);
                docEditor.setSelectionStyle(model);
            });

            //high light active
            var hlaBtn = DOM.get('#highlight_active');
            Event.on(hlaBtn, 'click', function() {
                codeEditor.setHighlightActiveLine(DOM.attr(hlaBtn, 'checked'));
                docEditor.setHighlightActiveLine(DOM.attr(hlaBtn, 'checked'));
            });

            //show invisibles
            var siBtn = DOM.get('#show_hidden');
            Event.on(siBtn, 'click', function() {
                codeEditor.setShowInvisibles(DOM.attr(siBtn, 'checked'));
                docEditor.setShowInvisibles(DOM.attr(siBtn, 'checked'));
            });

            //show indent guides
            var sigBtn = DOM.get('#display_indent_guides');
            Event.on(sigBtn, 'click', function() {
                codeEditor.setDisplayIndentGuides(DOM.attr(sigBtn, 'checked'));
                docEditor.setDisplayIndentGuides(DOM.attr(sigBtn, 'checked'));
            });

            //show gutter
            var sgBtn = DOM.get('#show_gutter');
            Event.on(sgBtn, 'click', function() {
                codeEditor.renderer.setShowGutter(DOM.attr(sgBtn, 'checked'));
                docEditor.renderer.setShowGutter(DOM.attr(sgBtn, 'checked'));
            });

            //show print margin
            var spmBtn = DOM.get('#show_print_margin');
            Event.on(spmBtn, 'click', function() {
                codeEditor.renderer.setShowPrintMargin(DOM.attr(spmBtn, 'checked'));
                docEditor.renderer.setShowPrintMargin(DOM.attr(spmBtn, 'checked'));
            });

            //use soft tab
            var ustBtn = DOM.get('#soft_tab');
            Event.on(ustBtn, 'click', function() {
                codeEditor.getSession().setUseSoftTabs(DOM.attr(ustBtn, 'checked'));
                docEditor.getSession().setUseSoftTabs(DOM.attr(ustBtn, 'checked'));
            });

            //highlight selected word
            var hswBtn = DOM.get('#highlight_selected_word');
            Event.on(hswBtn, 'click', function() {
                codeEditor.setHighlightSelectedWord(DOM.attr(hswBtn, 'checked'));
                docEditor.setHighlightSelectedWord(DOM.attr(hswBtn, 'checked'));
            });

            //fade fold widgets
            var ffwBtn = DOM.get('#fade_fold_widgets');
            Event.on(ffwBtn, 'click', function() {
                codeEditor.setFadeFoldWidgets(DOM.attr(ffwBtn, 'checked'));
                docEditor.setFadeFoldWidgets(DOM.attr(ffwBtn, 'checked'));
            });
        }
    };

    return Dashboard;

}, {
    requires : [
        'dom', 'event', 'anim',
        'doc-editor/biz/code',
        'doc-editor/biz/doc'
    ]
});