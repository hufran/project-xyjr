/**
 * @file 公用的数据交互层
 * @author huip(hui.peng@creditcloud.com)
 */

'use strict';

var request = require('cc-superagent-promise');
var cache = {};

exports.CommonService = {
    getCaptcha: function (next) {
        var timestamp = new Date() - 0;
        request('GET', '/api/v2/register/captcha?timestamp=' + timestamp)
            .set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
            .end()
            .then(function (res) {
                next(res.body);
            });
    },
    checkCaptcha: function (captcha, next) {
        request('POST', '/api/v2/register/captcha?token=' + captcha.token)
            .type('form')
            .send(captcha)
            .end()
            .then(function (res) {
                next(res.body);
            });
    },
    getSmsCaptcha: function (mobile, next) {
        request('GET', '/api/v2/register/smsCaptcha?mobile=' + mobile)
            .end()
            .then(function (res) {
                next(res.body);
            });
    },
    getVoiceCaptcha: function (mobile, next) {
        request('GET', '/api/v2/register/voiceCaptcha?mobile=' + mobile)
            .end()
            .then(function (res) {
                next(res.body);
            });
    },
    getUserInfo: function (next) {
        return cache.userInfo ? cache.userInfo :
            (cache.userInfo = request('GET', '/user/info')
            .end()
            .then(function (res) {
                if (typeof next === 'function') {
                    next(res.body);
                }
                return res.body;
            }));
    }
};