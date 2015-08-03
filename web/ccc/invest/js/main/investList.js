/*jshint multistr: true */

"use strict";

var i18n = require('@ds/i18n')['zh-cn'];

var InvestListService = require('ccc/invest/js/main/service/list')
    .InvestListService;
var utils = require('ccc/global/js/lib/utils');
require('ccc/global/js/lib/jquery.easy-pie-chart.js')

// 收益计算器
var Cal = require('ccc/global/js/modules/cccCalculator');
$('.benefit-calculator')
    .on('click', function () {
        Cal.create();
    });

var params = {
    pageSize: 9,
    status: 'SCHEDULED',
    minDuration: 0,
    maxDuration: 100,
    minRate: 0,
    maxRate: 100,
    currentPage: 1
};


function jsonToParams(params) {
    var str = '';
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            str += '&' + key + '=' + params[key];
        }
    }
    return str;
}

function formateLeftTime(leftTime){
    var diffmin = leftTime / 1000 / 60;
    var str = "";
    if (diffmin > 0) {
        var _day = Math.ceil(diffmin / 60 / 24);
        if( _day > 1){
            str = _day+"天";
        }else{
            var _hour = Math.ceil(diffmin / 60);
            if(_hour > 1){
                str = _hour+"小时";
            }else{
                str = Math.ceil(diffmin)+"分";
            }
        }
    }else {
        var sec = Math.ceil(leftTime / 1000);
        str = sec+"秒";
    }
    return str;
}

function formatItem(item) {
    var purposeMap = {
        "SHORTTERM" : "短期周转",
        "PERSONAL" : "个人信贷",
        "INVESTMENT" : "投资创业",
        "CAR" : "车辆融资",
        "HOUSE" : "房产融资",
        "CORPORATION" : "企业融资",
        "OTHER" : "其它借款"
    };
        

    item.rate = item.rate / 100;
    item.purpose = purposeMap[item.purpose];
    item.investPercent = parseInt(item.investPercent * 100, 10);
    if (item.duration.days > 0) {
        if (typeof item.duration.totalDays === "undefined") {
            item.fduration = item.duration.days;                            
        } else {
            item.fduration = item.duration.totalDays;                            
        }
        item.fdurunit = "天";
    } else {                        
        item.fduration = item.duration.totalMonths;
        item.fdurunit = "个月";
    }
    
    if (item.amount >= 10000) {
        item.amountUnit = '万';
        item.amount = (item.amount / 10000);
    } else {
        item.amountUnit = '元';
    }
    if (item.status == "OPENED") {
        item.leftTime = formateLeftTime(item.timeLeft);
        item.open = true;
    } else if (item.status == "SCHEDULED"){
        item.scheduled = true;
    } else {
        item.finished = true;
    }
    //格式化序列号
    if( item.providerProjectCode ){
        if( item.providerProjectCode.indexOf('#') > 0 ){
            var hh_project_code = item.providerProjectCode.split('#');
            item.fProjectType = hh_project_code[0];
            item.fProjectCode = hh_project_code[1];
        } else {
            item.fProjectType = '';
            item.fProjectCode = item.providerProjectCode;
        }       
    }
    return item;
}

