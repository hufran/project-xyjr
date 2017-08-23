'user strict';

var utils = require('ccc/global/js/lib/utils');
var CommonService = require('ccc/global/js/modules/common').CommonService;
var UMPBANKS = require('ccc/global/js/modules/cccUmpBanks');
var Confirm = require('ccc/global/js/modules/cccConfirm');
var accountService = require('ccc/newAccount/js/main/service/account')
    .accountService;
var CccOk = require('ccc/global/js/modules/cccOk');
var Message = require('ccc/global/js/modules/cccMessage');
require('ccc/xss.min');

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});
var ractive = new Ractive({
	el: '#ractive-container',
	template: require('ccc/newAccount/partials/withdraw.html'),
	data: {
		banks: UMPBANKS,
		loadMessage: null,
		bankcards: banksabled || [],
		availableAmount:CC.user.availableAmount||0,
		msg: {
			AMOUNT_NULL: '请输入提现金额',
			AMOUNT_INVALID: '输入的金额有误',
			AMOUNT_POOR: '您的可用余额不足',
			AMOUNT_ALL: '不足100元时请全部提现',
			ERROR: '请求出现错误',

		},
        pointNum:null,
        intNum:null,
		isSend: false,
		disabled: false,
		submitText: '确认提现',
		submitMessage: null,
		error: false,
		isEnterpriseUser: CC.user.enterprise,
        paymentPasswordHasSet : CC.user.paymentPasswordHasSet || false,
		banksabled : banksabled.length? true : false
	},
    parseDataNum:function(){
        var self = this;
        var availableAmount = parseFloat(self.get('availableAmount')).toFixed(2)+'';
        console.log(availableAmount);
        var point = availableAmount.indexOf('.');
        if(point !== -1){
            var num = availableAmount.split('.');
            self.set({
                'intNum':num[0],
                'pointNum':num[1]
            })
        }
        console.log(num);
    },
	oninit: function(){
		var self = this;
		var userInfo = CommonService.getUserInfo();
		userInfo.then(function(){
			self.set('availableAmount', CC.user.availableAmount);
		});
	},
	oncomplete: function(){
		var self = this;
		this.$help = $(this.el).find('.help-block');
		this.$amount = $(this.el).find('[name=amount]');
		this.$form = $(this.el).find('form[name=withdrawForm]');
		this.$pass = $(this.el).find('[name=paymentPassword]');
		this.$amount.focus();
		
		// set form action
		this.set('active', '/yeepay/withdraw');
		
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

		this.on('checkPassword', function () {
			var password = this.get('paymentPassword');

			if (password === '') {
				self.set('submitMessage', '请输入交易密码');
				return;
			} else {
				accountService.checkPassword(encodeURIComponent(filterXSS(password)), function (r) {
					if (!r) {
						self.set('submitMessage', '交易密码错误');
						return;
					} else {
						self.set('submitMessage', null);
					}
				});
			}
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
		// var url = '/api/v2/user/MYSELF/calculateWithdrawFee/'+amount;
		// $.ajax({
		// 	type: 'GET',
		// 	async: false,
		// 	url: url,
		// 	success: function(o){
		// 		_FEE = o;
		// 		self.set('submitText', '确认提现');
		// 		self.set('disabled', false);
		// 	},
		// 	error: function(o){
		// 		console.info('请求出现错误，' + o.statusText);
		// 		self.set('error', true);
		// 		self.set('submitText', '确认提现');
		// 		self.set('disabled', false);
		// 	}
		// });
		_FEE = {
			withdrawAmount: amount
		}
		if (_FEE === null) {
			return false;
		}
		
		// 实际到账<=0的情况
		if (_FEE.withdrawAmount <= 0) {
			//var text = '实际到账金额为'+_FEE.withdrawAmount+'元，请调整取现金额';
			this.$form.find('.post-btn').removeClass('disabled');
			var text ='请输入正确提现金额';
			self.set('submitMessage', text);
			self.set('submitText','确认提现');
			return false;
		}
		
		return confirm(
			// '实际到账' + _FEE.withdrawAmount + '元 (收取' + _FEE.totalFee + '元提现手续费)\n确认提现吗？'
			'实际到账' + _FEE.withdrawAmount + '元 (平台代付手续费)\n确认提现吗？'
		);
	},
	
	match: function(v){
		return v.toString().match(/^([0-9][\d]{0,7}|0)(\.[\d]{1,2})?$/);
	}
});
ractive.parseDataNum();
ractive.on('checkAmount',function(){
    var inp=jQuery('#withdraw');
    inp.val(inp.val().replace(/[^\d.]/g,"")); //清除"数字"和"."以外的字符
    inp.val(inp.val().replace(/^\./g,""));
    inp.val(inp.val().replace(/\.{2,}/g,"."));
    inp.val(inp.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
    inp.val(inp.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
    if (inp.val().length>2&&inp.val().substr(1,1)!='.') {
        inp.val(inp.val().replace(/\b(0+)/gi,""))
    }
})

ractive.on('withDrawSubmit', function () {
	this.set('submitMessage', null);
	var isAcess = false;
	var amount = this.get('amount');
	var pass = this.get('paymentPassword');
	if (amount === '') {
		this.set('submitMessage', this.get('msg.AMOUNT_NULL'));
	}
	
	else if (!this.match(amount)) {
		this.set('submitMessage', this.get('msg.AMOUNT_INVALID'));
		this.$amount.focus();
	}
	
	else if (parseFloat(amount) > CC.user.availableAmount) {
		this.set('submitMessage', this.get('msg.AMOUNT_POOR'));
		this.$amount.focus();
	}
	
	else if (this.get('error')) {
		this.set('submitMessage', this.get('msg.ERROR'));
	}
	
	else if (pass === '') {
		this.set('submitMessage', '请输入交易密码');
	} 

	else if (pass !== '') {
		console.log('pass!=');
		accountService.checkPassword(encodeURIComponent(filterXSS(pass)), function (r) {
			if (!r) {
				ractive.set('submitMessage', '交易密码错误');
			} else {
				ractive.set('submitMessage', null);
				if(banksabled.length) {
                    var phoneNumber = CC.user.bankCards[0].account.bankMobile;
                        phoneNumber = phoneNumber.substr(0,3) + '****' + phoneNumber.substr(-4)
                    Message.create({
                        msg: '短信验证码已发送至',
                        okText: '下一步',
                        phone: phoneNumber,
                        ok: function() {
                            isAcess = true;
                            console.log('aaaaaa')
                        },
                        close: function() {
                            isAcess = false;
                            console.log('bbbbbbb')
                        }
                    })
                }else{
                    ractive.set('submitMessage', '您尚未开通银行存管');
                    isAcess = false;
                }
                if(!isAcess){return}
                if (ractive.confirm(amount)) {
                    isAcess = true;
                }else{
                    isAcess = false;
                }
				
				if (isAcess) {
					$.post('/yeepay/withdraw', 
					{
						paymentPassword : filterXSS(pass),
						amount : filterXSS(amount)

					}, function (res) {
						if (res.success) {
                            CccOk.create({
                                msg: '提现申请提交成功，等待审核中!',
                                okText: '确定',
                                // cancelText: '重新登录',
                                ok: function () {
                                    window.location.reload();
                                },
                                cancel: function () {
                                    window.location.reload();
                                }
                            });
                        } else {
                            CccOk.create({
                                msg: '提现申请失败!',
                                okText: '确定',
                                // cancelText: '重新登录',
                                ok: function () {
                                    window.location.reload();
                                },
                                cancel: function () {
                                    window.location.reload();
                                }
                            });
                        }
					});
				}else{
					$('.post-btn').removeClass('disabled');
					ractive.set('submitText','确认提现');
				}
			}
		});
	}
});
