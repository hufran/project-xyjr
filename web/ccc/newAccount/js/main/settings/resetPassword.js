"use strict";
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
    var isAcess = false;

    if (pwd.indexOf(" ") >=0) {
        return showError("密码不能为空格");
    } else {
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
            accountService.resetPassword(pwd, function (r) {
                if (r) {
                    CccOk.create({
                        msg: '交易密码重置成功！',
                        okText: '确定',
                        // cancelText: '重新登录',
                        ok: function () {
                            window.location.reload();
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