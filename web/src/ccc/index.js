'use strict';
if ((process.env.HOSTNAME || '').match(/UAT$/)) {
    process.env.NODE_APP_INSTANCE = 'uat';
}
var path = require('path');
var config = require('config');
require('ds-require');
var ds = require('dysonshell');
var logger = require('bunyan-hub-logger');
if ((process.env.NODE_ENV || 'development') !== 'development') {
    logger.replaceConsole();
}
console.log('config:', JSON.stringify(require('config'), null, '    '));
logger.replaceDebug();
GLOBAL.CONFIG = config;
var userAgent = require('useragent');

require('./node-global')

var port = Number(process.env.PORT || config.port) || 4000;

import {app, server} from 'dysonshell/instance';

app.locals.dsLayoutPath = 'ccc/global/views/layouts/default';

if (config.startOAuthServer) {
    config.urlBackend = 'http://127.0.0.1:' + port + '/';
}
ds.request(app, config.urlBackend);
var Data = require('@ds/data');
app.use(function(req,res,next){
    req.data = new Data(req);
    next();
});
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
} else {
    ds.apiproxy(app, config.urlBackend);
}

var proxy = require('simple-http-proxy');
// 连连回调转发
_.each({
    '/depositReturn': '/depositReturn',
    '/withdrawReturn': '/withdrawReturn'
}, function (api, fe) {
    var proxyUrl = (config.proxy && config.proxy.market || 'http://127.0.0.1:8888').replace(/\/+$/, '') + '/api/v2/yeepay' + api;
    var log = require('bunyan-hub-logger')({app: 'web', name: 'yeepay'});
    app.use('/yeepay' + fe, proxy(proxyUrl, {
        onrequest: function (opts, req) {
            var chunks = [];
            req.on('data',function(chunk) {
                chunks.push(chunk);
            });
            req.on('end',function() {
                var buf = Buffer.concat(chunks);
                var body = buf.toString('utf-8');
                log.info({
                    type: 'yeepay'+fe+'/request',
                    req: req,
                    proxy: opts,
                    body: body,
                });
            });
        },
    }));
});

//ds.prodrev(app);
//require('@ds/data').augmentReqProto(app.request);



require('@ccc/inspect/middleware')(app);
app.use(async function (req, res, next) {
    var headerLinks = await req.uest.get('/api/v2/navigation/listPlayPanes').end().get('body');
    //除去display == false
     for(var i=0;i<headerLinks.length;i++){
        if(headerLinks[i].display == false ){
            headerLinks.splice(i,1);
            i-=1;
        }
    }
    for(var i=0;i< headerLinks.length; i++){
        headerLinks[i].childrenLink = [];
        for(var j=0;j<headerLinks.length; j++){
            if(headerLinks[i].id == headerLinks[j].parentId){
                headerLinks[i].childrenLink.push(headerLinks[j]);
            }
        }
    }
    for(var i=0;i<headerLinks.length;i++){
        if(headerLinks[i].parentId != ''){
            headerLinks.splice(i,1);
            i-=1;
        }
    }

    for(var i=0; i<headerLinks.length; i++){
        if(headerLinks[i].childrenLink != [] && headerLinks[i].childrenLink.length >= 1) {
            headerLinks[i].childrenLink = _.sortBy(headerLinks[i].childrenLink, 'ordinal');
        }
    }
    var resultLink = _.sortBy(headerLinks, 'ordinal');

    if (req.cookies.ccat) {
        var Md5keyData = await req.uest.get('/api/v2/getMd5keyData/MYSELF').end().get('body');
        var quickLogin;
        try {
            quickLogin = '/'+Md5keyData.data.mobile+'/'+Md5keyData.data.currentTime+'/'+Md5keyData.data.md5key+'.ht'
        } catch (e) {}
            resultLink = _.map(resultLink, function (one){
                if(one.redirectUrl === '/ctx1'){
                    one.redirectUrl = 'http://www.718vc.com/quickLogin/1' + quickLogin;
                }
                if(one.redirectUrl === '/ctx2'){
                    one.redirectUrl = 'http://www.718vc.com/quickLogin/2' + quickLogin;
                }
                return one;
            })
    }


    res.locals.headerNavLinks = resultLink;

    res.expose(Date.now(), 'serverDate');
    // res.layout = 'ccc/global/views/layouts/default.html';
//    res.locals.title = config.appName; // 设置html标题

    // global user
    if (!req.cookies.ccat) {
        res.expose({}, 'user');
        return next();
    }

    var user = ((await req.uest.get('/api/v2/whoamiplz').end().get('body')) || {}).user;

    res.expose(user || {}, 'user');
    if (!user) {
        return next();
    }
    res.locals.user = user;

    user.logined = true;
    if (user.email === 'notavailable@creditcloud.com') {
        user.email = '';
    }
    if (!user.accountId) {
        return next();
    }
    user.agreement = (await req.uest.get('/api/v2/user/MYSELF/agreement').end().get('body') || {});
    next();
});

_.each([
    '/login',
    '/register'
], function(url){
    app.get(url, function (req, res, next) {
        if (res.locals.user && res.locals.user.id) {
            res.redirect('/newAccount/home');
        }
        next();
    });
});

_.each([
    '/act'
], function(url){
    app.get(url, function (req, res, next) {
        if (res.locals.user && res.locals.user.id) {
            res.redirect('/act/success');
        }
        next();
    });
});

_.each([
    '/act/success'
], function(url){
    app.get(url, function (req, res, next) {
        if (!(res.locals.user && res.locals.user.id)) {
            res.redirect('/act');
        }
        next();
    });
});

// mobile page (H5) redirection
_.each([
    {path: '/'},
    {path: '/login'},
    {path: '/register'},
	{path: '/act'},
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

app.all('/logout', async function (req, res) {
    if (req.cookies.ccat) {
        var userId = _.get(await req.uest.get('/api/v2/whoamiplz').end().get('body'), 'user.id');
        var query = {
            type: 'USER_LOGOUT',
            source: req.query.source || 'PC',
        };

        if (!!userId) {
            req.uest.post('/api/v2/user/' + userId + '/add/activity').send(query).end();
        }
    }

    res.clearCookie('ccat');

    if (req.xhr) {
        res.send('');
    } else {
        res.redirect('/');
    }
    return false;
});

server.listen(port, '0.0.0.0', function () {
    console.log("server listening at http://127.0.0.1:%d",
        this.address()
        .port);
    if (process.argv.indexOf('--start-then-close') > -1) {
        process.exit(0);
    }
});
