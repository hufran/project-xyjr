"use strict";

var $ = global.jQuery = require('jquery');
require('bootstrap/js/transition');
require('bootstrap/js/carousel');
var Ractive = require('ractive/ractive-legacy');
var $carousel = $("#my-carousel");
var IndexService = require('./service')
    .IndexService;
var utils = require('assets/js/lib/utils');
var i18n = require('@ds/i18n')['zh-cn'];
var loginElement=document.getElementsByClassName?document.getElementsByClassName('info')[0]:$('.info')[0];

require('assets/js/lib/jquery.easy-pie-chart.js')

$carousel
    .on('slid.bs.carousel', function (e) {
        // slide 完成后
    });


IndexService.getLoanSummary(function (list) {

    var investRactive = new Ractive({
        el: ".invests-list-wrapper",
        template: require('partials/singleInvest.html'),
        data: {
            list: list,
            RepaymentMethod: i18n.enums.RepaymentMethod // 还款方式
        }
    });

    initailEasyPieChart();
    ininconut();

});

function ininconut () {
    $(".opre > .investbtn").each(function () {
        var t = $(this);
        var id = t.data("id");  
        var openTime = t.data("open");  
        var serverDate = t.data("serv");  
        var leftTime = utils.countDown.getCountDownTime2(openTime, serverDate);
        var textDay = leftTime.day ? leftTime.day +'天' : '';
        t.html('<span class="text">'+ textDay + leftTime.hour +'时'+ leftTime.min +'分'+ leftTime.sec +'秒</span>')
        var interval = setInterval((function () {
            serverDate += 1000;
            var leftTime = utils.countDown.getCountDownTime2(openTime, serverDate);
            var textDay = leftTime.day ? leftTime.day +'天' : '';
            if(!+(leftTime.day) && !+(leftTime.hour) && !+(leftTime.min) && !+(leftTime.sec)){
                clearInterval(interval);
                t.replaceWith('<a href="/loan/'+id+'" style="text-decoration:none"><div class="investbtn">立即投资</div></a>');
            }else{

                t.html('<span class="text">'+ textDay + leftTime.hour +'时'+ leftTime.min +'分'+ leftTime.sec +'秒</span>')
            }
        }), 1000);
    });
};

IndexService.getLatestScheduled(function (loan) {
    var serverDate = loan.serverDate;
    var leftTime = utils.countDown.getCountDownTime2(loan.timeOpen,
        serverDate);
    var countDownRactive = new Ractive({
        el: ".next-time",
        template: require('ccc/index/partials/countdown.html'),
        data: {
            countDown: {
                hours: leftTime.hour,
                minutes: leftTime.min,
                seconds: leftTime.sec
            }
        }
    });
    setInterval((function () {
        serverDate += 1000;
        var leftTime = utils.countDown.getCountDownTime2(loan.timeOpen,
            serverDate);
        countDownRactive.set('countDown', {
            hours: leftTime.hour,
            minutes: leftTime.min,
            seconds: leftTime.sec
        });
    }), 1000);
});

$("#btn-login-on-carousel").click(function(e){
    global.HeaderRactive.fire('maskLogin',{
        original: e
    });
});

function initailEasyPieChart() {
    ///////////////////////////////////////////////////////////
    // 初始化饼状图
    ///////////////////////////////////////////////////////////
    $(function () {
        var oldie = /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase());
        $(".easy-pie-chart").each(function () {
            var percentage = $(this).data("percent");
            // 100%进度条颜色显示为背景色
            var color = percentage === 100 ? "#b49b5d" : '#b49b5d';
            $(this).easyPieChart({
                barColor: color,
                trackColor: '#ddd',
                scaleColor: false,
                lineCap: 'butt',
                lineWidth: 2,
                animate: oldie ? false : 1000,
                size: 45,
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
            $(this).find("span.percentageNum").html(percentage+"%");
        });

    });
};


function showError(message){
    var errorMaps = {
        USER_DISABLED: '帐号密码错误次数过多，您的帐户已被锁定，请联系客服400-888-7758解锁。',
        FAILED: '手机号/用户名或密码错误'
    };
    var $error = $(".error");
    $error.text(errorMaps[message]); 
    $error.addClass('show');
    setTimeout(function(){
        $error.css({
            opacity:'1'
        })
    });
    setTimeout(function(){
        $error.css({
            opacity:'0'
        })
    },1500);
    setTimeout(function(){
        $error.removeClass('show');
    },2000);
};

function clearError(){
    var $error = $(".error");
    $error.text("");
}

function verifyAndLogin(){
    var username = $("#loginName").val();
    var password = $("#password").val();
    if (username && password) {
        $.post('/ajaxLogin', {
            loginName : username,
            password : password
        }, function (data){
            if (!data.success) {
                showError(data.error_description.result);
            } else {
                clearError();
                window.location.reload();
            }
        });
    }else{
        showError('FAILED');
    }
}
$('.loginBtn').click(function (){
        verifyAndLogin();
    });
$('.registerBtn').click(function(){
    location.href="/register"
})

window.onscroll=function(){
    var scrollTopOffset= document.documentElement.scrollTop || document.body.scrollTop,headerEle;
    if(loginElement){
        if(scrollTopOffset>=129){
            loginElement.className='info floating';
        }else{
            loginElement.className='info';
        }
    }
    
}

$(document).keyup(function (e) {
    if(e.keyCode == 13) {
        verifyAndLogin();
    }
});