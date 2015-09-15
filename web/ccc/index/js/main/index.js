"use strict";

require('bootstrap/js/transition');
require('bootstrap/js/carousel');
require('bootstrap/js/tab');
var $carousel = $("#my-carousel");
var IndexService = require('./service')
    .IndexService;
var utils = require('ccc/global/js/lib/utils');
var i18n = require('@ds/i18n')['zh-cn'];
var loginElement=document.getElementsByClassName?document.getElementsByClassName('info')[0]:$('.info')[0];

require('ccc/global/js/lib/jquery.easy-pie-chart.js')

$carousel.on('slid.bs.carousel', function (e) {
        // slide 完成后
    });


IndexService.getLoanSummary(function (list) {

     for(var i=0;i<list.length;i++){
        list[i].method = i18n.enums.RepaymentMethod[list[i].method][0];
    }
    var investRactive = new Ractive({
        el: ".productList",
        template: require('ccc/global/partials/singleInvest.html'),
        data: {
            list: list,
            RepaymentMethod: i18n.enums.RepaymentMethod // 还款方式
        }
    });

    initailEasyPieChart();
//    ininconut();

});

//借款计划
IndexService.getLoanSummary(function (list) {
    
   

    var investRactive = new Ractive({
        el: "#loan-plan",
        template: require('ccc/global/partials/singleInvest.html'),
        data: {
            list: list,
            RepaymentMethod: i18n.enums.RepaymentMethod // 还款方式
        }
    });

    initailEasyPieChart();
//    ininconut();

});




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
                seconds: leftTime.sec,
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
    window.HeaderRactive.fire('maskLogin',{
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
            var color = percentage === 100 ? "#f58220" : '#009ada';
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
        USER_DISABLED: '帐号密码错误次数过多，您的帐户已被锁定，请联系客服400-872-7676解锁。',
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
//var sideUp = $('#sideUp');
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

request.get(encodeURI('/api/v2/cms/category/LINK/name/友情链接'))
    .end()
    .then(function (res) {
        var count = new Ractive({
        el: '.firendLink',
        template: '<span class="friend-left">友情链接</span><span class="friend-right">{{#each items}}<a href="http://{{url}}" target="_blank">{{{title}}}</a>{{/each}}</span>',
        data: {
            items: res.body
        }
    });
    });


//底部鼠标滑过显示公司链接
$('.icon-grounp .company-intro').hide();
$(' .icon-group1').mouseenter(function(){
    $(this).children('.company-intro').show(200);
}).mouseleave(function(){
    $(this).children('.company-intro').hide(200);
});

$('.strengthProtect').click(function(){
    var url=$(this).find('a').attr('href');
    location.href=url;
});




//require('ccc/index/js/main/ss.js')
//
//$(".loanWrapper").hover(function(){$(this).css("border-color","#A0C0EB");},function(){$(this).css("border-color","#d8d8d8")});
//jQuery(".invests-list-wrapper-box").slide({titCell:"",mainCell:".invests-list-wrapper",autoPage:true,effect:"leftLoop",autoPlay:true,vis:4});