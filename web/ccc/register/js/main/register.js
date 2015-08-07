
'use strict';
var RegisterRactive = require('@ccc/register').RegisterRactive;
var registerRactive = new RegisterRactive({
    el: '#register-container',
    template: require('ccc/register/partials/steps.html')
});
baconflux.store('register', 'success').onValue(function (data) {
    // 注册后自动登录
    request.post('/ajaxLogin', {
        body: {
            loginName: data.postedData.loginName,
            password: data.postedData.password,
        },
    }).end();
})



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
//点击验证码显示请输入正确的手机号码
$(".need-tel-num").hide();
$(".bring-in button").click(function(){
    if($(".input[name='phone']").val()=="")
    {
     $(".need-tel-num").show();
    }

});


//$(".need-tel-num").hide();
//$(".bring-in button").click(function(){
//    $(".need-tel-num").show();
//});
//$(".rinput input").click(function(){
//    $(".need-tel-num").hide();
//});