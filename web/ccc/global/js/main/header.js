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