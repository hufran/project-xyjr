'use strict';

require('ccc/global/js/modules/cccTab');
var UMPBANKS = {
    personal: require('ccc/global/js/modules/cccUmpBanks'),
    company: require('ccc/global/js/modules/cccUmpCompanyBanks')
};

var Confirm = require('ccc/global/js/modules/cccConfirm');

var accountService = require('ccc/account/js/main/service/account')
    .accountService;

new Ractive({
    el: '.ccc-tab-panels',
    template: require('ccc/account/partials/recharge.html'),
    data: {
        personalBanks: UMPBANKS.personal,
        companyBanks: UMPBANKS.company,
        showPersonal: 1,
        showCompany: 0,
        loading: true,
        availableAmount: CC.user.availableAmount || 0,
        rewardAmount: 0,
        loanCount: 0,
        msg: {
            BANK_NULL: false,
            AMOUNT_NULL: false,
            AMOUNT_INVALID: false
        },
        amountValue: 10000000
    },
    onrender: function () {
        var self = this;        
        accountService.getLoanCount('?status=SETTLED&status=OVERDUE',function (loanCount) {
            self.set('loanCount',loanCount);                
            });
    },
    oncomplete: function () {
        var self = this;        
        this.$help = $(this.el)
            .find('.help-block');
        this.$bank = $(this.el)
            .find('[name=bank]');
        this.$amount = $(this.el)
            .find('[name=rechargeValue]');
        this.$form = $(this.el)
            .find('form[name=rechargeForm]');

        // set form action,修改提交路径       
        this.on('showPersonal', function () {            
            this.set('showPersonal',1);
            this.set('showCompany',0);
            this.set('amountValue',10000000);
            $("#personalBtn").addClass("active");
            $("#companyBtn").removeClass("active");
            $(".header-text").text("个人充值(只支持借记卡)");

        });
        
        this.on('showCompany', function () {            
            this.set('showPersonal',0);
            this.set('showCompany',1);
            this.set('amountValue',100000000);
            $("#companyBtn").addClass("active");
            $("#personalBtn").removeClass("active");
            $(".header-text").text("企业充值(只支持借记卡)");
        });
        
        this.on('selectBank', function (e) {           
            $('.bank')
                .removeClass('active');
            $(e.node)
                .addClass('active');            
            //this.$bank.val(e.context.code);  
            $(".bank").val(e.context.code);
            this.$help.empty();
        });

        this.on('changeValue', function (e) {
            self.set('msg', {
                BANK_NULL: false,
                AMOUNT_NULL: false,
                AMOUNT_INVALID: false
            });

            var value = $(e.node)
                .val();

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

        this.$form.submit(function (e) {
            self.set('msg', {
                BANK_NULL: false,
                AMOUNT_NULL: false,
                AMOUNT_INVALID: false
            });

            if (self.$bank.val() === '') {
                e.preventDefault();
                self.set('msg.BANK_NULL', true);
                return false;
            } else if (self.$amount.val() === '') {
                e.preventDefault();
                self.$amount.focus();
                //self.set('msg.AMOUNT_NULL', true);
                return false;
            } else if (!self.match(self.$amount.val()) || parseFloat(self.$amount.val()) > parseFloat(self.get('amountValue'))) {
                e.preventDefault();
                self.set('msg.AMOUNT_INVALID', true);
                self.$amount.focus();
                return false;
            }

            Confirm.create({
                msg: '充值是否成功？',
                okText: '充值成功',
                cancelText: '充值失败',
                ok: function () {
                    window.location.href = '/account/funds';
                },
                cancel: function () {
                    window.location.reload();
                }
            });
        });
    },

    match: function (v) {
        return v.match(/^[1-9]\d*(\.\d{0,2})?$/);
    }

});
