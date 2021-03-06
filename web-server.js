#!/usr/bin/env node

var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events'),
    qs = require('querystring');

var DEFAULT_PORT = 8000;

function main(argv) {
    new HttpServer({
        'GET': createServlet(StaticServlet),
        'HEAD': createServlet(StaticServlet),
        'POST': createServlet(StaticServlet)
    }).start(Number(argv[2]) || DEFAULT_PORT);
}

function createServlet(Class) {
    var servlet = new Class();
    return servlet.handleRequest.bind(servlet);
}

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * @param {Object} Map of method => Handler function
 */

function HttpServer(handlers) {
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));
}

HttpServer.prototype.start = function (port) {
    this.port = port;
    this.server.listen(port);
    util.puts('Http Server running at http://localhost:' + port + '/, Please visit http://localhost:' + port + '/index.htm ');
};

HttpServer.prototype.parseUrl_ = function (urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};

HttpServer.prototype.handleRequest_ = function (req, res) {
    var logEntry = req.method + ' ' + req.url;
    //UA检测
    var ua = req.headers['user-agent'];
//    if (/confirmOrder/.test(req.url) && req.headers['user-agent']) {
//        logEntry += ' with UA: ' + req.headers['user-agent'];
//    }
    util.puts(logEntry);
    req.url = this.parseUrl_(req.url);
    var handler = this.handlers[req.method];
    if (!handler) {
        res.writeHead(501);
        res.end();
    } else {
        handler.call(this, req, res);
    }
};

/**
 * Handles static content.
 */
function escapeHtml(value) {
    return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

function StaticServlet() {}

StaticServlet.MimeMap = {
    'txt': 'text/plain',
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
     'svg': 'image/svg+xml',
    'md' : 'text/plain'
};

StaticServlet.prototype.handleRequest = function (req, res) {
    var self = this;
    var path = ('./' + req.url.pathname).replace('//', '/').replace(/%(..)/g, function (match, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    });
    var parts = path.split('/');
    if (parts[parts.length - 1].charAt(0) === '.') {
        return self.sendForbidden_(req, res, path);
    }

    //file writer
    if(/saveAction/.test(path)) {
        return self.saveFile_(req, res);
    }

    //file reader & static data getter
    fs.stat(path, function (err, stat) {
        if (err) {
            //if call to get a doc file,just create it!
            if(/.md$/.test(path)) {
                return createDocFile(path, res);
            }
            return self.sendMissing_(req, res, path);
        }
        if (stat.isDirectory()) {
            return self.sendDirectory_(req, res, path);
        }
        return self.sendFile_(req, res, path);
    });
}

StaticServlet.prototype.sendError_ = function (req, res, error) {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>Internal Server Error</title>\n');
    res.write('<h1>Internal Server Error</h1>');
    res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
    util.puts('500 Internal Server Error');
    util.puts(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function (req, res, path) {
    path = path.substring(1);
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>404 Not Found</title>\n');
    res.write('<h1>Not Found</h1>');
    res.write(
        '<p>The requested URL ' +
        escapeHtml(path) +
        ' was not found on this server.</p>'
    );
    res.end();
    util.puts('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function (req, res, path) {
    path = path.substring(1);
    res.writeHead(403, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>403 Forbidden</title>\n');
    res.write('<h1>Forbidden</h1>');
    res.write(
        '<p>You do not have permission to access ' +
        escapeHtml(path) + ' on this server.</p>'
    );
    res.end();
    util.puts('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendRedirect_ = function (req, res, redirectUrl) {
    res.writeHead(301, {
        'Content-Type': 'text/html',
        'Location': redirectUrl
    });
    res.write('<!doctype html>\n');
    res.write('<title>301 Moved Permanently</title>\n');
    res.write('<h1>Moved Permanently</h1>');
    res.write(
        '<p>The document has moved <a href="' +
        redirectUrl +
        '">here</a>.</p>'
    );
    res.end();
    util.puts('301 Moved Permanently: ' + redirectUrl);
};

StaticServlet.prototype.sendFile_ = function (req, res, path) {
    var self = this;
    var file = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function () {
            res.end();
        });
        file.on('error', function (error) {
            self.sendError_(req, res, error);
        });
    }
};

StaticServlet.prototype.sendDirectory_ = function (req, res, path) {
    var self = this;
    var pathname = req.url.pathname;
    if (path.match(/[^\/]$/)) {
        req.url.pathname += '/';
        var redirectUrl = url.format(url.parse(url.format(req.url)));
        return self.sendRedirect_(req, res, redirectUrl);
    }

    //isReading the dir?
    var isGetSrcDir = false;
    if(/(^\/src|^\/doc)/.test(pathname)) {
        isGetSrcDir = true;
    }

    fs.readdir(path, function (err, files) {
        if (err) {
            return self.sendError_(req, res, error);
        }

        if(isGetSrcDir) {
            //remove the last ‘/’
            path = path.replace(/\/$/, '');
            return self.getAllSrcDir_(req, res, path);
        }

        if (!files.length)
            return self.writeDirectoryIndex_(req, res, path, []);

        var remaining = files.length;
        files.forEach(function (fileName, index) {
            fs.stat(path + '/' + fileName, function (err, stat) {
                if (err)
                    return self.sendError_(req, res, err);
                if (stat.isDirectory()) {
                    files[index] = fileName + '/';
                }
                if (!(--remaining))
                    return self.writeDirectoryIndex_(req, res, path, files);
            });
        });
    });
};

StaticServlet.prototype.writeDirectoryIndex_ = function (req, res, path, files) {
    path = path.substring(1);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if (req.method === 'HEAD') {
        res.end();
        return;
    }
    res.write('<!doctype html>\n');
    res.write('<title>' + escapeHtml(path) + '</title>\n');
    res.write('<style>\n');
    res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
    res.write('</style>\n');
    res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
    res.write('<ol>');
    files.forEach(function (fileName) {
        if (fileName.charAt(0) !== '.') {
            res.write('<li><a href="' +
                escapeHtml(fileName) + '">' +
                escapeHtml(fileName) + '</a></li>');
        }
    });
    res.write('</ol>');
    res.end();
};

//save file data from page
StaticServlet.prototype.saveFile_ = function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        //write file
        fs.writeFileSync(data.curDocUrl, data.data);
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write('success');
        res.end();
    });
//    var srvUrl = url.parse(req.url);
//    var queryData = srvUrl.query;
//    var data = srvUrl.data;
//    var path = queryData.curDocUrl;
//
//    var result = fs.writeFileSync(path, data);
}

//get all src dir for tree
StaticServlet.prototype.getAllSrcDir_ = function(req, res, path) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    var dirData = getDirData(path, path).children[0];
    res.write(JSON.stringify(dirData));
    res.end();
}

