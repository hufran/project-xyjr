'use strict';
var utils = require('ccc/global/js/lib/utils');
var Plan = require('ccc/global/js/modules/cccRepayments');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var Tips = require('ccc/global/js/modules/cccTips');
require('ccc/global/js/modules/tooltip');
require('ccc/global/js/modules/cccPaging');

var repayDetailTpl = require('ccc/newAccount/partials/loan/repayDetail.html');
// 可用余额
var avaAmount = parseFloat(CC.user.availableAmount).toFixed(2);

// 累计收益
var investInterestAmount = parseFloat(CC.user.investStatistics.investInterestAmount || 0).toFixed(2);

// 待收金额
var dueInAmount = CC.user.dueInAmount || 0;

// 冻结金额
var frozenAmount = CC.user.frozenAmount || 0;

// 总资产
var totalAmount = parseFloat(CC.user.availableAmount + dueInAmount + frozenAmount).toFixed(2);

var homeRactive = new Ractive({
	el: '.account-home-wrapper',
	template: require('ccc/newAccount/partials/home.html'),
	data: {
		avaAmount : avaAmount,
		cAmount : parseFloat(CC.user.availableAmount).toFixed(2),
		investInterestAmount : investInterestAmount,
		totalAmount : totalAmount,
		cTotalAmount : parseFloat(CC.user.availableAmount + dueInAmount + frozenAmount).toFixed(2),
		dueInAmount : parseFloat(dueInAmount).toFixed(2),
		frozenAmount : parseFloat(frozenAmount).toFixed(2)
	},
    parseData:function(){
		var self = this;
        var investInterestAmount = self.get('investInterestAmount') + '';
        var avaAmount = self.get('avaAmount') + '';
		var totalAmount = self.get('totalAmount') + '';
		var check = totalAmount.indexOf('.');
        var check = avaAmount.indexOf('.');
        var check = investInterestAmount.indexOf('.');
		if (check == -1){
			self.set('totalAmount',parseInt(totalAmount));
            self.set('avaAmount',parseInt(avaAmount));
            self.set('investInterestAmount',parseInt(investInterestAmount));
		}else{
			console.log(investInterestAmount);
			var amoutArray = totalAmount.split('.');
			self.set('totalAmount',parseInt(amoutArray[0]));
			self.set('moreAmount',amoutArray[1] );
            var amoutArray = avaAmount.split('.');
			self.set('avaAmount',parseInt(amoutArray[0]));
			self.set('morAmount',amoutArray[1]);
            var amoutArray = investInterestAmount.split('.');
			self.set('investInterestAmount',parseInt(amoutArray[0]));
			self.set('moreiAmount',amoutArray[1]);
			console.log(amoutArray);
			console.log(this.get('moreiAmount'));
		}
	}
});
homeRactive.parseData();

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});

var infoRactive = new Ractive({
	el: '#userinfo',
	template: require('ccc/newAccount/partials/home/userinfo.html'),
	data: {
		user: null,
		paymentPasswordHasSet : CC.user.paymentPasswordHasSet,
		isEnterprise : CC.user.enterprise,
		banksabled : banksabled.length? true : false,
		safetyProgress: 25,
		riskText: '中',
		vip:'普通用户',
		showVip: true
	},
	oninit: function () {
		var safetyProgress = 25;
		accountService.getVipLevel(function (r) {
			if(r.success && r.data) {
				infoRactive.set('vip', r.data.level.name);
			}
		});
		accountService.checkAuthenticate(function (r) {
			accountService.getUserInfo(function (res) {
				infoRactive.set('user', res.user);
				infoRactive.set('emailAuthenticated', r.emailAuthenticated);

				if (res.user.name) {
					safetyProgress += 25;
				}
				if (r.emailAuthenticated) {
					safetyProgress += 25;
				}
				if (infoRactive.get('paymentPasswordHasSet')) {
					safetyProgress += 25;
				}
				infoRactive.set('safetyProgress', safetyProgress)
				if (safetyProgress > 75) {
					infoRactive.set('riskText', '高');
				}
			});
		});

		accountService.getGroupMedal(function (r) {
			infoRactive.set('groupMedal', r);
		});
	}
});

