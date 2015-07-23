
"use strict";
var utils = require('ccc/global/js/lib/utils');
var maskLayer = require('ccc/global/js/lib/maskLayer');
var formValidator = utils.formValidator;
var rePasswordService = require('../service/rePassword')
    .rePasswordService;
var CommonService = require('ccc/global/js/modules/common.js').CommonService;
var forgotService = require('../service/forgot')
    .forgotService;

var returnMap = {
  'INVALID_CAPTCHA' : '验证码不正确',
  'MOBILE_NAME_NOT_MATCH' : '用户名和手机号码不匹配'
};

var rePassword = new Ractive({
    el: '#u-page-container',
    template: require('../../partials/rePassword.html'),
    init:function(){
      if (!CC.user.id) {
        // window.location.href = '/';
      }
    },
    data: {
        // 这里存放有关于注册用户的所有信息
        telcode:false,
        phone:null,
        time:120,
        visible: false,
        step1: true,
        step2: false,
        step3: false,
        step4: false,
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

// 获取验证码
CommonService.getCaptcha(function (res) {
  rePassword.set('captcha', {
        img: res.captcha,
        token: res.token
    });
});

rePassword.on('changeCaptcha', function () {
    CommonService.getCaptcha(function (res) {
      rePassword.set('captcha', {
            img: res.captcha,
            token: res.token
        });
    });
});

rePassword.on('step1', function (e) {
    e.original.preventDefault();
    
    var user = {
//        loginName: this.get('user.loginName'),
        mobile: this.get('user.mobile'),
        captcha: this.get('captcha.text'),
        token: this.get('captcha.token')
    };
//    utils.formValidator.checkLoginName(user.loginName, function (err, msg) {
//        if (!err) {
//            showErrors(msg);
//            return false;
//        }
        utils.formValidator.checkMobile(user.mobile, function (err, msg) {
            if (!err) {
                showErrors(msg);
                return false;
            }
            rePasswordService.verifyLoginNameAndMobile(user, function (err,
                msg) {
                if (!err) {
                    showErrors(msg);
                } else {
                    disableErrors();
                    rePassword.set('step1',false);
                    rePassword.set('step2',true);
                }
                return false;
            });
        });
//    });
});

rePassword.on('next',function(e){
  e.original.preventDefault();
  var user = {
      mobile: this.get('user.mobile'),
      captcha: this.get('phone'),
      smsType: 'CONFIRM_CREDITMARKET_CHANGE_LOGIN_PASSWORD'
  };
  rePasswordService.verifyMobileCaptcha(user, function (err, msg) {
    if (!err) {
        showErrors(msg);
    } else {
        disableErrors();
        rePassword.set('step2',false);
        rePassword.set('step3',true);
    }
    return false;
  });
});


rePassword.on('login', function (e) {
    e.original.preventDefault();
    var user = {
        mobile: this.get('user.mobile'),
        newPassword: this.get('newPass'),
        rePass: this.get('rePass'),
        captcha: this.get('phone')
    };
    var isVer = true;
    if (!user.newPassword || !user.rePass ) {
      rePassword.set('errors', {
                visible: true,
                msg: '新密码不能为空'
            });
            isVer = false;
      return false;
    }else if (user.newPassword != user.rePass) {
      rePassword.set('errors', {
                visible: true,
                msg: '两次密码不一致，请检查'
            });
            isVer = false;
      return false;
    }
    if (isVer) {
      rePasswordService.doResetPassword(user, function (err, msg){
        if (!err) {
            showErrors(msg);
        } else {
            disableErrors();
            rePassword.set('step3',false);
            rePassword.set('step4',true);
            var time = 5;
            rePassword.set('timeLeft',5);
            setInterval(function(){
            rePassword.set('timeLeft',--time);
              if (time == 1) {
                clearInterval();
                window.location.href = '/';
              }
            },1000);
          }
      });
    }
});


rePassword.on('sendTelCode', function (e) {
        var $captchaBtn = $(".getcaptcha");
        var mobile = this.get('user.mobile');
        if ($captchaBtn
            .hasClass('disabled')) {
            return;
        }
        if (!mobile.length) {
            showErrors('MOBILE_NULL');
            return;
        } else {
            CommonService.getSmsCaptchaForResetPassword(mobile, function (r) {
                if (r.success) {
                    countDown();
                }
            });
          }
    });

function countDown() {
    $('.getcaptcha')
        .addClass('disabled');
    var previousText = '获取验证码';
    var msg = '$秒后重新发送';

    var left = 120;
    var interval = setInterval((function () {
        if (left > 0) {
            $('.getcaptcha')
                .html(msg.replace('$', left--));
        } else {
            $('.getcaptcha')
                .html(previousText);
            $('.getcaptcha')
                .removeClass('disabled');
            clearInterval(interval);
        }
    }), 1000);
}

//  发送手机验证码
// rePassword.on('sendTelCode',function(){
//   clearInterval(rePassword.get('timeid'));
//   rePasswordService.sendTelCode('123123',function(data){
//     console.log(data);
//     if (data.success) {
//       rePassword.set('telcode',true);
//       rePassword.set('time',120);
//       var time = 120;
//       var timeout = setInterval(function(){
//         if (time!=0) {
//           rePassword.set('time',time--);
//         } else {
//           rePassword.set('telcode',false);
//         }

//       },1000);
//       rePassword.set('timeid',timeout);
//     }
//   });
// });

// show errors
function showErrors(error) {
  rePassword
        .set('errors', {
            visible: true,
            msg: utils.errorMsg[error]
        });
}


// disable errors
function disableErrors() {
  rePassword
        .set('errors', {
            visible: false,
            msg: ''
        });
}
