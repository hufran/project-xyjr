'use strict';

var conext = require('conext');
var config = require('config');
var ccBody = require('cc-body');

exports.captchaRequired = conext(function *(req, res, next) {
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

exports.registerPage = function(req, res, next){
    
    next();
};

exports.doRegister = conext(function *(req, res, next) {
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
                maxAge: config.loginCookieMaxAge || 30 * 60 * 1000,
                path: config.cookieApiOnly ? '/api' : void 0,
            });
        }
    }
    res.send(body);
});

exports.smsCaptcha = conext(function *(req, res, next) {
    req.uest('/api/v2/register/smsCaptcha', {
        query: {mobile: req.query.mobile}
    }).end().get('body').then(res.json.bind(res));
});

exports.voiceCaptcha = conext(function *(req, res, next) {
    req.uest('/api/v2/users/smsVoiceCaptcha', {
        query: {mobile: req.query.mobile}
    }).end().get('body').then(res.json.bind(res));
});

