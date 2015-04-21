'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
var bodyParser = require('body-parser');
var config = require('config');
router.post('/login', bodyParser('json'), function (req, res) {
    var sendObj = {
        username: req.body.loginName,
        password: req.body.password,
        grant_type: 'password',
        client_id: config.oauth2client.id,
        client_secret: config.oauth2client.secret
    };
    //    if (req.body.publicKey) {
    //        sendObj.public_key = req.body.publicKey;
    //    }
    //    if (req.cookies.ccat) {
    //        sendObj.access_token = req.cookies.ccat;
    //    }
    req.uest.post('/api/v2/token')
        .type('form')
        .send(sendObj)
        .end()
        .then(function (r) {

            console.log(r.body);
            if (r.body && r.body.user) {
                res.cookie('ccat', r.body.access_token, {
                    maxAge: 30 * 60 * 1000
                });
                res.json({
                    success: true,
                    user: r.body.user
                });
            } else {
                res.json({
                    success: false,
                    error: 'LOGIN_INVALID'
                });
            }
            //                res.redirect(req.query.redirect ? (new Buffer(req.query
            //                        .redirect, 'base64'))
            //                    .toString() : '/account');
            //            } else if (r.body.result === 'NEED_CHANGE_PASSWORD') {
            //                res.redirect(
            //                    '/account/settings?hint=NEED_CHANGE_PASSWORD');
            //            } else if (r.body.error_description.result ===
            //                'USER_DISABLED') {
            //                res.redirect('/login?hint=USER_DISABLED');
            //            } else if (r.body.result !== 'FAILED') {
            //                res.redirect('/login?hint=' + r.body.result + (req.query
            //                    .redirect ? '&redirect=' + req.query.redirect :
            //                    ''));
            //            } else {
            //                res.redirect('/login?left=' + (6 - r.body.failedAttempts) +
            //                    (req.query.redirect ? '&redirect=' + req.query.redirect :
            //                        ''));
            //            }
        });
});