"use strict";

var utils = require('ccc/global/js/lib/utils');
var LLPBANKS = require('ccc/global/js/modules/cccllpBanks');
var Confirm = require('ccc/global/js/modules/cccConfirm');
var accountService = require('../service/account').accountService;
// 过滤银行卡，只显示enabled=true的
var banks = _.filter(LLPBANKS, function (r) {
    return r.enable === true;
});

if (CC.user.account) {
    CC.user.account.Faccount = utils.bankAccount(CC.user.account.account);
}

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/account/partials/settings/bankcard.html'),

    data: {
        status: CC.user.bankCards.length?1:0,
        payment: CC.user.name ? true : false,
        banks: banks,
        msg: {
            BANK_NULL: false,
            CARD_NULL: false,
            CARD_INVALID: false
        },
        bank: '',
        bankAccount: CC.user.bankCards || [],
        province : '',
        city: '',
        authenticated : false
    },
    oncomplete: function () {
        accountService.checkAuthenticate(function (res) {
            ractive.set('authenticated', res.idauthenticated);
            ractive.renderArea();
        });
    },
    renderArea: function(){
        accountService.getProvince(function (res) {
            ractive.set('province', changeToList(res));
            var fProvince = ractive.get('myProvince') //|| '新疆';
            accountService.getCity(fProvince, function (res){
                ractive.set('city', changeToList(res));
            });
        });

        // accountService.getAccount(function (res) {
        //     if (res.length) {
        //         ractive.set('status', 1);
        //         ractive.set('bankAccount', res);
        //     }
        // });
    }
});

ractive.on('selectBank', function (e) {
    this.$help = $(this.el)
        .find('.help-block');
    $('.bank')
        .removeClass('active');
    $(e.node)
        .addClass('active');
    this.set('bank', e.context.code);
    this.$help.empty();
});

ractive.on('updateBank', function () {
    this.set('status', 0);
    this.set('edit', true);
});
ractive.on("bind-card-submit", function () {
    // var bank = this.get('bank');
    // //var cardId = this.get('cardId');
    // var cardId = $.trim($(this.el)
    //     .find('[name=cardId]')
    //     .val());

    // if (!bank) {
    //     this.set('msg', {
    //         BANK_NULL: true,
    //         CARD_NULL: false,
    //         CARD_INVALID: false
    //     });
    //     return false;
    // }

    // if (!cardId) {
    //     this.set('msg', {
    //         CARD_NULL: true,
    //         BANK_NULL: false,
    //         CARD_INVALID: false
    //     });
    //     return false;
    // }

    Confirm.create({
        msg: '绑卡是否成功？',
        okText: '绑卡成功',
        cancelText: '绑卡失败',
        ok: function () {
            window.location.reload();
        },
        cancel: function () {
            window.location.reload();
        }
    });
});

ractive.on('selectPro',function (){
    var province = this.get('myProvince');
    accountService.getCity(province, function (res){
        ractive.set('city', changeToList(res));
    });
});

function changeToList(map) {
    var _arr = [];
    for (var key in map) {
        var tmp = {};
        tmp.key = key;
        tmp.val = map[key];
        _arr.push(tmp);   
    }

    return _arr;
};