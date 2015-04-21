/**
 * @file 注册的数据交互层
 * @author huip(hui.peng@creditcloud.com)
 */

'use strict';
var request = require('cc-superagent-promise');

exports.RegisterService = {
    checkLoginName: function (loginName, next) {
        request
            .post('/api/v2/register/check_login_name')
            .send('loginName=' + loginName)
            .end()
            .then(function (res) {
                next(res.body.success, res.body.error);
            });
    },
    checkMobile: function (mobile, next) {
        request
            .post('/api/v2/register/check_mobile')
            .send('mobile=' + mobile)
            .end()
            .then(function (res) {
                next(res.body.success, res.body.error);
            });
    },
    doRegister: function (user, next) {
        request
            .post('/api/v2/register')
            .type('form')
            .send(user)
            .end()
            .then(function (res) {
                next(res.body, res.body.error);
            });
    },
    checkInvitation: function (params,next) {
        
        return next({
            success: true,
            message: null
        });
        
        request
            .get('/register/invitation?' + params)
            .end()
            .then(function (res) {
                next(res);
            });
    }
};