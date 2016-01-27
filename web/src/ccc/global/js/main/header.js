/**
 * @file 头部控件的交互逻辑层
 * @author huip(hui.peng@creditcloud.com)
 */
"use strict";

var accountService = require('ccc/account/js/main/service/account').accountService;

var utils = require('ccc/global/js/lib/utils');

$('.u-nolist-ul-li').mouseover(function() {
    $(this).find('.u-nolist-a').css({'background':'#5b9dff','color':'#fff'});
    $(this).find('.u-seclist-ul').css('display', 'block');
}).mouseout(function() {
    $(this).find('.u-nolist-a').css({'background':'#fff','color':''});
    $(this).find('.u-seclist-ul').css('display', 'none');
});

$("#mobileCustomer").hover(function(){
    $('.float-img').css('display','block');
},function(){
    $('.float-img').css('display','none');
});
$(".side-bar-mobile").hover(function(){
    $('.wap').css('display','block');
},function(){
    $('.wap').css('display','none');
});
$(".wap-close").click(function(){
    $('.wap').css('display','none');
});

if(CC.user){
    accountService.getUserInfo(function (res) {
        if(!res.user){
            res.user={};
            res.user.name='';}
            new Ractive({
            el: "#head-ractive-container",
            template:'<img src="/ccc/newAccount/img/user.png" style="position:relative;bottom:2px;"/>{{#if !name}}{{mobile}}{{else}}{{name}}{{/if}}', 
            data: {
               name:res.user.name,
               loginName:CC.user.loginName,
                mobile:res.user.mobile
            }
        });     
    });
    accountService.getNewMessageNum(function (res) {
        var messageRactive = new Ractive({
            el: '#head-message-container',
            template: '({{num}})',
            data: {
                num: res
            }
        });
    });
     
};

 

$(function(){
    utils.tool.loadScript('http://wpa.b.qq.com/cgi/wpa.php',function(){
        BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4001000099, selector: 'BizQQWPA1'});
        BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4001000099, selector: 'BizQQWPA2'});
    });
    
    window.onscroll=function(){
        var scrollTopOffset= document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTopOffset  <= 10){
            $('body,html').stop();
        }
    }
});

$(".back-top").click(function(){
    $('body,html').animate({scrollTop:0},1000);
    return false;
})     

//导航状态
var path = window.location.pathname;

if (new RegExp("^/$")
    .test(path)) {
//    $(".u-nolist-ul li a#index")
//        .addClass("navactive");

} else if (new RegExp("^/invest")
    .test(path)) {
    $(".u-nolist-ul li a#touzi")
        .addClass("navactive");

} else if (new RegExp("^/applyloan")
    .test(path)) {
    $(".u-nolist-ul li a#jiekuan")
        .addClass("navactive");

} else if (new RegExp("^/newAccount/*")
    .test(path)) {
    $(".u-nolist-ul li a#safety")
        .addClass("navactive");

} else if (new RegExp("^/guide")
    .test(path)) {
    $(".u-nolist-ul li a#help")
        .addClass("navactive");

} else if (new RegExp("^/aboutus/*")
    .test(path)) {
    $(".u-nolist-ul li a#aboutus")
        .addClass("navactive");
}


var Cal = require('ccc/global/js/modules/cccCalculator');
$('.calculator-create').on('click', function () {
    Cal.create();
});


//导航移动在上面出现微信
//$('.erweima').hide();
$('.weixin-icon').mouseenter(function () {
        $('.erweima-act2').show();
    }).mouseleave(function () {
        $('.erweima-act2').hide();
    });

$('.weixin-icon').mouseenter(function () {
        $('.erweima-act').show();
    }).mouseleave(function () {
        $('.erweima-act').hide();
    });

//控股下拉菜单
    	
$("#family").hover(function(){
	$(this).find("p").css("background","url(/ccc/global/img/slideOn.png) no-repeat");
	$(this).find("ul").stop().slideDown();
},function(){
	$(this).find("ul").stop().slideUp();
	$(this).find("p").css("background","url(/ccc/global/img/slide.png) no-repeat");
});

