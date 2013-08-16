KISSY.add('doc-editor/biz/tree', function(S, DOM, Tree, Anim, IO,
    Code,
    Preview
) {
    var tree = {
        init : function() {
            var self = this;
            var data = {"content":"buy-order","children":[{"content":"src","children":[{"content":"render","children":[{"content":"common.js"},{"content":"core.js"},{"content":"order.js"}]},{"content":"css","children":[{"content":"addr.css"},{"content":"addrmaker.css"},{"content":"authhk.css"},{"content":"base.css"},{"content":"checkbar.css"},{"content":"core.css"},{"content":"order.css"}]},{"content":"biz","children":[{"content":"addr.js"},{"content":"addrmaker.js"},{"content":"amount.js"},{"content":"authhk.js"},{"content":"checkcode.js"},{"content":"coupon.js"},{"content":"district.js"},{"content":"go.js"},{"content":"insure.js"},{"content":"invoice.js"},{"content":"paytype.js"},{"content":"point.js"},{"content":"postage.js"},{"content":"promo.js"},{"content":"service.js"},{"content":"shoppromo.js"},{"content":"wrt.js"}]},{"content":"app.js"},{"content":"init.js"},{"content":"model.js"},{"content":"util.js"}]},{"content":"resource","children":[{"content":"order-sprites.psd"}]},{"content":"demo","children":[{"content":"json","children":[{"content":"1.json"},{"content":"2.json"},{"content":"3.json"},{"content":"4.json"},{"content":"5.json"},{"content":"6.json"},{"content":"7.json"},{"content":"777.json"},{"content":"act.json"},{"content":"asyncRenderCoupon.htm"},{"content":"bug.json"},{"content":"select.json"},{"content":"ub.php"},{"content":"w.json"},{"content":"wg.json"}]},{"content":"confirm.php"}]},{"content":"build","children":[{"content":"render","children":[{"content":"common.js"},{"content":"core.js"},{"content":"order.js"}]},{"content":"css","children":[{"content":"addr.css"},{"content":"addrmaker.css"},{"content":"authhk.css"},{"content":"base.css"},{"content":"checkbar.css"},{"content":"core.css"},{"content":"order.css"}]},{"content":"biz","children":[{"content":"addr.js"},{"content":"addrmaker.js"},{"content":"amount.js"},{"content":"authhk.js"},{"content":"checkcode.js"},{"content":"coupon.js"},{"content":"district.js"},{"content":"go.js"},{"content":"insure.js"},{"content":"invoice.js"},{"content":"paytype.js"},{"content":"point.js"},{"content":"postage.js"},{"content":"promo.js"},{"content":"service.js"},{"content":"shoppromo.js"},{"content":"wrt.js"}]},{"content":"aio.css"},{"content":"aio.js"},{"content":"app.js"},{"content":"init.js"},{"content":"model.js"},{"content":"util.js"}]},{"content":"README.md"},{"content":"package.json"},{"content":"transfer.js"}]};
            new IO({
                url : '/src/',
                type : 'get',
                async : false,
                success : function(data) {
                    data = data;
                    var tree = self.render(data);
                    self.bindEvent(tree);
                }
            });
        },
        _renderChildren : function(root, data) {
            var self = this;
            S.each(data, function(item) {
                var childEl = new Tree.Node({
                    content : item.content,
                    parent : root
                });
                var subChildData = item.children;
                if(subChildData) {
                    self._renderChildren(childEl, subChildData);
                }
                root.addChild(childEl);
            });
        },
        render : function(data) {
            //通过DOM元素生成一棵简单树
            var tree = new Tree({
                content : data.content,
                expanded : true,
                render : '#tree'
            });

            this._renderChildren(tree, data.children);

            //渲染树
            tree.render();
            return tree;
        },
        /**
         * 递归获取该节点
         */
        _getNode : function(node, content) {
            if (node.content == content) {
                return node;
            }
            var c = node.children || [];
            for (var i = 0; i < c.length; i++) {
                var t = this._getNode(c[i], content);
                if (t) {
                    return t;
                }
            }
            return null;
        },
        /**
         * 递归获取节点的结构
         */
        _getConstruct : function(node) {
            var config = node.userConfig;
            var name = config.content;;
            if(config.parent) {
                name = this._getConstruct(config.parent) + '/' + name;
            }
            return name;
        },
        /**
         * 绑定树的响应
         */
        bindEvent : function(tree) {
            var self = this;
            tree.on('click',function(e) {
                var node = e.target;
                //缩放树
                if(node.get('children').length){
                    node.set('expanded',!node.get('expanded'));
                } else {
                    //加载内容
                    //显示toolbar
                    var toolbar = DOM.get('#toolbar');
                    DOM.css(toolbar, {
                        'display' : 'block'
                    });
                    new Anim(toolbar, {
                        'opacity' : '1'
                    }).run();
                    var type;
                    var userConfig = node.userConfig;
                    var name = userConfig.content;

                    //TODO 这个srcUrl和docUrl都需要再想想怎么弄更好
                    var rootSrcUrl = './src/';
                    var rootDocUrl = './doc/';
                    var construct = self._getConstruct(node);
                    var srcUrl = rootSrcUrl + construct;

                    var nameArray = name.split('.');
                    //获得代码的类型
                    name = nameArray[1].toUpperCase();

                    switch(name) {
                    case 'CSS' :
                        type = 'css';
                        break;
                    case 'JS' :
                        type = 'javascript';
                        break;
                    case 'PHP' :
                        type = 'php';
                        break;
                    case 'MD' :
                        type = 'markdown';
                        break;
                    case 'HTML' :
                        type = 'html';
                        break;
                    case 'JSON' :
                        type = 'json';
                        break;
                    case 'less' :
                        type = 'less';
                        break;
                    default :
                        type = 'html';
                    }

                    //获取文档，文档只允许md
                    var docUrl = rootDocUrl + construct;
                    docUrl = docUrl.substring(0, docUrl.lastIndexOf(nameArray[1])) + 'md';
                    Code.loadData(srcUrl, type);
                    Preview.loadData(docUrl);

                    //隐藏toolbar
                    var saveCodeBtn = DOM.get('#save_code');
                    var cancelCodeBtn = DOM.get('#cancel_code');
                    var saveDocBtn = DOM.get('#save_doc');
                    var cancelDocBtn = DOM.get('#cancel_doc');
                    //TODO 使用动画队列
                    new Anim(saveCodeBtn, {
                        'opacity' : 0
                    }, 0.3, 'easing', function() {
                        DOM.css(saveCodeBtn, {
                            'display' : 'none'
                        });
                    }, 0.3).run();
                    new Anim(cancelCodeBtn, {
                        'opacity' : 0
                    }, 0.3, 'easing', function() {
                        DOM.css(cancelCodeBtn, {
                            'display' : 'none'
                        });
                    }, 0.3).run();
                    new Anim(saveDocBtn, {
                        'opacity' : 0
                    }, 0.3, 'easing', function() {
                        DOM.css(saveDocBtn, {
                            'display' : 'none'
                        });
                    }, 0.3).run();
                    new Anim(cancelDocBtn, {
                        'opacity' : 0
                    }, 0.3, 'easing', function() {
                        DOM.css(cancelDocBtn, {
                            'display' : 'none'
                        });
                    }, 0.3).run();
                }
            });
            tree.on('expand', function (e) {
                var node = e.target;
                if (!node.get('children').length) {
                    var c = _getNode(data, node.get('content')).children;
                    S.each(c, function (v) {
                        node.addChild(new Tree.Node({
                            isLeaf:!(v.children && v.children.length),
                            content:v.content
                        }));
                    });
                }
            });
        }
    };
    return tree;
}, {
    requires : [
        'dom', 'tree', 'anim', 'ajax',
        'doc-editor/biz/code',
        'doc-editor/biz/preview'
    ]
})