/**
 * @file 头部控件的交互逻辑层
 * @author huip(hui.peng@creditcloud.com)
 */
"use strict";

var $  = global.jQuery = require('jquery');
var Ractive = require('ractive/ractive-legacy');
var request = require('cc-superagent-promise');

var popupLogin = require('ccc/login/js/lib')
    .popupLogin;
var popupRegister = require('ccc/register/js/lib')
    .popupRegister;

var HeaderRactive = new Ractive({
    el: '#header-wraper',
    template: require('partials/layouts/default/headerInner.html'),
    data: {}
});
var bus = require('ccc/reactive/js/lib/bus');
require('ccc/session/js/lib/user')
    .property.assign(HeaderRactive, 'set', 'user');


HeaderRactive.on('maskLogin', function (e) {
    e.original.preventDefault();
    popupLogin.show();
});

HeaderRactive.on('maskRegister', function () {
    popupRegister.show();
});

var sessionUserBus = bus('session:user');
HeaderRactive.on('logout', function () {
    request.get('/logout')
        .end()
        .then(function () {
            sessionUserBus.push.bind(sessionUserBus, void 0);
            window.location.reload();
        });
    return false;
});

global.HeaderRactive = HeaderRactive;


$('.s__top15').mouseover(function() {
    $(this).next().css('display', '');
}).mouseout(function() {
    $(this).next().css('display', 'none');
});

//顶拦滚动悬浮

// 手机上九信金融hover
// not need in yingtoubao.com
//$(".mobile")
//    .hover(function () {
//        $(".navbar-top .code")
//            .fadeIn("normal");
//    }, function () {
//        $(".navbar-top .code")
//            .fadeOut("normal");
//    });
//
//$(".promotion")
//    .hover(function () {
//        $(this)
//            .find(".dialog")
//            .show();
//    }, function () {
//        $(this)
//            .find(".dialog")
//            .hide();
//    });