//Recurse get all files and formate to json
function getDirData(path, name) {
    var tmpData = {};
    console.log('get Path: ' + path);
    //key 写入content
    tmpData.content = name;
    //读取该地址信息
    var stat = fs.statSync(path);
    //如果该地址信息是个目录
    if(stat.isDirectory()) {
        //建立子节点
        tmpData.children = [];
        //读取子节点
        var files = fs.readdirSync(path);
        //排序
        files = sortFiles(path, files);
        //遍历子节点
        files.forEach(function(fileName) {
            //构建子节点的内容，推送到child
            var subPath = path + '/' + fileName;
            tmpData.children.push(getDirData(subPath, fileName));
        });
    }
    return tmpData;
}

//Sort the files as order as eclipse
function sortFiles(rootPath, files) {
    //seperate with dir or file
    var dirArray = [];
    var fileArray = [];

    files.forEach(function(fileName) {
        //except hidden file & folder
        if(!/(^\.|\.svntmp$)/.test(fileName)) {
            var subPath = rootPath + '/' + fileName;
            var stat = fs.statSync(subPath);
            if(stat.isDirectory()) {
                dirArray.push(fileName);
            } else {
                fileArray.push(fileName);
            }
        }
    });

    dirArray.sort();
    fileArray.sort();
    var result = dirArray.concat(fileArray);
    return result;
}

//create doc file
function createDocFile(path, res) {
    //not able to create file with out folder of parent
    var lastIndex = path.lastIndexOf('/');
    var dir = path.substring(0, lastIndex);
    //./doc/buy-order/src
    var pathArray = dir.split('/');
    var curPath = '';

    pathArray.forEach(function(pathName) {
        curPath += pathName + '/';
        if(!fs.existsSync(curPath)) {
            fs.mkdirSync(curPath);
        }
    });

    fs.writeFileSync(path, '# Insert Title here');
    var fileData = fs.readFileSync(path);
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write(fileData);
    res.end();
}

// Must be last,
main(process.argv);