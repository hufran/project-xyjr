'use strict';

var CommonService = require('ccc/global/js/modules/common')
    .CommonService;
var accountService = require('ccc/account/js/main/service/account')
    .accountService;
var template = require('ccc/account/partials/feedback/feedback.html');
var utils = require('ccc/global/js/lib/utils');

var feedbackRactive = new Ractive({
    el: '.feedback-ractive-container',
    template: template,
    data: {
        captcha: {
            img: '',
            token: ''
        },
        user: {
            advice: '',
            mobile: ''
        },
        errors: {
            msg: '',
            visible: 'false'
        }
    }
});
CommonService.getCaptcha(function (res) {
    feedbackRactive.set('captcha', {
        img: res.captcha,
        token: res.token
    });
});

feedbackRactive.on('changeCaptcha', function () {
    CommonService.getCaptcha(function (res) {
        feedbackRactive.set('captcha', {
            img: res.captcha,
            token: res.token
        });
    });
});

feedbackRactive.on('submit', function (e) {
    e.original.preventDefault();
    var user = {
        advice: this.get('user.advice'),
        mobile: this.get('user.mobile'),
        captcha: this.get('captcha.text'),
        token: this.get('captcha.token')
    };

    if (!user.advice) {
        feedbackRactive.set('errors', {
            visible: true,
            msg: '意见不能为空'
        });
        return false;
    }


    utils.formValidator.checkMobile(user.mobile, function (
        err, msg) {
        if (!err) {
            showErrors(msg);
            return false;
        }

        if (!user.captcha) {
            feedbackRactive.set('errors', {
                visible: true,
                msg: '请输入验证码'
            });
            return false;
        }
        var captcha = {
            captcha: user.captcha,
            token: user.token
        };


        CommonService.checkCaptcha(captcha,
            function (res) {
                if (!res.success) {
                    feedbackRactive.set('errors', {
                        visible: true,
                        msg: '验证码不正确'
                    });
                    return false;
                }
            })
        var params = {
            userId: CC.user.id,
            name: CC.user.name,
            contact: user.mobile,
            feedback: user.advice
        };
        accountService.feedback(CC.user.id, params, function (
            res) {
                if(res.success){
                    alert('反馈成功');
                    window.location.href = '/account/feedback';
                }else{
                    alert('反馈失败');
                }
                
        });
    });


});

// show errors
function showErrors(error) {
    feedbackRactive
        .set('errors', {
            visible: true,
            msg: utils.errorMsg[error]
        });
}


// disable errors
function disableErrors() {
    feedbackRactive
        .set('errors', {
            visible: false,
            msg: ''
        });
}
