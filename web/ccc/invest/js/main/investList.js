/*jshint multistr: true */

"use strict";

var Ractive = require('ractive/ractive-legacy');
var $ = require('jquery');
var i18n = require('@ds/i18n')['zh-cn'];

var InvestListService = require('ccc/invest/js/main/service/list')
    .InvestListService;

// 收益计算器
var Cal = require('assets/js/modules/cccCalculator');
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

function formatItem(item) {
    item.rate = item.rate / 100;
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
        template: require('partials/singleInvest.html'),
        data: {
            list: parseLoanList(res.results),
            RepaymentMethod: i18n.enums.RepaymentMethod // 还款方式
        }
    });
    renderPager(res);
    investRactive.on("mouseover mouseleave", function (e) {
        var hovering = e.name === "mouseover";
        this.set(e.keypath + ".hovering", hovering);
    });


    $('select.condition-rate')
        .on('change', function () {
            var option = this.options[this.selectedIndex];
        
            var minRate = $(option)
                .data('min-rate');
            var maxRate = $(option)
                .data('max-rate');
        
            params.currentPage = 1;
            params.minRate = minRate;
            params.maxRate = maxRate;
            render(params);
        });

    $('select.condition-status')
        .on('change', function () {
            var status = this.value;
            params.status = status;
            params.currentPage = 1;
            render(params);
        });

    $('select.condition-durations')
        .on('change', function () {
            var option = this.options[this.selectedIndex];
            var minDuration = $(option)
                .data('min-duration');
            var maxDuration = $(option)
                .data('max-duration');
            params.minDuration = minDuration;
            params.maxDuration = maxDuration;
            params.currentPage = 1;
            render(params);
        });

    $('select.condition-method')
        .on('change', function () {
            var method = this.value;
            params.currentPage = 1;
            if (method) {
                params.method = method;
            } else {
                delete params.method;
            }
            render(params);
        });


    function render(params) {
        InvestListService.getLoanListWithCondition(jsonToParams(params),
            function (
                res) {
                investRactive.set('list', parseLoanList(res.results));
                renderPager(res, params.currentPage);
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
}
