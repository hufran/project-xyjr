'use strict';
if (process.argv.indexOf('--run-by-gulp') > -1) {
    process.env.NODE_ENV = 'development';
}
var fs = require('fs');
var path = require('path');
var httpProxy = require('http-proxy');
var config = require('config');
var cookieParser = require('cookie-parser');
var userAgent = require('useragent');
var glob = require('glob');
GLOBAL._ = require('lodash');
GLOBAL.Promise = require('bluebird'); // 目前 bluebird 实现的 Promise 性能比 V8 原生快很多，所以全局使用 bluebird
var port = parseInt(process.env.PORT, 10) || config.port;
var log = require('bunyan-hub-logger')({app: 'web', name: 'app'});

var consoleCode = fs.readFileSync(require.resolve('console/console.js'),
    'utf-8');
var app = module.exports = require('@ds/base')
    .createApp(__dirname);

// 需要全局暴露的 locals 加在 app.locals 上，config 模块都是 magic property，需要做成普通对象所以用

app.locals.PAY = _.assign({}, config.payment);

app.locals.rushHeads = [
    '<!doctype html>',
    //'<meta name="renderer" content="webkit">', // 临时解决360极速模式下transform-rotate问题,优先ie stand模式
    '<meta name="renderer" content="ie-stand">',
    '<meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1">',
    '<meta http-equiv="X-UA-Compatible" content="IE=9" />',
    '<script>' + consoleCode + '</script>',
    '<!--[if lt IE 9]><script src="/assets/js/ie8fix.js"></script><script src="/assets/js/PIE_IE678.js"></script><![endif]-->',
    '<script src="/assets/js/common/global.js" async></script>'
];
app.use(function (req, res, next) {
    var ua = userAgent.parse(req.headers['user-agent']),currentChannel="",originalUrl=req.originalUrl;
    log.debug({ua: ua, req: req});
    if (ua.family === 'IE' && ua.major === 7 && req.headers['user-agent'].indexOf('Trident/7') > -1) {
        ua.major = 11; // IE11 send 'MSIE 7.0' in compatible mode, so fix it by our own
    }
    if (ua.family === 'IE' && ua.major < 10) {
        res.locals.isLegacy = false;
        if (ua.major < 9) {
            res.locals.noMediaQueries = true;
        }
    } else {
        res.locals.isLegacy = true;
    }
    res.expose(res.locals.isLegacy, 'isLegacy');
    if (req.path.indexOf('/app') < 0) {
        res.locals.rushHeads = [
            '<link rel="stylesheet" href="/assets/css/base.css" />',
            '<!--[if IE 8]><link rel="stylesheet" href="/assets/css/ie8.css" /><![endif]-->',
        ];
    }
    //判断当前频道
    if(originalUrl=="/"||originalUrl=="/index"){
        currentChannel='index';
    }else if(/touzi/.test(originalUrl)){
        currentChannel='touzi';
    }else if(/safe/.test(originalUrl)){
        currentChannel='safe';
    }else if(/help/.test(originalUrl)){
        currentChannel='help';
    }else if(/info/.test(originalUrl)){
        currentChannel='info';
    }
    res.locals.currentChannel=currentChannel;
    next();
});
app.use(require('express-promise')());

