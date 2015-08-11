'use strict';

var utils = require('ccc/global/js/lib/utils');
var CommonService = require('ccc/global/js/modules/common').CommonService;
var UMPBANKS = require('ccc/global/js/modules/cccUmpBanks');
var Confirm = require('ccc/global/js/modules/cccConfirm');

var ractive = new Ractive({
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
			AMOUNT_ALL: '不足100元时请全部提现',
			ERROR: '请求出现错误',

		},
		isSend: false,
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
		this.$amount = $(this.el).find('[name=amount]');
		this.$form = $(this.el).find('form[name=withdrawForm]');
		
		this.$amount.focus();
		
		// set form action
		this.set('active', '/lianlianpay/withdraw');
		
		this.on('changeValue', function(e){
			var amount = $.trim($(e.node).val());
			
			if (amount === '') {
				self.set('submitMessage', null);
				self.set('error', false);
				return;
			} else if (!self.match(amount)) {
				self.set('submitMessage', self.get('msg.AMOUNT_INVALID'));
				return;
			} else if (parseFloat(amount) > CC.user.availableAmount) {
				self.set('submitMessage', self.get('msg.AMOUNT_POOR'));
				return;
			} else {
				self.set('submitMessage', null);
			}
		});

		this.on('checkSms', function () {
			var smsCaptcha = this.get('smsCaptcha');

			if(smsCaptcha === '') {
				self.set('submitMessage', '请填写短信验证码');
				return;
			} else if (smsCaptcha.length != 6) {
				self.set('submitMessage', '短信验证码为6位数字');
				return;
			} else {
				self.set('submitMessage', null);
			}
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
		return v.toString().match(/^([0-9][\d]{0,7}|0)(\.[\d]{1,2})?$/);
	}
});


ractive.on('sendCode', function (){

	if (!this.get('isSend')) {
		this.set('isSend', true);
		var smsType = 'CONFIRM_CREDITMARKET_WITHDRAW';
		CommonService.getMessage(smsType, function (r) {
			if (r.success) {
	            countDown();
	        }
		});
	}
});

function countDown() {
    $('.sendCode')
        .addClass('disabled');
    var previousText = '获取验证码';
    var msg = '$秒后重新发送';

    var left = 120;
    var interval = setInterval((function () {
        if (left > 0) {
            $('.sendCode')
                .html(msg.replace('$', left--));
        } else {
            $('.sendCode')
                .html(previousText);
            $('.sendCode')
                .removeClass('disabled');
            clearInterval(interval);
        }
    }), 1000);
}
