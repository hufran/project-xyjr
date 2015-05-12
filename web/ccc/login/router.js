'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
var bodyParser = require('body-parser');
var config = require('config');
var errorsMap = {
    'LOGIN_NAME_NULL': '请填写手机号',
    'PASSWORD_NULL': '请填写密码',
    'INVALID_INPUT': '用户名或密码错误'
};

router.get('/login', function (req, res, next) {
    res.locals.backUrl = req.query.url;
    res.locals.errors = errorsMap[req.query.errors] || '';
    if (req.cookies.ccat) {
        return res.redirect('/');
    }
    //res.redirect("back");
    next();
});
router.post('/login', bodyParser('json'), function (req, res) {
    res.locals.backUrl = req.body.backUrl;
    console.log(req.body.backUrl);
    var location = req.body.location;
    var sendObj = {
        username: req.body.loginName,
        password: req.body.password,
        grant_type: 'password',
        client_id: config.oauth2client.id,
        client_secret: config.oauth2client.secret
    };
    if (!req.body.loginName) {
        if (location === 'index') {
            return res.redirect('/?errors=LOGIN_NAME_NULL');
        } else {
            return res.redirect('/login?errors=LOGIN_NAME_NULL');
        }
    }

    if (!req.body.password) {
        if (location === 'index') {
            return res.redirect('/?errors=PASSWORD_NULL');
        } else {
            return res.redirect('/login?errors=PASSWORD_NULL');
        }
    }
    req.uest.post('/api/v2/token')
        .type('form')
        .send(sendObj)
        .end()
        .then(function (r) {
            console.log(r.body);
            console.log("###", res.locals.backUrl);
            if (r.body && r.body.user) {
                res.cookie('ccat', r.body.access_token, {
                    maxAge: 30 * 60 * 1000
                });
                if (res.locals.backUrl) {
                    return res.redirect(new Buffer(res.locals.backUrl,
                        'base64'));
                }
                return res.redirect('/invest/list');
            } else {
                if (location === 'index') {
                    return res.redirect('/?errors=INVALID_INPUT');
                } else {
                    return res.redirect('/login?errors=INVALID_INPUT');
                }
            }
        });
});

// ajax login api
router.post('/ajaxLogin', bodyParser(), function (req, res) {
    res.locals.backUrl = req.body.backUrl;
    console.log(res.locals.backUrl);
    var sendObj = {
        username: req.body.loginName,
        password: req.body.password,
        grant_type: 'password',
        client_id: config.oauth2client.id,
        client_secret: config.oauth2client.secret
    };
    
    req.uest.post('/api/v2/token')
        .type('form')
        .send(sendObj)
        .end()
        .then(function (r) {
            console.log(r.body);
            if (r.body && r.body.user) {
                r.body.success = true;
                res.cookie('ccat', r.body.access_token, {
                    maxAge: 30 * 60 * 1000
                });
                if (res.locals.backUrl) {
                    r.body.redirect = new Buffer(res.locals.backUrl, 'base64').toString('utf-8');
                }
            } else {
                r.body.success = false;
            }
            res.send(r.body);
        });
});