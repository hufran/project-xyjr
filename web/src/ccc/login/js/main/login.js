'use strict';
var CommonService = require('ccc/global/js/modules/common').CommonService;
var captChaImg = $('.captcha-img');
var captcha = {};


getCaptCha();

$('.change-captcha').on('click', function (e) {
    e.preventDefault();
    getCaptCha();
});

//$("[name = checkbox]").attr("checked", true);

function getCaptCha() {
    CommonService.getCaptcha(function (data) {
        captcha = data;
        captChaImg.attr('src', data.captcha);
    });
}

var errorRac = new Ractive({
    el: $('.error-wrap'),
    template: require('ccc/login/partials/error.html'),
    data: {
        error: null
    }
});

$('#loginForm').submit(function (e) {
    var $this = $(this);
    e.preventDefault();
    var $loginName = $('input[name=loginName]');
    var $password = $('input[name=password]');
    var $postBtn = $('#login_button');
    var $errorMobile = $('.mobile');
    var $errorPwd = $('.password');
    var $error = $('.loginlock');

    $errorMobile.empty();
    $errorPwd.empty();
    $error.empty();

    if ($loginName.val() === '') {
        $errorMobile.text('手机号不能为空');
        return;
    }
    
    if ($password.val() === '') {
        $errorPwd.text('密码不能为空');
        return;
    }
    var errorMaps = {
        USER_DISABLED: '帐号密码错误次数过多，您的帐户已被锁定，请联系客服4001-718-718解锁。',
        FAILED: '手机号或密码错误',
        TOO_MANY_ATTEMPT: '密码输入次数过多，该用户已被禁用'
    };

    if ($postBtn.hasClass('disabled')) {
        return;
    }

    $postBtn.addClass('disabled').html('登录中...');

    var data="loginName="+filterXSS($loginName.val())+"&password="+filterXSS(password.val())+"&backUrl=";
    request.post('/api/web/login').type('form').send(data).end().get('body').then(function (r) {
        if (r.success) {
            $postBtn.text('登录成功');
            var url = /(loan)/;
            var url2 = /(investCredit)/;
            var url3 = /(invest)/;
            var url4 = /(rongzi)/;
            var url5 = /(userKnow)/;
            var url6 = /(creditDetail)/;
            if (url.test(document.referrer) || url2.test(document.referrer) || url3.test(document.referrer) || url4.test(document.referrer) || url5.test(document.referrer) || url6.test(document.referrer)) {
                location.href = document.referrer;
                return;
            }
            if (CC.user.enterprise) {
                location.pathname = "/newAccount/home";
            } else {
                location.href = (r.redirect) ? r.redirect : '/';
            }
                    
        } else {
            $error.text(errorMaps[r.error_description.result]);
            $postBtn.removeClass('disabled').text('登录');
        }
    });

    return false;
});

request.get(encodeURI('/api/v2/cms/category/IMAGE/name/登录')).end().then(function (res) {
    var count = new Ractive({
        el: '.loginBanner',
        template: '{{#each items}}<a href="{{url}}" target="_blank"><img src="{{content}}"/></a>{{/each}}',
        data: {
            items: res.body
        }
    });
});




