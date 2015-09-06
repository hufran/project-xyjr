'use strict';
var CommonService = require('ccc/global/js/modules/common').CommonService;
var captChaImg = $('.captcha-img');
var captcha = {};


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

    request.post('/login/ajax').type('form').send($this.serialize()).end().get('body').then(function (r) {
        if (r.success) {
            $postBtn.text('登录成功');
            var url = /(loan)/;
            if (url.test(document.referrer)) {
                location.href = document.referrer;
                return;
            }
            if (CC.user.enterprise) {
                location.pathname = "/account";
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
        template: '{{#each items}}<img src="{{content}}"/>{{/each}}',
        data: {
            items: res.body
        }
    });
});



//cookie记住用户名密码

 window.onload=function onLoginLoaded() {
        if (isPostBack == "False") {
            GetLastUser();
        }
    }
     
    function GetLastUser() {
        var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";//GUID标识符
        var usr = GetCookie(id);
        if (usr != null) {
            document.getElementById('txtUserName').value = usr;
        } else {
            document.getElementById('txtUserName').value = "001";
        }
        GetPwdAndChk();
    }
    //点击登录时触发客户端事件
     
    function SetPwdAndChk() {
        //取用户名
        var usr = document.getElementById('txtUserName').value;
//        alert(usr);
        //将最后一个用户信息写入到Cookie
        SetLastUser(usr);
        //如果记住密码选项被选中
        if (document.getElementById('chkRememberPwd').checked == true) {
            //取密码值
            var pwd = document.getElementById('txtPassword').value;
//            alert(pwd);
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
            //将用户名和密码写入到Cookie
            SetCookie(usr, pwd, expdate);
        } else {
            //如果没有选中记住密码,则立即过期
            ResetCookie();
        }
    }
     
    function SetLastUser(usr) {
        var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
        var expdate = new Date();
        //当前时间加上两周的时间
        expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
        SetCookie(id, usr, expdate);
    }
    //用户名失去焦点时调用该方法
     
    function GetPwdAndChk() {
        var usr = document.getElementById('txtUserName').value;
        var pwd = GetCookie(usr);
        if (pwd != null) {
            document.getElementById('chkRememberPwd').checked = true;
            document.getElementById('txtPassword').value = pwd;
        } else {
            document.getElementById('chkRememberPwd').checked = false;
            document.getElementById('txtPassword').value = "";
        }
    }
    //取Cookie的值
     
    function GetCookie(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            //alert(j);
            if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    var isPostBack = "<%= IsPostBack %>";
     
    function getCookieVal(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    }
    //写入到Cookie
     
    function SetCookie(name, value, expires) {
        var argv = SetCookie.arguments;
        //本例中length = 3
        var argc = SetCookie.arguments.length;
        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : null;
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;
        document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
    }
     
    function ResetCookie() {
        var usr = document.getElementById('txtUserName').value;
        var expdate = new Date();
        SetCookie(usr, null, expdate);
    }



//cookie记住用户名密码

 window.onload=function onLoginLoaded() {
        if (isPostBack == "False") {
            GetLastUser();
        }
    }
     
    function GetLastUser() {
        var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";//GUID标识符
        var usr = GetCookie(id);
        if (usr != null) {
            document.getElementById('txtUserName').value = usr;
        } else {
            document.getElementById('txtUserName').value = "001";
        }
        GetPwdAndChk();
    }
    //点击登录时触发客户端事件
     
    function SetPwdAndChk() {
        //取用户名
        var usr = document.getElementById('txtUserName').value;
//        alert(usr);
        //将最后一个用户信息写入到Cookie
        SetLastUser(usr);
        //如果记住密码选项被选中
        if (document.getElementById('chkRememberPwd').checked == true) {
            //取密码值
            var pwd = document.getElementById('txtPassword').value;
//            alert(pwd);
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
            //将用户名和密码写入到Cookie
            SetCookie(usr, pwd, expdate);
        } else {
            //如果没有选中记住密码,则立即过期
            ResetCookie();
        }
    }
     
    function SetLastUser(usr) {
        var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
        var expdate = new Date();
        //当前时间加上两周的时间
        expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
        SetCookie(id, usr, expdate);
    }
    //用户名失去焦点时调用该方法
     
    function GetPwdAndChk() {
        var usr = document.getElementById('txtUserName').value;
        var pwd = GetCookie(usr);
        if (pwd != null) {
            document.getElementById('chkRememberPwd').checked = true;
            document.getElementById('txtPassword').value = pwd;
        } else {
            document.getElementById('chkRememberPwd').checked = false;
            document.getElementById('txtPassword').value = "";
        }
    }
    //取Cookie的值
     
    function GetCookie(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            //alert(j);
            if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    var isPostBack = "<%= IsPostBack %>";
     
    function getCookieVal(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    }
    //写入到Cookie
     
    function SetCookie(name, value, expires) {
        var argv = SetCookie.arguments;
        //本例中length = 3
        var argc = SetCookie.arguments.length;
        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : null;
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;
        document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
    }
     
    function ResetCookie() {
        var usr = document.getElementById('txtUserName').value;
        var expdate = new Date();
        SetCookie(usr, null, expdate);
    }
