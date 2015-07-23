
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







//第二步时上面步骤的颜色切换
$("register-step-1").ready(function(){
    $(".register-process-graph .transition .link").css("backgroundColor", "#d9eef8");
    $(".register-process-graph .transition .sectep").css("backgroundImage","url(/ccc/register/img/tep02.png)")    
})
$("register-step-0").ready(function(){
    $(".register-process-graph .transition .link").css("backgroundColor", "#f5f5f5");
    $(".register-process-graph .transition .sectep").css("backgroundImage","url(/ccc/register/img/tep2.png)")    
})

//step的切换
$('input[type=button]').click(function () {
    var registerSecond = new Ractive({
    el: $('.register-step-1'),
    template: '<span class="succ"> 恭喜，<span>{{email}}</span> 已经注册成功！</span><div class="space space-50"></div><button class="btn01"><a href="/index">返回首页</a></button><button class="btn02"><a>我的河山匯</a></button>',
    data: {
        email: $(".mailbox").val()
    }
});

    if ($('.on-step-0').css('display') == 'block') {
        $('.register-process-graph').removeClass('register-process-graph-2');
        $('.register-process-graph').addClass('register-process-graph-1');
    } else if ($('.on-step-1').css('display') == 'block') {
        $('.register-process-graph').removeClass('register-process-graph-1');
        $('.register-process-graph').addClass('register-process-graph-2');
    } else {
    }
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