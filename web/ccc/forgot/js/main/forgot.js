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
                } else {
                    disableErrors();
                    window.location.href = '/';
                }
                return false;
            });
        });
    });


});

// show errors
function showErrors(error) {
    forgotRactive
        .set('errors', {
            visible: true,
            msg: utils.errorMsg[error]
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