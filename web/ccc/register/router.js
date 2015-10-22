'use strict';
var conext = require('conext');
var config = require('config');
var ccBody = require('cc-body');
var captchaRequired = conext(function *(req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    if (!req.query.captcha_token) {
        res.json({
            data: null,
            error: [{
                "message": "INVALID_REQUIRED",
                "type": "captcha",
                "value": null,
                "code": 0
            }],
            success: false
        });
        return;
    }
    var opts = {
        query: {
            invalidate: 1,
            token: req.query.captcha_token,
        },
        body: {
            captcha: req.query.captcha_answer,
        },
    };
    var r = yield req.uest.post('/api/v2/captcha', opts);
    var body = r.body;
    if (!body.success) {
        res.status(r.statusCode);
        res.send(body);
        return;
    }
    next();
});

module.exports = function (router) {
    router.get('/register', function(req,res,next) {
            var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '注册_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
    res.locals.keywords = '奇乐融注册';
    res.locals.description = '奇乐融(www.qilerong.com) - 联想控股成员企业--正奇金融旗下互联网金融战略平台，由安徽唯源金融信息服务有限公司运营。践行普惠金融，助力财富增值。奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';
    res.render('register');
        res.expose(req.query.refm, 'registerRel');
        next();
    });
    var result = {
        'SUCCESSFUL' : '邮箱认证成功！',
        'UNSUCCESSFUL':'邮箱认证失败！',
        'EXPIRED':'邮箱认证链接已过期！',
        'AUTHENTICATED':'邮箱已认证,请不要重复认证！'
    };
    router.get('/register/renzheng', function (req, res, next) {
        res.locals.message = result[req.query.message] || '';
        next();
    });
    router.get('/register/ajax/smsCaptcha', captchaRequired, conext(function *(req, res, next) {
        req.uest('/api/v2/register/smsCaptcha', {
            query: {mobile: req.query.mobile}
        }).get('body').then(res.json.bind(res));
    }));
    router.post('/register/ajax/submit', ccBody, conext(function *(req, res, next) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        var r = yield req.uest('POST', '/api/v2/users/register', {
            body: req.body,
        });
        var body = r.body;
        if (!body.success) {
            res.status(r.statusCode);
            res.send(body);
            return;
        }
        var loginOpts = {
            body: {
                username: req.body.loginName,
                password: req.body.password,
                grant_type: 'password',
                client_id: config.oauth2client.id,
                client_secret: config.oauth2client.secret,
            },
        };
        var rl = yield req.uest('POST', '/api/v2/token', loginOpts);
        var bodyl = rl.body;
        if (bodyl.access_token) {
            body.access_token = bodyl.access_token;
            if (!config.cookieFree) {
                res.cookie('ccat', body.access_token, {
                    maxAge: config.loginCookieMaxAge || 30 * 60 * 1000
                });
            }
        }
        res.send(body);
    }));
}

