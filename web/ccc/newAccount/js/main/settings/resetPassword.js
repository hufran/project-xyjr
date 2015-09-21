"use strict";
var CommonService = require('ccc/global/js/modules/common').CommonService;
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var CccOk = require('ccc/global/js/modules/cccOk');

var resetPasswordRactive = new Ractive({
	el: '#ractive-container',
	template: require('ccc/newAccount/partials/settings/resetPassword.html'),
	data: {
	}
});

resetPasswordRactive.on('resetPassword', function () {
    var pwd = this.get('password');
    var repwd = this.get('repassword');
    var smsCaptcha = this.get('smsCaptcha');
    var isAcess = false;
    if (pwd === "") {
        return showError('请填写交易密码');
    } else if (pwd.indexOf(" ") >=0) {
        return showError("密码不能为空格");
    } else if (pwd.length < 6) {
        return showError('交易密码至少为6位');
    } else if (pwd !== repwd ) {
        return showError('两次密码输入不一致');
    } else if (smsCaptcha.length < 6 || smsCaptcha === '') {
        return showError('短信验证码为6位');
    } else {
        clearError();
        isAcess = true;
        if (pwd === '') {
            var r = confirm('您未输入重置密码，系统将生成随机的交易密码并发送到您的手机上,确定这样做吗？');
            if (r) {
                isAcess = true;
            } else {
                isAcess = false;
            }
        } 
        
        if(isAcess) {
            accountService.resetPassword(pwd, smsCaptcha, function (r) {
                if (r) {
                    CccOk.create({
                        msg: '交易密码重置成功！',
                        okText: '确定',
                        // cancelText: '重新登录',
                        ok: function () {
                            window.location.href = "/newAccount/home";
                        },
                        cancel: function () {
                            window.location.reload();
                        }
                    });
                    return;
                }
            });
        } 

    }
});

resetPasswordRactive.on('sendCode', function (){

    if (!this.get('isSend')) {
        this.set('isSend', true);
        var smsType = 'CREDITMARKET_RESET_PAYMENTPASSWORD';
        CommonService.getMessage(smsType, function (r) {
            if (r.success) {
                countDown();
            }
        });
    }
});

function countDown() {
    $('.sendCode')
        .addClass('disabled');
    var previousText = '获取验证码';
    var msg = '$秒后重新发送';

    var left = 60;
    var interval = setInterval((function () {
        if (left > 0) {
            $('.sendCode')
                .html(msg.replace('$', left--));
        } else {
            ractive.set('isSend', true);
            $('.sendCode')
                .html(previousText);
            $('.sendCode')
                .removeClass('disabled');
            clearInterval(interval);
        }
    }), 1000);
}

function showError(msg) {
    resetPasswordRactive.set({
        showErrorMessage: true,
        errorMessage: msg
    });

    return false;
}
function clearError(msg) {
    resetPasswordRactive.set({
        showErrorMessage: false,
        errorMessage: ''
    });
}