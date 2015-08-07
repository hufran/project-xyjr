/*jshint unused : false*/

"use strict";
var loanService = require('./service/loans.js').loanService;
var utils = require('ccc/global/js/lib/utils');
var accountService = require('ccc/account/js/main/service/account').accountService;
require('ccc/global/js/modules/tooltip');
require('ccc/global/js/lib/jquery.easy-pie-chart.js');
require('bootstrap/js/carousel');

require('bootstrap/js/transition');
require('bootstrap/js/tooltip');

var Cal = require('ccc/global/js/modules/cccCalculator');

// cccConfirm
var Confirm = require('ccc/global/js/modules/cccConfirm');

var popupBigPic = require('ccc/loan/js/main/bigPic')
    .popupBigPic;


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
                size: 100,
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
            $(this).find("span.percentageNum").html(percentage+"%");
        });

    });
};

initailEasyPieChart();


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
    CC.loan.timeElapsed = utils.format.timeElapsed(CC.loan.timeElapsed);
    console.log(CC.loan.timeLeft); 
    CC.loan.timeLeft=JSON.parse(CC.loan.timeLeft);
    
    var leftTime=CC.loan.timeLeft;
    var timeLeftToal=leftTime.ss+leftTime.mm*60+leftTime.hh*60*60+leftTime.dd*60*60*24;
    setInterval(function(){
        timeLeftToal-=1;
        var dd=parseInt(timeLeftToal/(60*60*24),10),
        hh=parseInt((timeLeftToal-dd*60*60*24)/(60*60),10),
        mm=parseInt((timeLeftToal-dd*60*60*24-hh*60*60)/60,10),
        ss=parseInt(timeLeftToal-dd*60*60*24-hh*60*60-mm*60,10);
        var newTimeleftTotal={
            dd:dd,
            hh:hh,
            mm:mm,
            ss:ss
        }
        var days = newTimeleftTotal.dd ? '<i>'+newTimeleftTotal.dd+'</i>日' : '';
        $('.firstLine>.time>span').html(days + '<i>'+newTimeleftTotal.hh+'</i>时<i>'+newTimeleftTotal.mm+'</i>分<i>'+newTimeleftTotal.ss+'</i>秒');
    },1000)
    //获取最后还款日期
    if(CC.repayments instanceof Array&&CC.repayments.length>0){
        CC.loan.lastRepaymentsDate=CC.repayments[0].dueDate;
        for(var i=0;i<CC.repayments.length;i++){
            if(CC.loan.lastRepaymentsDate<CC.repayments[i].dueDate){
                CC.loan.lastRepaymentsDate=CC.repayments[i].dueDate;
            }
        };
    }
    
    var investRactive = new Ractive({
        el: ".do-invest-wrapper",
        template: require('ccc/loan/partials/doInvestOnDetail.html'),
        data: {
            name:'',
            user: CC.user,
            loan: CC.loan,
            inputNum:CC.loan.rule.min,
            rate: utils.format.percent(CC.loan.investPercent *
                100, 2),
            agreement: CC.user ? (CC.user.agreement ?
                CC.user.agreement : false) : false,
            errors: {
                visible: false,
                msg: ''
            },
            backUrl: CC.backUrl
        }
    });
    
    
     accountService.getUserInfo(function (res) {
      investRactive.set('name', res.user.name);
        });

    
    //
    investRactive.set('user', CC.user);
    if($('.invest-submit').length>0){

    }
    
    
    investRactive.on('reduce', function (e) {
          var num = parseInt(this.get('inputNum'));
        num=num-parseInt(CC.loan.rule.step);
         if(num<CC.loan.rule.min){
             return;
         }
       investRactive.set('inputNum',num);
    });
    
    investRactive.on('add', function (e) {
        var num = parseInt(this.get('inputNum'));
        num=num+parseInt(CC.loan.rule.step);
        if(num > CC.loan.rule.max){
            return;
        }
       
       investRactive.set('inputNum',num);
    });
    
    investRactive.on('maxNumber', function (e) {
       investRactive.set('inputNum',CC.loan.rule.max);
    });

    
    
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
        if (((num - CC.loan.rule.min) % CC.loan.rule.step) !==
            0) {
            showErrors('不符合投资规则!最少为'+CC.loan.rule.min+'，且为'+CC.loan.rule.min+'的倍数');
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
    if (CC.loan.timeOpen > 0) {
        var serverDate = CC.loan.serverDate;
        var leftTime = utils.countDown.getCountDownTime2(CC.loan.timeOpen,
            serverDate);
        if (leftTime) {
            var countDownRactive = new Ractive({
                el: ".next-time",
                template: require('ccc/loan/partials/countDown.html'),
                data: {
                    countDown: {
                        days: leftTime.day,
                        hours: leftTime.hour,
                        minutes: leftTime.min,
                        seconds: leftTime.sec
                    }
                }
            });
            var interval = setInterval((function () {
                serverDate += 1000;
                var leftTime = utils.countDown.getCountDownTime2(
                    CC.loan.timeOpen, serverDate);
                if(!+(leftTime.day) && !+(leftTime.hour) && !+(leftTime.min) && !+(leftTime.sec)){
                    clearInterval(interval);
                    window.location.reload();
                }else{
                    countDownRactive.set('countDown', {
                        days: leftTime.day,
                        hours: leftTime.hour,
                        minutes: leftTime.min,
                        seconds: leftTime.sec
                    });
                }
            }), 1000);
        }
    }


     function parsedata(o) {
        var type =  {
            'CASH': '现金券',
            'INTEREST': '加息券',
            'PRINCIPAL': '增值券',
            'REBATE': '返现券'
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

    function showSelect(amount){
        var months = CC.loan.duration;
        investRactive.set('inum', parseFloat(amount));
        disableErrors()
        $.post('/loan/selectOption',{
            amount:amount,
            months:months
        }, function (o) {
            if (o.success) {
                investRactive.set('selectOption',parsedata(o.data));
            }
        });
    }
    //初始化选项
    showSelect(0);

    $('.invest-input')
    .on('keyup',function(){
        showSelect($(this).val());
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
        var index = Number(e.keypath.substr(5));
    
        var options = {
            imgs: imgs,
            currentIndex: index,
            selectorsMarginLeft: 0,
            stageLen: 5,
            imgLen: imgs.length
        };
        popupBigPic.show(options);
        return false;

    });

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

function add(){
var getNum = parseInt(document.getElementById("calculatorText").value);
if(getNum >0){
document.getElementById("calculatorText").value = getNum+100;
}else{
}
}










