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
    $('.logout').click(function(){
        var ccat=cookieFn.getCookie('ccat');
        console.log(ccat);
        $.ajax({//把token传给后端
                  type: 'POST',
                  url: '/api/v2/auth/userLoginOut/'+CC.user.id,
                  data: {
                    'userId':CC.user.id,
                    'token':ccat
                  },
                  success: function(res){
                    if (res.status==0) {
                        console.log(res);
                        window.location.href='/logout';
                    };
                    
                  }
                });
        //"/logout"
        console.log('CC.user!!!!');
        console.log(CC.user.id);
    })
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

var cookieFn={
    setCookie:function (objName, objValue, objHours){//添加cookie 
        var str = objName + "=" + escape(objValue); 
        if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失 
            var date = new Date(); 
            var ms = objHours * 3600 * 1000; 
            date.setTime(date.getTime() + ms); 
            str += "; expires=" + date.toGMTString(); 
        }
        console.log(str+"; path=/"); 
        document.cookie = str+"; path=/";
    },
        
    getCookie:function (objName){//获取指定名称的cookie的值 
        var arrStr = document.cookie.split("; "); 
        for (var i = 0; i < arrStr.length; i++) { 
            var temp = arrStr[i].split("="); 
            if (temp[0] == objName) 
                return unescape(temp[1]); 
        } 
    },   
    cleanCookie:function (name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
        var date = new Date(); 
        date.setTime(date.getTime() - 10000);
        document.cookie=name+"=; expire="+date.toGMTString()+"; path=/";
    }
}



