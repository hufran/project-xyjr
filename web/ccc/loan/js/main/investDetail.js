/*jshint unused : false*/

"use strict";
var $ = require('jquery');
var popupLogin = require('ccc/login/js/lib')
    .popupLogin;
var loanService = require('./service/loans.js')
    .loanService;
var Ractive = require('ractive/ractive-legacy');
var utils = require('assets/js/lib/utils');
require('assets/js/modules/tooltip');

global.jQuery = $; // bootstrap 插件需要
require('bootstrap/js/transition');
require('bootstrap/js/tooltip');

var Cal = require('assets/js/modules/cccCalculator');

// cccConfirm
var Confirm = require('assets/js/modules/cccConfirm');

var popupBigPic = require('ccc/loan/js/main/bigPic')
    .popupBigPic;


$("[data-toggle=tooltip]")
    .each(function () {
        $(this)
            .tooltip({
                // 同级的 tooltip-container
                container: $(this)
                    .parent()
                    .find('.tooltip-container')
            });
    });
setTimeout((function () {
    global.CC.loan.timeElapsed = utils.format.timeElapsed(global.CC.loan
        .timeElapsed);
    var investRactive = new Ractive({
        el: ".do-invest-wrapper",
        template: require('ccc/loan/partials/doInvestOnDetail.html'),
        data: {
            user: CC.user,
            loan: CC.loan,
            rate: utils.format.percent(CC.loan.investPercent *
                100, 2),
            agreement: CC.user ? (CC.user.agreement ?
                CC.user.agreement : false) : false,
            errors: {
                visible: false,
                msg: ''
            }
        }
    });
    investRactive.set('user', CC.user);
    investRactive.on("invest-submit", function (e) {
        var num = parseInt(this.get('inputNum'), 10); // 输入的值
        if (isNaN(num)) {
            showErrors('输入有误，请重新输入 ! ');
            return false;
        }

        if (num < CC.loan.rule.min) {
            showErrors('单次投标金额不可少于' + CC.loan.rule
                .min + '元 !');
            return false;
        }
        if (num > CC.loan.rule.balance) {
            showErrors('投标金额不可超过剩余额度 !');
            return false;
        }

        if (num > CC.loan.rule.max) {
            showErrors('单次投标金额不可超过' + CC.loan.rule
                .max +
                '元!');
            return false;
        }
        if (((num - global.CC.loan.rule.min) % global.CC.loan.rule.step) !==
            0) {
            showErrors('不符合投资规则!');
            return false;
        }
        if (num > CC.user.availableAmount) {
            showErrors('账户余额不足，请先充值 !');
            return false;
        }

        disableErrors();
        Confirm.create({
            msg: '确定投标？',
            okText: '确定',
            cancelText: '取消',
            ok: function () {
                $('form')
                    .submit();
                $('.dialog')
                    .hide();
                Confirm.create({
                    msg: '抢标是否成功？',
                    okText: '抢标成功',
                    cancelText: '抢标失败',
                    ok: function () {
                        window.location.reload();
                    },
                    cancel: function () {
                        window.location.reload();
                    }
                });
            },
            cancel: function () {
                window.location.reload();
            }
        });
        return false;
    });

    // 初始化倒计时
    if (global.CC.loan.timeOpen > 0) {
        var serverDate = global.CC.loan.serverDate;
        var leftTime = utils.countDown.getCountDownTime(global.CC.loan.timeOpen,
            serverDate);
        if (leftTime) {
            var countDownRactive = new Ractive({
                el: ".next-time",
                template: require(
                    'ccc/loan/partials/countDown.html'),
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
                var leftTime = utils.countDown.getCountDownTime(
                    global.CC
                    .loan.timeOpen, serverDate);
                countDownRactive.set('countDown', {
                    hours: leftTime.hour,
                    minutes: leftTime.min,
                    seconds: leftTime.sec
                });
            }), 1000);
        }
    }

     function parsedata(o) {
        var type =  {
            'CASH': '现金卷',
            'INTEREST': '加息券',
            'PRINCIPAL': '增值卷',
            'REBATE': '返现卷'
        };
        for (var i = 0; i < o.length; i++) {
            var canuse = o[i].disabled;
            o[i] = o[i].placement;
            if (o[i].couponPackage.type === 'INTEREST') {
                o[i].interest  = true;
                o[i].displayValue = (parseFloat(o[i].couponPackage.parValue)/100).toFixed(1) + '%';
            } else if (o[i].couponPackage.type === 'CASH') {
                o[i].displayValue = parseInt(o[i].couponPackage.parValue) + "元";
            } else if (o[i].couponPackage.type === 'PRINCIPAL') {
                o[i].displayValue = parseInt(o[i].couponPackage.parValue) + "元";
            } else if (o[i].couponPackage.type === 'REBATE') {
                o[i].displayValue = parseInt(o[i].couponPackage.parValue) + "元";
            };
            o[i].id = o[i].id;
            o[i].typeKey = type[o[i].couponPackage.type];
            o[i].minimumInvest = o[i].couponPackage.minimumInvest + "元";
            o[i].canuse = canuse;
        }
        return o;
    };
    
    function showErrors(error) {
        investRactive
            .set('errors', {
                visible: true,
                msg: error
            });
    }

    function disableErrors() {
        investRactive
            .set('errors', {
                visible: false,
                msg: ''
            });
    }

    $('.benefit-calculator')
    .on('click', function () {
        Cal.create();
    });

    $('.invest-input')
    .on('keyup',function(){
        var months = CC.loan.duration;
        var amount = $(this).val();

        $.post('/loan/selectOption',{
            amount:amount,
            months:months
        }, function (o) {
            if (o.success) {
                investRactive.set('selectOption',parsedata(o.data));
            }
        });
    });

}), 100);


