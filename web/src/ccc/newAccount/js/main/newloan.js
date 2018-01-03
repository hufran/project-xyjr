'use strict';

var utils = require('ccc/global/js/lib/utils');
var Tips = require('ccc/global/js/modules/cccTips');
var CccOk = require('ccc/global/js/modules/cccOk');
require('ccc/global/js/modules/cccTab');
require('ccc/global/js/modules/cccPaging');
var format = require('@ds/format');

var tpl = {
    shenpi: require('ccc/newAccount/partials/loan/shenpi.html'),
    muji: require('ccc/newAccount/partials/loan/muji.html'),
    guanli: require('ccc/newAccount/partials/loan/guanli.html'),
    plan: require('ccc/newAccount/partials/loan/plan.html'),
    list: require('ccc/newAccount/partials/loan/list.html')
};

// 提前还款
var Cpayed = require('ccc/global/js/modules/payedBefore');

// 账单
var Cplan = require('ccc/global/js/modules/planlist');

var location;
function getCurrentType () {
    location = window.location.pathname.split('/');
    if (location.length <=4) {
        return location[location.length-1];
    }else{
        return location[location.length-2];
    }
    
};

$('ul.tabs li a').on('click', function() {
    var type = $(this).parent().data('type');
    init(type);
});

var RACTIVE = {
    shenpi: null,
    muji: null,
    guanli: null,
    plan: null,
    list: null
};

var api = {
    shenpi: '/api/v2/user/MYSELF/loans?page=$page&pageSize=$size&type=loan',
    muji: '/api/v2/user/MYSELF/loans?page=$page&pageSize=$size&type=loan',
    guanli: '/api/v2/user/MYSELF/loans?page=$page&pageSize=$size&type=loan',
    plan: '/api/v2/user/MYSELF/loans?page=$page&pageSize=$size&type=loan',
    list: '/api/v2/loan/$loanId/invests/$page/10'
};

var pageSize = 10;

function init(type) {
    
    if (RACTIVE[type] === null) {
        RACTIVE[type] = new Ractive({
            el: '.panel-loan',
            template: tpl[type],
            size: pageSize,
            api: api[type],
            data: {
                loading: true,
                list: [],
                total: 0,
                isEnterpriseUser: CC.user.enterprise,
                listStatus: 1
            },
            onrender: function() {
                var self = this;
                this.getData(function(o) {
                    self.set('total', o.totalSize);
                    self.setData(self.parseData(o.results));
                });
            },
            getData: function(callback) {
                var self = this;
                if (type == "list") {
                    $.get(this.api.replace('$page', 1).replace('$loanId', location[location.length-1]), function(o) {
                        self.pageOneData = o.results;
                        callback(o);
                    });
                }else{
                    $.get(this.api.replace('$page', 1).replace('$size', this.size), function(o) {
                        self.pageOneData = o.results;
                        callback(o);
                    });
                }            
            },
            parseData: function(datas) {
                for (var i=0; i<datas.length; i++) {
                    var o = datas[i];
                    datas[i].FavaAmount = utils.format.amount(CC.user.availableAmount, 2);
                    datas[i].Ftype = type;
                    
                    switch(type) {
                        case 'shenpi':
                            datas[i].Fduration = utils.format.duration(o.duration);
                            datas[i].Frate = utils.format.percent((o.rate/100), 2);
                            datas[i].Famount = utils.format.amount(o.amount, 2);
                            datas[i].Fmethod = utils.i18n.RepaymentMethod[o.method][0];
                            datas[i].Fstatus = utils.i18n.LoanStatus[o.status];
                            datas[i].status = o.status;
                            // datas[i].date=moment(datas[i].submitTime).format('YYYY-MM-DD HH:mm:ss');
                            break;
                        case 'muji':
                            datas[i].Fduration = utils.format.duration(o.duration);
                            datas[i].Frate = utils.format.percent((o.rate/100), 2);
                            datas[i].Famount = utils.format.amount(o.amount, 2);
                            datas[i].Fmethod = utils.i18n.RepaymentMethod[o.method][0];
                            datas[i].Fstatus = utils.i18n.LoanStatus[o.status];
                            datas[i].status = o.status;
                            break;
                        case 'guanli':
                            datas[i].Fduration = utils.format.duration(o.duration);
                            datas[i].Frate = utils.format.percent((o.rate/100), 2);
                            datas[i].Famount = utils.format.amount(o.amount, 2);
                            datas[i].Fmethod = utils.i18n.RepaymentMethod[o.method][0];
                            datas[i].Fstatus = utils.i18n.LoanStatus[o.status];
                            datas[i].status = o.status;
                            break;
                        case 'plan':
                            datas[i].Fduration = utils.format.duration(o.duration);
                            datas[i].Frate = utils.format.percent((o.rate/100), 2);
                            datas[i].Famount = utils.format.amount(o.amount, 2);
                            datas[i].Fmethod = utils.i18n.RepaymentMethod[o.method][0];
                            datas[i].Fstatus = utils.i18n.LoanStatus[o.status];
                            datas[i].status = o.status;
                            break;
                        case 'list':
                            datas[i].date=moment(datas[i].submitTime)
                .format('YYYY-MM-DD HH:mm:ss');
                            datas[i].phone=(datas[i].userLoginName).replace("_","").substring(4);
                            break;
                    }
                        
                }
                return datas;
            },
            setData: function(o) {
                this.set('loading', false);
                this.set('list', o);
                this.renderPager();
            },
            renderPager: function() {
                var self = this;
                $(this.el).find(".ccc-paging").cccPaging({
                    total: this.get('total'),
                    perpage: self.size,
                    api: this.api.replace('$size', this.size).replace('$loanId', location[location.length-1]),
                    params: {
                        type: 'GET',
                        error: function(o) {
                            console.warn('请求出现错误，' + o.statusText);
                        }
                    },
                    onSelect: function(p, o) {
                        self.set('list', p > 1 ? self.parseData(o.results) : self.pageOneData);
                    }
                });
            },
            oncomplete: function() {
                var self = this;
                this.on("sign", function(e){
                   var $this = $(e.node)
                   var url = $this.attr("href")
                   console.log(url)
                   if(url && url.indexOf("http") == -1){
                       e.original.preventDefault();
                       CccOk.create({
                            msg: url,
                            okText: '确定',
                            ok: function () {
                                window.location.reload();
                            },
                            close:function(){
                                window.location.reload();
                            }
                        });
                   }else{
                      CccOk.create({
                            msg: "完成签约操作",
                            okText: '确定',
                            ok: function () {
                                window.location.reload();
                            },
                            close:function(){
                                window.location.reload();
                            }
                        });
                   }
                })
                
                //提前还款
                this.on("payedBefore", function(e){
                    var $this = $(e.node);
                    Cpayed.create({
                        amount1: 1000,
                        amount2: 2000,
                        amount3: 2000,
                        amount4: 2000,
                        amount5: 2000,
                        amount6: 2000,
                        amount7: 2000,
                        date: "2017-01-02",
                        ok: function () {
                            console.log("提前还款")
                        }
                    });
                })
                
                //账单
                this.on("planlist", function(e){
                    var $this = $(e.node);
                    Cplan.create({
                        title: "第2期账单",
                        num: 3,
                        amount: 200,
                        lixi: 100,
                        guanlifei: 100,
                        faxi:100,
                        jianmian: 100,
                        money: 1000,
                        date: "2017-12-02",
                        ok: function () {
                            console.log("账单")
                        }
                    });
                })

            },
            onchange: function() {
                
            }
        });
    }
    //else { console.log('type of this ractive object has init', type); }
}
init(getCurrentType());

