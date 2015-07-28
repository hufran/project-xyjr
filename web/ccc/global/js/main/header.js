/**
 * @file 头部控件的交互逻辑层
 * @author huip(hui.peng@creditcloud.com)
 */
"use strict";

var utils = require('ccc/global/js/lib/utils');

$('.s__top15').mouseover(function() {
    $(this).next().css('display', '');
}).mouseout(function() {
    $(this).next().css('display', 'none');
});


$(function(){
    utils.tool.loadScript('http://wpa.b.qq.com/cgi/wpa.php',function(){
        BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4001000099, selector: 'BizQQWPA1'});
        BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4001000099, selector: 'BizQQWPA2'});
    });
    var sideUp = $('#sideUp');
    window.onscroll=function(){
        var scrollTopOffset= document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTopOffset  >= 500){  //document.documentElement.clientWidth
            sideUp.show();
        }else{
            sideUp.hide();
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
    $(".u-nolist-ul li a#index")
        .addClass("navactive");

} else if (new RegExp("^/invest/list")
    .test(path)) {
    $(".u-nolist-ul li a#touzi")
        .addClass("navactive");

} else if (new RegExp("^/loan")
    .test(path)) {
    $(".u-nolist-ul li a#jiekuan")
        .addClass("navactive");

} else if (new RegExp("^/safety/*")
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