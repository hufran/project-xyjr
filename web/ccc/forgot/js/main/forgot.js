'use strict';

var CommonService = require('assets/js/modules/common')
    .CommonService;
var forgotService = require('../service/forgot')
    .forgotService;
var template = require('ccc/forgot/partials/forgot.html');
var Ractive = require('ractive/ractive-legacy');
var utils = require('assets/js/lib/utils');
var forgotRactive = new Ractive({
    el: '.page-forgot',
    template: template,
    data: {
        captcha: {
            img: '',
            token: ''
        },
        isLegacy: CC.isLegacy,
        errors: {
            msg: '',
            visible: 'false'
        },
        user: {
            loginName: '',
            mobile: ''
        }
    }
});
CommonService.getCaptcha(function (res) {
    forgotRactive.set('captcha', {
        img: res.captcha,
        token: res.token
    });
});

forgotRactive.on('changeCaptcha', function () {
    CommonService.getCaptcha(function (res) {
        forgotRactive.set('captcha', {
            img: res.captcha,
            token: res.token
        });
    });
});

forgotRactive.on('doReset', function (e) {
    e.original.preventDefault();
    var user = {
        loginName: this.get('user.loginName'),
        mobile: this.get('user.mobile'),
        captcha: this.get('captcha.text'),
        token: this.get('captcha.token')
    };

    utils.formValidator.checkLoginName(user.loginName, function (err, msg) {
        if (!err) {
            showErrors(msg);
            return false;
        }
        utils.formValidator.checkMobile(user.mobile, function (err, msg) {
            if (!err) {
                showErrors(msg);
                return false;
            }
            forgotService.doReset(user, function (err,
                msg) {
                if (!err) {
                    showErrors(msg);
                    CommonService.getCaptcha(function (res) {
                        forgotRactive.set('captcha', {
                            img: res.captcha,
                            token: res.token
                        });
                    });
                } else {
                    //disableErrors();
                    showErrors('密码修改成功，新密码已发送到您的手机号，请重新登录', true);
                    setTimeout(function(){
                        showErrors('正转跳至登陆页面...', true);
                        window.location.href = '/login';
                    }, 2500);
                }
                return false;
            });
        });
    });


});

// show errors
function showErrors(error, isSucc) {
    isSucc = isSucc || false;
    forgotRactive
        .set('errors', {
            visible: true,
            isSucc: isSucc,
            msg: !isSucc ? utils.errorMsg[error] : error
        });
}


// disable errors
function disableErrors() {
    forgotRactive
        .set('errors', {
            visible: false,
            msg: ''
        });
}