var favicon = require('express-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

var proxyApi = httpProxy.createProxyServer({
    target: config.urlBackend
});
// 代理到 api 服务器
app.use(function (req, res, next) {
    if (req.url.indexOf('/api/v2') === 0) {
        proxyApi.web(req, res, {}, next);
    } else {
        next();
    }
});
if (app.get('env') !== 'development') {
    app.enable('view cache');
}

app.use(cookieParser());

app.get('/comingsoon', function (req, res, next) {
    res.end('coming soon...');
});
app.use(function (req, res, next) {
    if (req.url.match(/^\/u?payment\//)) {
        return next();
    }
    var pass =  'a80ccd635609152eca5d6e8b8cd952554762dc61d557d831323c8f06e7cc86ca';
    console.log(req.url);
    if (req.cookies) {
        if (req.cookies && req.cookies.pass === pass) {
            return next();
        }
    }
    console.log(req.query);
    if (req.query && req.query.pass === pass) {
        res.cookie('pass', pass, {maxAge: 1000*60*60*24});
        return res.redirect(req.url.replace(/([?&])pass=a80ccd635609152eca5d6e8b8cd952554762dc61d557d831323c8f06e7cc86ca/, '$1').replace(/\?$/, ''));
    }
    return res.redirect('/comingsoon');
});

// 给 req 添加 req.uest 方法
require('express-req-uest')(app, {
    prefix: config.urlBackend,
    augments: {
        cookies: false,
        custom: function (r, req) {
            if (req.cookies.ccat) {
                r.set('Authorization', 'Bearer ' + req.cookies.ccat);
            }
        }
    }
});

app.use(function (req, res, next) {
    if (req.cookies && req.cookies.ccat) { // 更新 cookie 时间，保持 30 分钟登录
        res.cookie('ccat', req.cookies.ccat, {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true
        });
    }
    next();
});

// dev login router test

app.get('/logout', function (req, res) {
    res.clearCookie('ccat');
    if (req.xhr) {
        res.end('');
    } else {
        res.redirect('/');
    }
});


// 全局 user
app.use(require('./middlewares/userInfo')
    .userInfo);

app.get('/user/info', function (req, res, next) {
    function mergeResBody(obj) {
        return function (r) {
            return _.assign(obj, r.body);
        };
    }

    req.uest.get('/api/v2/whoami')
        .end()
        .then(function (r) {
            if (!r.body || !r.body.user) {
                throw new Error('USERNONEXISTS');
            }
            return r.body.user;
        })
        .then(function (user) {
            return req.uest.get('/api/v2/user/' + user.id + '/userfund')
                .end()
                .then(mergeResBody(user));
        })
        .then(function (userWithUserFund) {
            return req.uest.get('/api/v2/user/' + userWithUserFund.id +
                '/payment')
                .end()
                .then(mergeResBody(userWithUserFund));
        })
        .then(function (userWithUserFundAndPayment) {
            res.json(userWithUserFundAndPayment);
        }, function () {
            res.json(null);
        });
});

(function loadWatchify() {
    if (app.get('env') !== 'development') {
        return;
    }
    var mainJSPaths = glob.sync('assets/js/main/**/*.js', {
        cwd: __dirname
    })
        .concat(glob.sync('ccc/*/js/main/**/*.js', {
            cwd: __dirname
        }));
    var target = 'http://127.0.0.1:' + (port + 1000) + '/node_modules';
    console.log('js entry files proxy target: ', target);
    var proxy = httpProxy.createProxyServer({
        target: target
    });
    app.use(function (req, res, next) {
        if (req.path.indexOf('/assets/js/common/') > -1 ||
            mainJSPaths.indexOf(req.path.replace(/^\//, '')) > -1) {
            proxy.web(req, res);
        } else {
            next();
        }
    });
    if (process.argv.indexOf('--run-by-gulp') === -1) {
        require('@ds/watchify')({
            appRoot: __dirname,
            port: config.port,
            commonjs: [].concat(config.commonjs).filter(Boolean)
        }).listen();
    }
}());

require('@ds/assets')
    .argmentApp(app, {
        debug: true,
        appRoot: __dirname,
        assetsDirName: 'assets',
        mqRemoveWidth: '1024px'
    });

var dsRender = require('@ds/render');
var rewriter = require('@ds/rewriter');

dsRender
    .argmentApp(app, {
        appendMiddleware: false,
        appRoot: __dirname,
        assetsDirName: 'assets',
        viewsDirName: './',
        rewriter: app.get('env') === 'development' ?
            rewriter.bind(null, {}) : rewriter.bind(null, require(
                './dist/rev.json'))
    });

var unary = require('fn-unary');
glob.sync('./ccc/*/router.js', {
    cwd: __dirname
})
    .map(unary(require.bind(null)))
    .map(unary(app.use.bind(app)));
app.use(dsRender.middleware());

var pairs = require('lodash-node/modern/objects/pairs');
var viewsMap = glob.sync('views/**/*.html', {
    cwd: __dirname
})
    .concat(glob.sync('ccc/*/views/**/*.html', {
        cwd: __dirname
    }))
    .reduce(function (r, filePath) {
        var index = filePath.indexOf('/views/');
        r[filePath.substring(index + '/views/'.length)] = filePath;
        return r;
    }, {});

app.get('/__introspect',
    function (req, res, next) {
        var links = pairs(viewsMap);
        var html = '模板文件：<br/>' + links.map(function (l) {
            return '<a href="' + l[1] + '">' + l[0] +
                '</a>';
        })
            .join('<br/>');
        res.type('html');
        res.send(html);
        next();
    });

app.listen(port, function () {
    console.log("server listening at http://127.0.0.1:%d", this.address()
        .port);
});
