
'use strict';
var RegisterRactive = require('@ccc/register').RegisterRactive;
var registerRactive = new RegisterRactive({
    el: '#register-container',
    template: require('ccc/register/partials/steps.html')
});
baconflux.store('register', 'success').onValue(function (data) {
    // 注册后自动登录
    request.post('/login/ajax', {
        body: {
            loginName: data.postedData.loginName,
            password: data.postedData.password,
        }
    }).end()
    var left = 3;
 var interval = setInterval((function () {
         --left;
        if (left ==0) {
            console.log(left)
            clearInterval(interval);
            window.location.href = "/account/index"; 
        }
    }), 1000);
});

$("#getSms").on('click',function(){
    console.log('sdfsdf');
});



//验证码的图片切换
$("#refresh-captcha").click(function (event) {
    console.log("success");
    var timestamp = new Date() - 0;
    $.get("/api/v2/register/captcha?timestamp=" + timestamp, function (res) {
        $("#refresh-captcha").parent().find("img").attr("src", res.captcha);
    });
});

//验证码的北京图片隐藏
$(".form-group .inputtest-pic span").click(function(){
    
    $(".form-group .inputtest-pic .pullright").css("backgroundImage", "none");
})
