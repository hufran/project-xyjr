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
var CccOK = require('ccc/global/js/modules/cccOk');
var Message = require('ccc/global/js/modules/cccMessage');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var CommonService = require('ccc/global/js/modules/common').CommonService;
//新增支付方式判断
var payMethod="lianlianpay",quickBaseUrl,cyberBankBaseUrl,bankListAPI;
if(payMethod==="lianlianpay"){
    cyberBankBaseUrl="/api/v2/lianlianpay/onlineBankDeposit/";
    quickBaseUrl="/api/v2/lianlianpay/deposit/";
    bankListAPI="/api/v2/lianlianpay/banks4pc";
}else{
    cyberBankBaseUrl="/api/v2/jdpay/gateway/deposit/";
    quickBaseUrl="/api/v2/yeepay/onlineBankDeposit/";
    bankListAPI="/fish/api/v3/jdpay/bank/list";
}

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
        action:cyberBankBaseUrl+CC.user.id,
        showNum: 9,
        minAmount: 100,
        lccbId: CC.user.lccbUserId
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
    oninit: function(){
        var self = this;
        CommonService.getLccbId(CC.user.id, function(res) {
            if(res.status == 0) {
                self.set('lccbId', res.data);
            }
        })
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
            var classNewMap=['jd01020000','jd01050000','jd01040000','jd01030000','jd03010000','jd03080000','jd03020000','jd03050000','jd03090000','jd03100000','jd01000000','jd03030000','jd03070000','jd03040000','jd04031000','jd03060000','jd04012900','jd05083000','jd03110000','jd03160000','jd04721460'];

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
		        ractive.set('action', cyberBankBaseUrl+CC.user.id);
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
                ractive.set('action', quickBaseUrl+CC.user.id);
            }
        });

        if (CC.user.bankCards.length>0) {
            this.set('bankName',CC.user.bankCards[0].account.bank);
        };


    },

    match: function (v) {
        return v.match(/^[0-9]\d*(\.\d{0,2})?$/);
    }

});

request('GET',bankListAPI).end().
    then(function (r) {
        corBanks=[];
        banks=r.body.data;
        ractive.set('banks', banks);
        var ignore;
        for(var i=0;i<banks.length;i++){
            if(banks[i]["name"]!=="廊坊银行"){
                corBanks[i]=banks[i]; 
            }else{
                ignore=i;
            }
        }
        if(!isNaN(ignore)&&ignore>=0){
            corBanks.splice(ignore,1);
        }
        
        ractive.set('corBanks', corBanks);
    });
ractive.parseData();

ractive.on('checkAmount',function(){
    var inp=jQuery('#rechargeValue');
    
    inp.val(inp.val().replace(/[^\d.]/g,"")); //清除"数字"和"."以外的字符
    inp.val(inp.val().replace(/^\./g,""));
    inp.val(inp.val().replace(/\.{2,}/g,"."));
    inp.val(inp.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
    inp.val(inp.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
    if (inp.val().length>2&&inp.val().substr(1,1)!='.'&& inp.val().indexOf(".")<2) {
        inp.val(inp.val().replace(/\b(0+)/gi,""))
    }
})
ractive.on('recharge_submit', function (e){
    e.original.preventDefault();
    var amount = this.get('amount');
    var actionName=this.get('action');
    var choose =$('#paynet').prop('checked');
    this.set('amountNew',amount);

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
    if (actionName=='/api/v2/yeepay/onlineBankDeposit/'+CC.user.id &&amount!='') {
            //amount = parseFloat(amount)*100;
            amount = Math.round(amount*100);
            this.set('amountNew',amount);
    };

    if(CC.user.bankCards.length>0){
        var phoneNumber1 = CC.user.bankCards[0].account.bankMobile;
        var phoneNumber = phoneNumber1.substr(0,3) + '****' + phoneNumber1.substr(-4)
        
        Message.create({
            msg: '短信验证码已发送至',
            okText: '下一步',
            phone: phoneNumber,
            transtype: '800002',
            ok: function(a,b,c,d,e) { 
                $('.dialog').hide();
                console.log(e)
                console.log(d)
                if(choose){
                    //网银充值
                    $.post('/api/v2/lccb/deposit/'+ CC.user.userId,{
                        bankcode: CC.user.bankCards[0].account.bank,
                        cardnbr: CC.user.bankCards[0].account.account,
                        transamt: amount,
                        smsid: d,
                        validatemsg : e
                    },function(res) {
                        console.log(res)
                        CccOK.create({
                            msg: res.msg,
                            okText: '确定',
                            ok: function () {
                                window.location.reload();
                            }
                        });                    
                    })
                }else {
                    // 快捷支付
                    $.post('/api/v2/lccb/deposit/'+ CC.user.userId,{
                        bankcode: CC.user.bankCards[0].account.bank,
                        cardnbr: CC.user.bankCards[0].account.account,
                        transamt: amount,
                        smsid: d,
                        validatemsg : e 
                    },function(res) {
                        console.log(res)
                        CccOK.create({
                            msg: res.msg,
                            okText: '确定',
                            ok: function () {
                                window.location.reload();
                            }
                        });                    
                    })
                }
                
            },
            cancel: function() {

            }
        })
    }else{
        Confirm.create({
            msg: '您尚未开通银行托管，是否去开通？',
            okText: '去开通',
            cancelText: '取消',
            ok: function () {
                window.location.href = '/newAccount/settings/authentication';
            },
            cancel: function () {
                window.location.reload();
            }
        });
    }
        
});

ractive.on('changeMethod', function (event) {
    var type = event.node.getAttribute('data-type');
    if (type !== 'net') {
        ractive.set('isNormal', true);
        ractive.set('action', '/yeepay/deposit');
    } else {
        ractive.set('isNormal', false);
        ractive.set('action',cyberBankBaseUrl+CC.user.id);
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