"use strict";
"use strict";
require('ccc/global/js/modules/cccTab');
var utils = require('ccc/global/js/lib/utils');
var CccOk = require('ccc/global/js/modules/cccOk');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var CommonService = require('ccc/global/js/modules/common.js').CommonService;

var passwordRactive = new Ractive({
	el: '#ractive-container',
	template: require('ccc/newAccount/partials/settings/password.html'),
	data: {
		paymentPasswordHasSet : CC.user.paymentPasswordHasSet || false,
        step : '0',
		showFundPass: true,
		frontTab: 'fundPass',
		validateCode: {
            canGet: true
        },
        user: null,
        captcha: {
            img: '',
            token: '',
            captcha: ''
        }
	}
});

passwordRactive.on('checkTab', function (event) {
	var tab = event.node.getAttribute('data-tab');
	if (tab !== this.get('frontTab')) {
		this.set('frontTab', tab);
		this.set('showFundPass', !this.get('showFundPass'));
		clearError();
	}
});

passwordRactive.on('initialPassword', function () {
    var pwd = this.get('password');
    var rePwd = this.get('repassword');
    var isAcess = false;
    if (pwd === '') {
        showError('交易密码不能为空');
    } else if (rePwd === '') {
        showError('交易密码不能为空');
    } else if (pwd !== rePwd) {
        showError('两次密码输入不一致');
    } else {
        isAcess = true;
    }

    if(isAcess) {
        accountService.initialPassword(pwd, function (r) {
            if (r.success) {
                CccOk.create({
                    msg: '交易密码初始化成功！',
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
});

passwordRactive.on('updatePassword', function () {
    var oldpwd = this.get('oldPassword');
    var newPwd = this.get('newPassword');
    var reNewPwd = this.get('reNewPassword');
    var isAcess = false;
    if (oldpwd === '') {
        showError('原密码不能为空');
    } else if (newPwd === '' || reNewPwd === '') {
        showError('交易密码不能为空');
    } else if (oldpwd == newPwd) {
        showError('新密码原密码不能相同！');
    } else if (newPwd !== reNewPwd) {
        showError('两次密码输入不一致');
    }else if(newPwd.indexOf(' ')>-1){
        showError('含有非法字符:空格');
    }else {
        isAcess=true;
    }
    
   
    if(isAcess) {
         accountService.checkPassword(oldpwd,function(r){
        if(!r){
            showError("原始密码错误！");
           
        }else{
           
         accountService.updatePassword(oldpwd, newPwd, function (r) {
            if (r.success) {
                CccOk.create({
                    msg: '交易密码修改成功！',
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
        
    });
        
    } 
});

passwordRactive.on('resetPassword', function () {
    var pwd = this.get('password');
    var isAcess = false;

    if (pwd.indexOf(" ") >=0) {
        return showError("密码不能为空格");
    } else {
       
	    if (pwd === '') {
	        var r = confirm('您未输入重置密码，系统将生成随机的交易密码并发送到您的手机上,确定这样做吗？');
	        if (r) {
	            isAcess = true;
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

passwordRactive.on('tab', function (event) {
    var step = event.node.getAttribute('data-step');
    passwordRactive.set('step', step);
    clearError();
});

$("#newPassword").keyup(function(){
    var newPassword=$("#newPassword").val(); 
    if(newPassword.indexOf(' ')>-1){
        showError("含有非法字符:空格");
    }else{
        ractive.set({
           showErrorMessage: false 
        });
    }
    
});
$("#oldPassword").blur(function(){
    var oldPassword=$("#oldPassword").val().trim();
    
    accountService.checkPassword(oldPassword,function(r){
        if(!r){
            showError("原始密码错误！");
        }else{
            passwordRactive.set({
           showErrorMessage: false 
        });
        }
        
    });
});


CommonService.getCaptcha(function (res) {
    passwordRactive.set('captcha', {
        img: res.captcha,
        token: res.token,
        text: ''
    });
});

passwordRactive.on('changeCaptcha', function () {
    CommonService.getCaptcha(function (res) {
        passwordRactive.set('captcha', {
            img: res.captcha,
            token: res.token
        });
    });
});
passwordRactive.on("submit-modify-password", function (event) {
	event.original.preventDefault();
    var currentPassword = this.get("currentPassword");
    var newPassword = this.get("newPassword");
    var passwordConfirm = this.get("passwordConfirm");
    var captcha = this.get("captcha.captcha");
    if (!currentPassword) {
        // 没填就密码
        return showError("还未填写原密码");
    }

    if (!newPassword) {
        // 没填新密码
        return showError("还未填写新密码");
    }

    if (newPassword.length < 6) {
        return showError("密码长度必须大于6位");
    }
    if (newPassword.indexOf(" ") >=0) {
        return showError("密码不能为空格");
    }
    
    if (!passwordConfirm) {
        // 没重复新密码
        return showError("请重复新密码");
    }

    if (newPassword !== passwordConfirm) {
        return showError("两次密码不一致");
    }

    if (!captcha) {
        return showError('请填写图形验证码');
    }

    CommonService.checkCaptcha(passwordRactive.get('captcha'), function (res) {
        if (res.success) {

            if(currentPassword===newPassword){
                return showError('新密码不能与原始密码相同');
            }

            request.post("/newAccount/change_password")
                .type("form")
                .send({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    captcha: captcha
                })
                .end(function (err, res) {
                    res = JSON.parse(res.text);

                    if (res.success) {
                        
                        CccOk.create({
                            msg: '恭喜您修改密码成功！',
                            okText: '确定',
                            cancelText: '重新登录',
                            ok: function () {
                                window.location.pathname = "/login";
                            },
                            cancel: function () {
                                window.location.reload();
                            }
                        });
                        
                        return;
                    }

                    var msg = res.message;
                    return showError(msg);
                });
        } else {
            return showError(utils.errorMsg[res.error[0].message]);
        }
    });


    return false;
});


function showError(msg) {
    passwordRactive.set({
        showErrorMessage: true,
        errorMessage: msg
    });

    return false;
}
function clearError(msg) {
    passwordRactive.set({
        showErrorMessage: false,
        errorMessage: ''
    });
}