var pageSize = 6;
var page = 1;
var moment = require('moment');
var aaa = moment();
var currentTime = aaa._d;
var currentYear = currentTime.getFullYear();
var currentMonth = currentTime.getMonth()+1;
var currentDay = currentTime.getDate()+1;
var startTime = Date.UTC(currentYear,currentTime.getMonth(),1,-8,0,0);
var endTime = Date.UTC(currentYear,currentMonth,1,-8,0,0);
var investRactive = new Ractive({
    el:'.ccc-myinvest-wrap',
    template: require('ccc/newAccount/partials/home/invest.html'),
    api: '/api/v2/user/MYSELF/investRepayments/$page/$pageSize?to='+endTime+'&from='+startTime,
    data:{
        totalSize:0,
        list:[]
    },
    onrender: function() {
		var self = this;
		this.getData(function(o) {
			self.setData(parseInvestData(o));
    		self.tooltip();
		});
	},
    getData :function(callback){
		var api = this.api;
		api = api.replace('$page', 1).replace('$pageSize', pageSize);
		$.get(api, function(o) {
			callback(o);
		}).error(function(o) {
			console.info('请求出现错误，' + o.statusText);
		});
    },
    setData: function (o) {
		this.set('totalSize', o.totalSize);
		this.set('pageOne', o.results);
		this.set('list', o.results);
		this.renderPager();
    },
    renderPager: function() {
		var self = this;
		
		$(this.el).find(".ccc-paging").cccPaging({
			total: self.get('totalSize'),
			perpage: pageSize,
			api: self.api.replace('$pageSize', pageSize),
			params: {
				pageFromZero: false,
				type: 'GET',
				error: function(o) {
					console.info('请求出现错误，' + o.statusText);
				}
			},
			onSelect: function(p, o) {
				self.set('list', p > 1 ? parseInvestData(o).results : self.get('pageOne'));
			}
		});
	},
	getDetail: function(id, type, callback) {
		var url = '/api/v2/loan/repay/' + id + (type === 'overdue' ? '/'+type: '') + '/detail';
		$.get(url + '?t=' + (new Date()).getTime(), function(o) {
			callback(o);
		});
	},
	parseDetailData: function(data) {
		if (type === 'overdue') {
			data.detail.Finterest = utils.format.amount(data.detail.interest, 2);
			data.detail.FloanFee = utils.format.amount(data.detail.loanFee, 2);
			data.detail.FmanageFee = utils.format.amount(data.detail.manageFee, 2);
			data.detail.Foutstanding = utils.format.amount(data.detail.outstanding, 2);
			data.detail.Fprincipal = utils.format.amount(data.detail.principal, 2);
			data.detail.Ftotal = utils.format.amount(data.detail.total, 2);
			data.penalty.Foverdue = utils.format.amount(data.penalty.overdue, 2);
			data.penalty.Fpenalty = utils.format.amount(data.penalty.penalty, 2);
			data.penalty.Ftotal = utils.format.amount(data.penalty.total, 2);
			data.Ftotal = utils.format.amount(data.total, 2);
		} else {
			data.Finterest = utils.format.amount(data.interest, 2);
			data.FloanFee = utils.format.amount(data.loanFee, 2);
			data.FmanageFee = utils.format.amount(data.manageFee, 2);
			data.Foutstanding = utils.format.amount(data.outstanding, 2);
			data.Fprincipal = utils.format.amount(data.principal, 2);
			data.Ftotal = utils.format.amount(data.total, 2);
		}
		return data;
	},
	tooltip: function() {
		$('.tips-top').tooltip({
			container: 'body',
			placement: 'bottom'
		});
	}
});


investRactive.on('repay-detail', function(e) {
	var $this = $(e.node);
	var id = $this.parent().attr('data-id');
	var type = $this.parent().attr('data-status');
	investRactive.getDetail(id, type, function(data){
	Tips.create({
		obj: $this,
		width: 270,
		height: type === 'overdue' ? 305 : 260,
		callback: function (container) {
			new Ractive({
				el: container,
				template: repayDetailTpl,
				data: {
					data: self.parseDetailData(data),
					overDueType: (type === 'overdue' ? true : false)
				},
				oncomplete: function() {
					this.on('close-detail', Tips.close);
				}
			});
		}
	});});
});
var parseInvestData = function (o) {
	
	var res = o.data.results;
	var methodZh = {
        'MonthlyInterest': '按月付息到期还本',
        'EqualInstallment': '按月等额本息',
        'EqualPrincipal': '按月等额本金',
        'BulletRepayment': '一次性还本付息',
        'EqualInterest': '月平息'
    };
    
    for(var i = 0;i < res.length; i ++) {
		res[i].FavaAmount = utils.format.amount(CC.user.availableAmount, 2);
    	res[i].repayMethod = methodZh[res[i].repayment.invest.repayMethod];
    }

    return o.data;
};
