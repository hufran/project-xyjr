'use strict';

var $ = require('jquery');
var utils = require('assets/js/lib/utils');
var _ = require('lodash-node');
var Ractive = require('ractive/ractive-legacy');
var CommonService = require('assets/js/modules/common').CommonService;
var UMPBANKS = require('assets/js/modules/cccUmpBanks');
var Confirm = require('assets/js/modules/cccConfirm');

new Ractive({
	el: '.ccc-recharge-wrap',
	template: require('ccc/account/partials/withdraw.html'),
	data: {
		banks: UMPBANKS,
		loadMessage: null,
		bankcards: [],
		availableAmount: 0,
		msg: {
			AMOUNT_NULL: '请输入提现金额',
			AMOUNT_INVALID: '输入的金额有误',
			AMOUNT_POOR: '您的可用余额不足',
			ERROR: '请求出现错误'
		},
		disabled: false,
		submitText: '确认提现',
		submitMessage: null,
		error: false
	},
	oninit: function(){
		var self = this;
		
		var userInfo = CommonService.getUserInfo();
		userInfo.then(function(){
			self.set('availableAmount', CC.user.availableAmount);
		});
		
		// get banks
		this.set('loadMessage', '正在载入银行卡...');
		var url = '/api/v2/user/MYSELF/fundaccounts';
		$.get(url, function(o){
			if (o.length === 0) {
				self.set('loadMessage', '暂无数据');
			}
			self.set('bankcards', self.parseData(o));
			self.set('loadMessage', null);
		}).error(function(){
			self.set('loadMessage', '请求出错了');
		});
	},
	oncomplete: function(){
		var self = this;
		this.$help = $(this.el).find('.help-block');
		this.$amount = $(this.el).find('[name=withdraw]');
		this.$form = $(this.el).find('form[name=withdrawForm]');
		
		this.$amount.focus();
		
		// set form action
		this.set('active', '/upayment/withdraw');
		
		this.on('changeValue', function(e){
			var amount = $.trim($(e.node).val());
			
			if (amount === '') {
				self.set('submitMessage', null);
				self.set('error', false);
				return;
			}
			
			if (!self.match(amount)) {
				self.set('submitMessage', self.get('msg.AMOUNT_INVALID'));
				return;
			}
			
			self.set('submitMessage', (parseFloat(amount) > CC.user.availableAmount) ? self.get('msg.AMOUNT_POOR') : null);
		});
		
		this.$form.submit(function(e){
			self.$amount.blur();
			self.set('submitMessage', null);
			
			var amount = $.trim(self.$amount.val());
			
			if (amount === '') {
				e.preventDefault();
				self.set('submitMessage', self.get('msg.AMOUNT_NULL'));
				return false;
			}
			
			else if (!self.match(amount)) {
				e.preventDefault();
				self.set('submitMessage', self.get('msg.AMOUNT_INVALID'));
				self.$amount.focus();
				return false;
			}
			
			else if (parseFloat(amount) > CC.user.availableAmount) {
				e.preventDefault();
				self.set('submitMessage', self.get('msg.AMOUNT_POOR'));
				self.$amount.focus();
				return false;
			}
			
			else if (self.get('error')) {
				e.preventDefault();
				self.set('submitMessage', self.get('msg.ERROR'));
				return false;
			}
			
			else if (!self.confirm(amount)) {
				e.preventDefault();
				return false;
			}
			
			Confirm.create({
				msg: '提现是否成功？',
				okText: '提现成功',
				cancelText: '提现失败',
				ok: function() {
					window.location.href = '/account/funds';
				},
				cancel: function() {
					window.location.reload();
				}
			});
		});
	},
	
	parseData: function(datas) {
		// 依据UMPBANKS的code来分组
		var BANKS =  _.groupBy(UMPBANKS, function(b) {
			return b.code;
		});
		
		// format data
		for (var i=0; i < datas.length; i++) {
			var o = datas[i];
			datas[i].account.imgPos = BANKS[o.account.bank][0].imgPos;
			datas[i].Faccount = utils.bankAccount(o.account.account);
		}
		return datas;
	},
	
	confirm: function(amount) {
		var self = this;
		
		if (this.$form.find('.post-btn').hasClass('disabled')) {
			return false;
		}
		
		this.set('submitText', '操作中...');
		this.set('disabled', true);
		
		var _FEE = null;
		var url = '/api/v2/user/MYSELF/calculateWithdrawFee/'+amount;
		$.ajax({
			type: 'GET',
			async: false,
			url: url,
			success: function(o){
				_FEE = o;
				self.set('submitText', '确认提现');
				self.set('disabled', false);
			},
			error: function(o){
				console.info('请求出现错误，' + o.statusText);
				self.set('error', true);
				self.set('submitText', '确认提现');
				self.set('disabled', false);
			}
		});
		
		if (_FEE === null) {
			return false;
		}
		
		// 实际到账<=0的情况
		if (_FEE.withdrawAmount <= 0) {
			var text = '实际到账金额为'+_FEE.withdrawAmount+'元，请调整取现金额';
			self.set('submitMessage', text);
			return false;
		}
		
		return confirm(
			'实际到账' + _FEE.withdrawAmount + '元 (收取' + _FEE.totalFee + '元提现手续费)\n确认提现吗？'
		);
	},
	
	match: function(v){
		return v.toString().match(/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/);
	}
});