loanService.getLoanProof(CC.loan.requestId, function (imgs) {
    var relateDataRactive = new Ractive({
        // insurance 担保
        el: ".insurance-wrapper",
        template: require('ccc/loan/partials/relateDataOnDetail.html'),

        data: {
            imgs: imgs,
            currentIndex: 0,
            selectorsMarginLeft: 0,
            stageLen: 5,
            imgLen: imgs.length
        }
    });

    // 开始大图浏览
    relateDataRactive.on('begin-big-pic', function (e) {
        // 开始查看大图

        var options = {
            imgs: imgs,
            currentIndex: 0,
            selectorsMarginLeft: 0,
            stageLen: 5,
            imgLen: imgs.length
        };
        popupBigPic.show(options);
        init();
        return false;

    });

    // 选择器切换
    relateDataRactive.on("left-selector right-selector", function (e) {
        var cur = this.get("selectorsMarginLeft");
        var currentIndex = this.get('currentIndex');
        var stageLen = this.get('stageLen');
        var imgLen = this.get('imgLen');
        if (e.name === "left-selector") {
            if (currentIndex === 0 || imgLen < stageLen) {
                return false;
            }
            cur -= 40;
        } else {
            if (currentIndex <= stageLen) {
                return false;
            }
            cur += 35;
        }
        this.set("selectorsMarginLeft", cur);
        return false;
    });

    // 选择器点击
    relateDataRactive.on('selector-click', function (e) {
        var index = Number(e.keypath.substr(5)); // imgs.1
        this.set("currentIndex", index);
        return false;
    });
    
    // 大图浏览时切换
    function init() {
    var timer;
    popupBigPic.popupBigPicRactive.on("prev-big next-big", function (e) {
        if (e.name === "prev-big") {
            this.set("currentIndex", this.get("currentIndex") - 1);
        } else {
            this.set("currentIndex", this.get("currentIndex") + 1);
        }

        if (timer) {
            clearTimeout(timer);
        }

        // 定时隐藏
        this.set("showTip", true);
        timer = setTimeout(function () {
            relateDataRactive.set("showTip", false);
        }, 1000);

        return false;
    });
    }
});


$('.nav-tabs > li')
    .click(function () {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
        $('.tab-panel')
            .eq($(this)
                .data('step'))
            .addClass('active')
            .siblings()
            .removeClass('active');
    });
