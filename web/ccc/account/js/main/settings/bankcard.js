"use strict";

var Ractive = require('ractive/ractive-legacy');
var utils = require('assets/js/lib/utils');
var $ = require('jquery');
var filter = require('lodash-node/modern/collections/filter');
var UMPBANKS = require('assets/js/modules/cccUmpBanks');
var Confirm = require('assets/js/modules/cccConfirm');

// 过滤银行卡，只显示enabled=true的
var banks = filter(UMPBANKS, function (r) {
    return r.enable === true;
});

if (CC.user.account) {
    CC.user.account.Faccount = utils.bankAccount(CC.user.account.account);
}

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/account/partials/settings/bankcard.html'),

    data: {
        status: CC.user.account ? 1 : 0, // notBind:0 , cardBind: 1
        payment: CC.user.accountId ? true : false,
        banks: banks,
        msg: {
            BANK_NULL: false,
            CARD_NULL: false,
            CARD_INVALID: false
        },
        bank: '',
        cardId: '',
        edit: false,
        bankAccount: CC.user.account ? CC.user.account : {}
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
    var bank = this.get('bank');
    //var cardId = this.get('cardId');
    var cardId = $.trim($(this.el)
        .find('[name=cardId]')
        .val());

    if (!bank) {
        this.set('msg', {
            BANK_NULL: true,
            CARD_NULL: false,
            CARD_INVALID: false
        });
        return false;
    }

    if (!cardId) {
        this.set('msg', {
            CARD_NULL: true,
            BANK_NULL: false,
            CARD_INVALID: false
        });
        return false;
    }

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