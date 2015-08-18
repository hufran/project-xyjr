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

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/account/partials/settings/bankcard.html'),

    data: {
        status: banksabled.length? 1 : 0,
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
        authenticated : CC.user.authenticates.idauthenticated || false
    },
    oncomplete: function(){
        accountService.getProvince(function (res) {
            ractive.set('province', changeToList(res));
            var fProvince = ractive.get('myProvince') || '新疆';
            accountService.getCity(fProvince, function (res){
                ractive.set('city', changeToList(res));
            });
        });
    }
});

ractive.on("bind-card-submit", function () {
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

ractive.on("delete-card-submit", function () {
    Confirm.create({
        msg: '删卡是否成功？',
        okText: '删卡成功',
        cancelText: '删卡失败',
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