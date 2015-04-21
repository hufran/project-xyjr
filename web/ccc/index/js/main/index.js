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

//$(".carousel-wrapper")
//    .find(".left")
//    .css({
//        width: $carousel.css('margin-left'),
//        height: $carousel.height(),
//        top: $carousel.offset()
//            .top
//    });
//$(".carousel-wrapper")
//    .find(".right")
//    .css({
//        width: $carousel.css('margin-right'),
//        height: $carousel.height(),
//        left: $carousel.offset()
//            .left + $carousel.width(),
//        top: $carousel.offset()
//            .top
//    });


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

});

IndexService.getLatestScheduled(function (loan) {
    console.log(loan);
    var serverDate = loan.serverDate;
    var leftTime = utils.countDown.getCountDownTime(loan.timeOpen,
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
        var leftTime = utils.countDown.getCountDownTime(loan.timeOpen,
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