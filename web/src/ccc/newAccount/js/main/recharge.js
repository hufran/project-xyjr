'use strict';

//var NETBANKS = require('ccc/global/js/modules/netBank');
//var NETBANKS = require('ccc/global/js/modules/fastnetBank');
var banks=[];
var corBanks=[
//{"code":"9102","name":"中国工商银行","support":true},
{"code":"9105","name":"中国建设银行","support":true},
{"code":"9109","name":"中国银行","support":true},
{"code":"9103","name":"中国农业银行","support":true},
{"code":"9104","name":"交通银行","support":true},
{"code":"9107","name":"招商银行","support":true},
//{"code":"9108","name":"光大银行","support":true},
{"code":"9110","name":"平安银行","support":true},
];
require('ccc/global/js/modules/cccTab');
var Confirm = require('ccc/global/js/modules/cccConfirm');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;

var ractive = new Ractive({
    el: '#ractive-container',
    template: require('ccc/newAccount/partials/recharge/recharge.html'),
    data: {
        loading: true,
        availableAmount: CC.user.availableAmount || 0,
        msg: {
            BANK_NULL: false,
            AMOUNT_NULL: false,
            AMOUNT_INVALID: false
        },
        pointNum:null,
        intNum:null,
        isNormal: false,
        corBanks:corBanks,
        isEnterpriseUser: CC.user.enterprise,
        bankCodeEnd: (function () {
            if(CC.user.enterprise) {
                return '-NET-B2B';
            }else {
                return '-NET-B2C';
            }
        })(),
        isBankCard: CC.user.bankCards.length,
        amountValue: 10000000,
        action:'/api/v2/jdpay/gateway/deposit/'+CC.user.id,
        showNum: 9,
        minAmount: 100
    },
    parseData:function(){
        var self = this;
        var availableAmount = self.get('availableAmount').toFixed(2)+'';
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
    oncomplete: function () {
        var self = this;
        this.$help = $(this.el)
            .find('.help-block');
        this.$amount = $(this.el)
            .find('[name=rechargeValue]');
        this.$form = $(this.el)
            .find('form[name=rechargeForm]');

        this.on('changeValue', function (e) {
            self.set('msg', {
                BANK_NULL: false,
                AMOUNT_NULL: false,
                AMOUNT_INVALID: false
            });
            var value = $(e.node)
                .val();
            console.log(parseInt(value));
            if (value === '') {
                self.set('msg.AMOUNT_NULL', true);
                return;
            }

            if (!self.get('msg.AMOUNT_MULL')) {
                self.set('msg.AMOUNT_NULL', false);
            } else {
                self.set('msg.AMOUNT_NULL', true);
            }

            self.set('msg.AMOUNT_INVALID', !self.match($(e.node)
                .val()));

        });

        $(".bankwrap").delegate('.bankItem', 'click', function () {

            var classMap = ['jd1025','jd1051','jd103','jd3080','jd104','jd312','jd305','jd313','jd3061','jd307','jd311','jd3230','jd310'];

            var code = 'jd'+$(this).data('cc');
            if ($.inArray(code,classMap) == -1) {
                ractive.set('showamountInfo', false);
            } else {
                ractive.set('showamountInfo', true);
                $("#" + code).show().siblings().hide();
            }
            $('.bankItem')
                .removeClass('currentBank');
            $(this)
                .addClass('currentBank');
            $('.bankItem')
            	.find('span.check')
            	.hide();
            $(this)
            	.find('span.check')
            	.show()

          	var type = $(this).parent().siblings('.methodwr').data('type');
		    if (type !== 'net') {
        		ractive.set('isNormal', true);
		        ractive.set('action', '/yeepay/deposit');
		    } else {
        		ractive.set('isNormal', false);
		        ractive.set('action', '/api/v2/jdpay/gateway/deposit/'+CC.user.id);
		    }
        });

        //jd快捷支付
        $(".fastbankwrap").delegate('.bankItem', 'click', function () {
            var classMap = ['ICBC','CCB','ABC','CMBCHINA','BOC','CEB','CMBC','ECITIC','GDB','PINGAN','HXB','POST','BCCB'];

            var code =$(this).data('cc');
            if ($.inArray(code,classMap) == -1) {
                ractive.set('showamountInfo', false);
            } else {
                ractive.set('showamountInfo', true);
                $("#" + code).show().siblings().hide();
            }
            $('.bankItem')
                .removeClass('currentBank');
            $(this)
                .addClass('currentBank');
            $('.bankItem')
                .find('span.check')
                .hide();
            $(this)
                .find('span.check')
                .show()

            var type = $(this).parent().siblings('.methodwr').data('type');
            if (type !== 'net') {
                ractive.set('isNormal', true);
                ractive.set('action', '/yeepay/deposit');
            } else {
                ractive.set('isNormal', false);
                ractive.set('action', '/api/v2/yeepay/onlineBankDeposit/'+CC.user.id);
            }
        });


    },

    match: function (v) {
        return v.match(/^[0-9]\d*(\.\d{0,2})?$/);
    }

});

request('GET','/fish/api/v3/jdpay/bank/list').end().
    then(function (r) {
        banks=r.body.data;
        ractive.set('banks', banks);
    });
ractive.parseData();

ractive.on('recharge_submit', function (e){
    var amount = this.get('amount');
    var actionName=this.get('action');
    this.set('amountNew',amount);
    if (actionName=='/api/v2/yeepay/onlineBankDeposit/'+CC.user.id &&amount!='') {
            amount = parseFloat(amount)*100;
            this.set('amountNew',amount);
        
    };
    this.set('msg', {
        BANK_NULL: false,
        AMOUNT_NULL: false,
        AMOUNT_INVALID: false,
        BANKCODE_NULL: false,
        AMOUNT_NOTENOUGH : false,
    });
    if (amount === ''||parseFloat(amount)<=0) {
        console.log(amount=== '');
        e.original.preventDefault();
        this.$amount.focus();
        this.set('msg.AMOUNT_NULL', true);
        return false;
    }
//    else if (amount > 10 ) {
//        e.original.preventDefault();
//        this.set('msg.AMOUNT_NOTENOUGH', true);
//        this.$amount.focus();
//        return false;
//    }
    else if (!this.match(amount) || parseFloat(amount) > parseFloat(this.get('amountValue'))) {
        e.original.preventDefault();
        this.set('msg.AMOUNT_INVALID', true);
        this.$amount.focus();
        return false;
    }
    if (!this.get('isNormal')) {
        var code = this.get('bankCode');
        if (!code) {
            e.original.preventDefault();
            this.set('msg.BANKCODE_NULL', true);
            return false;
        }

    }

    Confirm.create({
        msg: '充值是否成功？',
        okText: '充值成功',
        cancelText: '充值失败',
        ok: function () {
            window.location.href = '/newAccount/fund/loanDeal';
        },
        cancel: function () {
            window.location.reload();
        }
    });
});

ractive.on('changeMethod', function (event) {
    var type = event.node.getAttribute('data-type');
    if (type !== 'net') {
        ractive.set('isNormal', true);
        ractive.set('action', '/yeepay/deposit');
    } else {
        ractive.set('isNormal', false);
        ractive.set('action','/api/v2/jdpay/gateway/deposit/'+CC.user.id);
    }
});
ractive.on('showAll', function () {
	this.set('showNum', banks.length);
});

ractive.on('selectBank', function (event) {
    if ($('#paynet').prop('checked')==true) {
        var code = event.node.getAttribute('data-cc');
        this.set('bankCode', code);
    }else{
        if (CC.user.bankCards.length>0) {
            this.set('bankCode', CC.user.bankCards[0].account.account);
        };
        
    }
    
});
ractive.on('chooseBank', function (event) {
    if ($('#paynet').prop('checked')==true) {
        var code = event.node.getAttribute('data-cc');
        this.set('bankCode', code);
    }else{
        if (CC.user.bankCards.length>0) {
            this.set('bankCode', CC.user.bankCards[0].account.account);
        };
        
    }
    
});

ractive.on('choosePayType', function (event) {
    if ($('#paynet').prop('checked')==true) {
        $('.fastbankwrap').css('display','none');
        $('.bankwrap').css('display','block');
        ractive.set('showamountInfo', false);
        $('.bankItem').removeClass('currentBank');
        $('.bankItem').find('span.check').hide();
        ractive.set('bankCode','');
        
    }else{
        ractive.set('showamountInfo', false);
        $('.bankItem').removeClass('currentBank');
        $('.bankItem').find('span.check').hide();
        if (CC.user.bankCards.length>0) {
            this.set('bankName',CC.user.bankCards[0].account.bank);
        };
        ractive.set('bankCode','');
        $('.fastbankwrap').css('display','block');
        $('.bankwrap').css('display','none');
        //ractive.set('action','/api/v2/jdpay/gateway/deposit/'+CC.user.id);

    }
    
});