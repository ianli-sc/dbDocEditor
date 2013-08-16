(function(S) {
    S.config({
        map: [[/\/([\d\.]+)\/doc-editor\/([\w\/]+)(-min)?/, "/$1/$2"]],
        packages: {
            'doc-editor': {
                tag     : '',
                path    : './script',
                charset : 'utf8'
            }
        }
    });
    S.use('doc-editor/app', function(S, App) {
        App.init();
    });
})(KISSY);
