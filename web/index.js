'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.argv.indexOf('--run-by-gulp') > -1) {
    process.env.NODE_ENV = 'development'; }
if ((process.env.HOSTNAME || '').match(/UAT$/)) {
    process.env.NODE_APP_INSTANCE = 'uat';
}
GLOBAL.APP_ROOT = __dirname;
var config = require('config');
require('ds-nrequire').watchRequiredFilesToRestart = true;
require('./touch_to_restart');
// require('@ds/common');
var logger = require('bunyan-hub-logger');
if (process.env.NODE_ENV !== 'development') {
    logger.replaceConsole();
}
console.log('config:', JSON.stringify(require('config'), null, '    '));
logger.replaceDebug();
var assert = require('assert');
var fs = require('fs');
var path = require('path');
GLOBAL.CONFIG = config;
var userAgent = require('useragent');
var ds = require('dysonshell');

require('./global')

var port = Number(process.env.PORT || config.port) || 4000;
var app = exports = module.exports = require('express')();
app.httpServer = require('http').createServer(app);
app.locals.dsLayoutPath = 'ccc/global/views/layouts/default';

app.locals.title = '国美金融';
app.locals.keywords = '国美金融';
app.locals.description = '国美金融';

app.use(require('cookie-parser')());
ds.request(app, config.urlBackend);

app.use('/api/web', ds.loader('api'));

if (config.startOAuthServer) {
    console.log('plug oauth2 server');
    var oauth2 = require('@cc/oauth2');
    app.use(function (req, res, next) {
        if ((req.url||'').match(/^\/api\//)) {
            return oauth2(req, res);
        }
        next();
    });
    config.urlBackend = 'http://127.0.0.1:' + port + '/';
} else {
    ds.apiproxy(app, config.urlBackend);
}
ds.expose(app);

var proxy = require('simple-http-proxy');
// 连连回调转发
_.each({
    '/depositReturn': '/depositReturn',
    '/withdrawReturn': '/withdrawReturn'
}, function (api, fe) {
    var proxyUrl = (config.proxy && config.proxy.market || 'http://127.0.0.1:8888').replace(/\/+$/, '') + '/api/v2/lianlianpay' + api;
    var log = require('bunyan-hub-logger')({app: 'web', name: 'lianlianpay'});
    app.use('/lianlianpay' + fe, proxy(proxyUrl, {
        onrequest: function (opts, req) {
            var chunks = [];
            req.on('data',function(chunk) {
                chunks.push(chunk);
            });
            req.on('end',function() {
                var buf = Buffer.concat(chunks);
                var body = buf.toString('utf-8');
                log.info({
                    type: 'lianlianpay'+fe+'/request',
                    req: req,
                    proxy: opts,
                    body: body,
                });
            });
        },
    }));
});

ds.prodrev(app);
//require('@ds/data').augmentReqProto(app.request);

app.use(require('express-favicon')(path.join(__dirname, '..', '/favicon.ico')));

app.disable('etag');
if (app.get('env') !== 'development') {
    app.enable('view cache');
}

require('ds-watchify/augment-app')(app, port);
require('ds-assets').augmentApp(app);

require('@ccc/inspect/middleware')(app);
app.use(function (req, res, next) {
    res.locals.headerNavLinks = [
        {
            name: '首页',
            href: '/',
        },
        {
            name: '我要投资',
            href: '/loan',
        },
        /* {
            name: '债权转让',
            href: '/assign',
        }, */
        {
            name: '我的账户',
            href: '/account',
        },
        {
            name: '安全保障',
            href: '/safety',
        },
        {
            name: '新手指南',
            href: '/guide',
        },
    ];
    res.expose(Date.now(), 'serverDate');
    // res.layout = 'ccc/global/views/layouts/default.html';
    res.locals.title = config.appName; // 设置html标题
    var ua = userAgent.parse(req.headers['user-agent']);
    if (ua.family === 'IE' && ua.major < 9) {
        res.locals.noMediaQueries = true;
    }

    // global user
    if (!req.cookies.ccat) {
        res.expose({}, 'user');
        return next();
    }

    req.uest.get('/api/v2/whoamiplz').then(function (r) {
        var user = r.body.user;
//        if (user) {
//            user.logined = true;
//            if (user.email === 'notavailable@creditcloud.com') {
//                user.email = '';
//            }
//            res.locals.user = res.locals.user || {};
//            if (!user.accountId) {
//                return expUser(user);
//            }
//            req.uest.get('/api/v2/user/MYSELF/agreement').get('body').then(function (body) {
//                user.agreement = body || {};
//                expUser(user);
//            });
//        } else {
//            res.expose({}, 'user');

         res.locals.user = res.locals.user || {};
        if (!user) {
            expUser({});
            return next();
        }
//        next();

        user.logined = true;
        if (user.email === 'notavailable@creditcloud.com') {
          user.email = '';
       }
      if (!user.accountId) {
          expUser(user);
           return next();
      }
        req.uest.get('/api/v2/user/MYSELF/agreement').get('body').then(function (body) {
           user.agreement = body || {};
           expUser(user);
          next();
        });
        function expUser(user) {
            _.assign(res.locals.user, user);
            res.expose(res.locals.user, 'user');
        }
    });
});

_.each([
    '/login',
    '/register'
], function(url){
    app.get(url, function (req, res, next) {
        if (res.locals.user && res.locals.user.id) {
            res.redirect('/newAccount');
        }
        next();
    });
});

// mobile page (H5) redirection
_.each([
    {path: '/'},
    {path: '/login'},
    {path: '/register'},
    {path: '/invest', new_path: '/list'},
    {path: '/account', new_path: '/dashboard'},

], function (item) {
    var prefix = '/h5',
        path = item.path,
        new_path = item.new_path,
        LLUN = null;

    app.get(path, function (req, res, next) {
        var ua = userAgent.parse(req.headers['user-agent']);

        if ((ua.source || '').match(/MicroMessenger|Android|webOS|iPhone|iPod|BlackBerry/)) {
            return res.redirect(prefix + (new_path || req.url));
        }

        next();
    });
});

app.use(require('@ccc/login/middlewares').setBackUrl); // 全局模板变量添加 loginHrefWithUrl 为登录后返回当前页的登录页面链接
app.use('/__', ds.loader('hide'));
app.use(ds.loader('page'));
app.all('/logout', function (req, res) {
    res.clearCookie('ccat');
    if (req.xhr) {
        res.send('');
    } else {
        res.redirect('/');
    }
});
require('ds-render').augmentApp(app);
if (app.get('env') === 'production') {
    app.use(require('ecstatic')({root: path.join(__dirname, '/dist')}));
    app.use('/ccc', require('ecstatic')({root: path.join(__dirname, '/ccc')}));
}

app.httpServer.listen(port, '0.0.0.0', function () {
    console.log("server listening at http://127.0.0.1:%d",
        this.address()
        .port);
    if (process.argv.indexOf('--start-then-close') > -1) {
        process.exit(0);
    }
});
