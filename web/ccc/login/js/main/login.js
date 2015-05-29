'use strict';
var $ = require('jquery');
var Ractive = require('ractive/ractive-legacy');
var CommonService = require('assets/js/modules/common')
    .CommonService;
var captChaImg = $('.captcha-img');
var captcha = {};
var request = require('cc-superagent-promise');
// init captcha

getCaptCha();

$('.change-captcha').on('click', function (e) {
    e.preventDefault();
    getCaptCha();
});

function getCaptCha() {
    CommonService.getCaptcha(function (data) {
        captcha = data;
        captChaImg.attr('src', data.captcha);
    });
}

//function checkCaptcha(captcha) {
//    CommonService.checkCaptcha(captcha,function(data) {
//        if (!data.success) {
//            console.log(data.error[0]);
//        }
//    });
//}

//$('.do-login').on('click', function(e) {
//    e.preventDefault();
//    captcha.captcha = $('.captcha').val();
//    checkCaptcha(captcha);
//});

var errorRac = new Ractive({
    el: $('.error-wrap'),
    template: require('ccc/login/partials/error.html'),
    data: {
        error: null
    }
});

$('#loginForm').submit(function(e){
    var $this = $(this);
    e.preventDefault();
    var $loginName = $('input[name=loginName]');
    var $password = $('input[name=password]');
    var $postBtn = $('input[type=submit]');
    var $error = $('.login-error');
    
    $error.empty();
    
    if ($loginName.val() === '') {
        $error.text('手机号不能为空');
        return;
    }
    if ($password.val() === '') {
        $error.text('密码不能为空');
        return;
    }
    
    var errorMaps = {
        USER_DISABLED: '帐号密码错误次数过多，您的帐户已被锁定，请联系客服400-888-7758解锁。',
        FAILED: '手机号或密码错误'
    };
    
    if ($postBtn.hasClass('disabled')) {
        return;
    }
    
    $postBtn.addClass('disabled').html('登录中...');

    request.post('/ajaxLogin').type('form').send($this.serialize()).end().get('body').then(function(r){
        if (r.success) {
            $postBtn.text('登录成功');
            location.href = (r.redirect) ? r.redirect:'/invest/list';
        } else {
            $error.text(errorMaps[r.error_description.result]);
            $postBtn.removeClass('disabled').text('登录');
        }
    });
    
   /* $.post('/ajaxLogin', $this.serialize(), function(r){
        xhrFields: {
            withCredentials: true;
        }
        if (r.success) {
            $postBtn.text('登录成功');
            location.href = (r.redirect) ? r.redirect:'/invest/list';
        } else {
            $error.text(errorMaps[r.error_description.result]);
            $postBtn.removeClass('disabled').text('登录');
        }
    });*/
    
    return false;
});