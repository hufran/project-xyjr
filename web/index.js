'use strict';
if (process.argv.indexOf('--run-by-gulp') > -1) {
    process.env.NODE_ENV = 'development'; }
if ((process.env.HOSTNAME || '').match(/UAT$/)) {
    process.env.NODE_APP_INSTANCE = 'uat';
}
GLOBAL.APP_ROOT = __dirname;
require('@ds/nrequire').watchRequiredFilesToRestart = true;
require('./touch_to_restart');
require('@ds/common');
console.log('config:', JSON.stringify(require('config'), null, '    '));
var logger = require('bunyan-hub-logger');
logger.replaceDebug();
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var config = require('config');
GLOBAL.CONFIG = config;
var userAgent = require('useragent');
var ds = require('@ds/base');

var port = Number(process.env.PORT || config.port) || 4000;
var app = exports = module.exports = require('express')();
ds.expose(app);
ds.apiproxy(app, config.urlBackend);
ds.request(app, config.urlBackend);
ds.prodrev(app);
app.use(require('cookie-parser')());
require('@ds/data').augmentReqProto(app.request);

app.use(require('express-favicon')(path.join(__dirname, '..', '/favicon.ico')));

app.disable('etag');
if (app.get('env') !== 'development') {
    app.enable('view cache');
}

require('@ds/watchify').augmentApp(app, {
    appRoot: __dirname,
    port: port
});
require('@ds/assets').augmentApp(app, {
    debug: true,
    appRoot: __dirname,
});

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
    res.layout = 'ccc/global/views/layouts/default.html';
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
            res.redirect('/account');
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

app.use(require('ccc/login').setBackUrl); // 全局模板变量添加 loginHrefWithUrl 为登录后返回当前页的登录页面链接
ds.loader(app);
app.get('/logout', function (req, res) {
    res.clearCookie('ccat');
    if (req.xhr) {
        res.send('');
    } else {
        res.redirect('/');
    }
});
require('@ds/render').augmentApp(app, {
    appRoot: __dirname,
});
if (app.get('env') === 'production') {
    app.use(require('ecstatic')({root: path.join(__dirname, '/dist')}));
    app.use('/ccc', require('ecstatic')({root: path.join(__dirname, '/ccc')}));
}

app.listen(port, '0.0.0.0', function () {
    console.log("server listening at http://127.0.0.1:%d",
        this.address()
        .port);
    if (process.argv.indexOf('--start-then-close') > -1) {
        process.exit(0);
    }
});