function parseLoanList(list) {
    for (var i = 0; i < list.length; i++) {
        list[i] = formatItem(list[i]);
    }
    return list;
}
InvestListService.getLoanListWithCondition(jsonToParams(params), function (res) {
    var investRactive = new Ractive({
        el: ".invest-list-wrapper",
        template: require('ccc/global/partials/singleInvestList.html'),
        data: {
            list: parseLoanList(res.results),
            RepaymentMethod: i18n.enums.RepaymentMethod // 还款方式
        }
    });
    initailEasyPieChart();
    ininconut();
    renderPager(res);
    investRactive.on("mouseover mouseleave", function (e) {
        var hovering = e.name === "mouseover";
        this.set(e.keypath + ".hovering", hovering);
    });

    $('.sRate li').click(function(){
        if (!$(this).hasClass("selectTitle")) {
            $(this).addClass("s__is-selected").siblings().removeClass("s__is-selected");
            var minRate = $(this)
                .data('min-rate');
            var maxRate = $(this)
                .data('max-rate');

            params.currentPage = 1;
            params.minRate = minRate;
            params.maxRate = maxRate;
            render(params);
        }
    });

    $('.sDuration li').click(function(){
        if (!$(this).hasClass("selectTitle")) {
            $(this).addClass("s__is-selected").siblings().removeClass("s__is-selected");
            var minDuration = $(this)
                .data('min-duration');
            var maxDuration = $(this)
                .data('max-duration');

            params.currentPage = 1;
            params.minDuration = minDuration;
            params.maxDuration = maxDuration;
            render(params);
        }
    });

    $('.sStatus li').click(function(){
        if (!$(this).hasClass("selectTitle")) {
            $(this).addClass("s__is-selected").siblings().removeClass("s__is-selected");
            var status = $(this).data("status");
            params.status = status;
            params.currentPage = 1;
            render(params);
        }
    });
    // $('select.condition-rate')
    //     .on('change', function () {
    //         var option = this.options[this.selectedIndex];
        
    //         var minRate = $(option)
    //             .data('min-rate');
    //         var maxRate = $(option)
    //             .data('max-rate');
        
    //         params.currentPage = 1;
    //         params.minRate = minRate;
    //         params.maxRate = maxRate;
    //         render(params);
    //     });

    // $('select.condition-status')
    //     .on('change', function () {
    //         var status = this.value;
    //         params.status = status;
    //         params.currentPage = 1;
    //         render(params);
    //     });

    // $('select.condition-durations')
    //     .on('change', function () {
    //         var option = this.options[this.selectedIndex];
    //         var minDuration = $(option)
    //             .data('min-duration');
    //         var maxDuration = $(option)
    //             .data('max-duration');
    //         params.minDuration = minDuration;
    //         params.maxDuration = maxDuration;
    //         params.currentPage = 1;
    //         render(params);
    //     });

    // $('select.condition-method')
    //     .on('change', function () {
    //         var method = this.value;
    //         params.currentPage = 1;
    //         if (method) {
    //             params.method = method;
    //         } else {
    //             delete params.method;
    //         }
    //         render(params);
    //     });


    function render(params) {
        InvestListService.getLoanListWithCondition(jsonToParams(params),
            function (
                res) {
                investRactive.set('list', []);
                setTimeout(function () {
                    investRactive.set('list', parseLoanList(res.results));
                    initailEasyPieChart();
                    ininconut();
                    renderPager(res, params.currentPage);
                }, 1);
            });
    }

    function renderPager(res, current) {
        if (!current) {
            current = 1;
        }
        var pagerRactive = new Ractive({
            el: '#invest-pager',
            template: require('ccc/invest/partials/pager.html'),
            data: {
                totalPage: createList(res.totalSize, current),
                current: current
            }
        });

        pagerRactive.on('previous', function (e) {
            e.original.preventDefault();
            var current = this.get('current');
            if (current > 1) {
                current -= 1;
                this.set('current', current);
                params.currentPage = current;
                render(params);
            }
        });

        pagerRactive.on('page', function (e, page) {
            e.original.preventDefault();
            if (page) {
                current = page;
            } else {
                current = e.context;
            }
            this.set('current', current);
            params.currentPage = current;
            render(params);
        });
        pagerRactive.on('next', function (e) {
            e.original.preventDefault();
            var current = this.get('current');
            if (current < this.get('totalPage')[this.get('totalPage')
                .length - 1]) {
                current += 1;
                this.set('current', current);
                params.currentPage = current;
                render(params);
            }
        });
    }
});

function createList(len, current) {
    var arr = [];
    var j = 0;
    for (var i = 4; i > 0; i--) {
        if (current - i > 0) {
            arr[j++] = current - i;
        }

    }
    arr[j++] = current;
    for (var i = 0; i < len; i++) {
        arr[j++] = current + i + 1;
    }
    return arr;
};

function ininconut () {
    $(".investBtn > .investbtn").each(function () {
        var t = $(this);
        if(t.data("status") === 'SCHEDULED'){
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
        }
    });
};

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

// banenr动效
$(".no-warry").mouseenter(function(){
    $(this).addClass("active");
}).mouseleave(function(){
    $(this).removeClass("active");
})