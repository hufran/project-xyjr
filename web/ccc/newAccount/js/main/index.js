'use strict';
var utils = require('ccc/global/js/lib/utils');
var Plan = require('ccc/global/js/modules/cccRepayments');
require('ccc/global/js/modules/tooltip');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;


// 可用余额
var avaAmount = parseFloat(CC.user.availableAmount).toFixed(2);
// 累计收益
var investInterestAmount = parseFloat(CC.user.investInterestAmount || 0).toFixed(2);

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
		investInterestAmount : investInterestAmount,
		totalAmount : totalAmount
	}
});

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});

var infoRactive = new Ractive({
	el: '#userinfo',
	template: require('ccc/newAccount/partials/home/userinfo.html'),
	data: {
		user: null,
		bindCards: banksabled.length >= 1 ? true :  false,
		safetyProgress: 25,
		riskText: '中'
	},
	oninit: function () {
		var safetyProgress = 25;

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
				if (infoRactive.get('bindCards')) {
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
var pageSize = 5;
var STATUS = ["SETTLED", "CLEARED", "OVERDUE", "BREACH"];

// my invest
var investRactive = new Ractive({
    el: '.ccc-myinvest-wrap',
    template: require('ccc/newAccount/partials/home/invest.html'),
    data: {
        list: []
    },
	onrender: function(){
		var self = this;
		var status = '?status=SETTLED&status=OVERDUE&status=BREACH&status=FINISHED&status=PROPOSED&status=FROZEN&status=BREACH';
		var api = '/api/v2/user/MYSELF/invest/list/0/' + pageSize + status;
		request('GET', api)
            .end()
            .then(function (r) {
				r.body.results = self.parseData(r.body.results);
                self.set('list', r.body.results);
				self.tooltip();
           });
	},
	oncomplete: function() {
		// init Plan
		var plan = new Plan();
		
		// bind events
		this.on('getPlan', function(e) {
			var $this = $(e.node);
			
			var $tr = $this.parent().parent();
			var $plan = $tr.next();
			var investId = $this.attr('data-id');
			
			$tr.toggleClass('bg-light');
			$plan.toggle ();
			
			plan.render({
				container: $plan.find('td'),
				investId: investId,
				//debug: true,
				complete: function() {
					$this.data('loaded', true);
				}
			});
		});
	},
	parseData: function(datas){
		this.sortBySubmitTime(datas);
		for (var i=0; i<datas.length; i++) {
			var o = datas[i];
			datas[i].Fduration = utils.format.duration(o.duration);
			datas[i].Frate = utils.format.percent(o.rate/100, 2);
			datas[i].Famount = utils.format.amount(o.amount, 2);                 
			datas[i].Fstatus = utils.i18n.InvestStatus[o.status];
            //前台不展示逾期,逾期标的展示给投资者时状态为已结算   
            if( o.status === 'OVERDUE' ){
                datas[i].Fstatus = utils.i18n.InvestStatus.SETTLED;
            }
			datas[i].hasContract = ($.inArray(o.status, STATUS) !== -1) ? true:false;
			
			if (datas[i].hasContract) {
				var repay = this.getRepay(o.repayments);
				datas[i].Frepayed = utils.format.amount(repay.repayed, 2);
				datas[i].Funrepay = utils.format.amount(repay.unrepay, 2);
			}
		}
		return datas;
	},
	tooltip: function() {
		$('.tips-top').tooltip({
			container: 'body',
			placement: 'top'
		});
	},
	getRepay: function(datas) {
		// repayed, unrepay
		var repay = {
			repayed: 0,
			unrepay: 0
		};
		if (!datas) {
			return repay;
		}
		//var _repayed = 0, _unrepay = 0;
		for (var i=0; i<datas.length; i++) {
			var o = datas[i];
			var _total = o.repayment.amountPrincipal + o.repayment.amountInterest;
			if (o.status === 'REPAYED') {
				repay.repayed += _total;
			} else {
				repay.unrepay += _total;
			}
		}
		return repay;
	},
	sortBySubmitTime: function(datas) {
		if (datas.length === 0) {
			return datas;
		}
		datas.sort(function compare (a, b) {
			return b.submitTime - a.submitTime;
		});
	}
});