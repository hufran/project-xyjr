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
        if (left == 0) {
            console.log(left)
            clearInterval(interval);
            window.location.href = "/account/index";
        }
    }), 1000);
});

$("#getSms").on('click', function () {
    console.log('sdfsdf');
});


//验证码的图片切换
$("#refresh-captcha").click(function (event) {
    $(".register-test").val("");
});



//验证码的北京图片隐藏
$(".form-group .inputtest-pic span").click(function () {

    $(".form-group .inputtest-pic .pullright").css("backgroundImage", "none");
})


//注册图片
request.get(encodeURI('/api/v2/cms/category/IMAGE/name/注册')).end().then(function (res) {
    var count = new Ractive({
        el: '.register-pic',
        template: '{{#each items}}<img src="{{content}}"/>{{/each}}',
        data: {
            items: res.body
        }
    });
});

//var referral = getUrlVal("refm");
//if (referral != null) {
    //$("input[name=refm]").val(referral);
//}

//function getUrlVal(key) {
    //var search = location.search;
    //if (search == null) return null;
    //var i = search.indexOf(key);
    //if (i == -1) {
        //return null;
    //} else {
        //i += key.length;
        //i++;
        //var j = search.indexOf('=', i);
        //if (j == -1) {
            //return search.substring(i);
        //} else {
            //return search.substring(i, j);
        //}
    //}
//}

if (CC.registerRel) {
    registerRactive.set('refm.data.value', CC.registerRel);
}
