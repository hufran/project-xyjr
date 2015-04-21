"use strict";

var $ = require('jquery');
var utils = require('assets/js/lib/utils');
var Ractive = require('ractive/ractive-legacy');
var Confirm = require('assets/js/modules/cccConfirm');
var popupInvestRactive = require('ccc/agreement/js/main/quickInvest')
    .popupInvestRactive;
var accountService = require('../service/account')
    .accountService;

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/account/partials/settings/umpay.html'),

    data: {
        accountStatus: CC.user.accountId ? (CC.user.agreement?
            'openSucceed' : 'justOpenSuccess') : 'needOpen', // needOpen需要开户 justOpenSuccess刚开户成功 openSucceed已绑定
        userName: '',
        idCode: '',
        isQuickCheck: true,
        umpAccount: {
            accountId: CC.user.accountId,
            mobile: CC.user.mobile,
            accountName: CC.user.accountName
        },
        getPwdReturn: false
    }
});

var popupDepositAgreement = require('ccc/agreement/js/main/depositAgreement')
    .popupDepositAgreement;
ractive.on('maskDepositAgreement', function () {
    popupDepositAgreement.show();
    //alert("事件出发");
});

// 要开户
ractive.on("register-account-submit", function () {
    var userName = this.get("userName");
    var idCode = this.get("idCode");
    var licenseAgreed = this.get("licenseAgreed");
    utils.formValidator.checkName(userName, function (bool,
        error) {
        if (!bool) {
            ractive.set({
                showErrorMessage: true,
                errorMessage: utils.errorMsg[error]
            });
        } else {
            utils.formValidator.checkIdNumber(idCode,
                function (bool, error) {
                    if (!bool) {
                        ractive.set({
                            showErrorMessage: true,
                            errorMessage: utils.errorMsg[
                                error]
                        });
                        return;
                    }

                    if (!licenseAgreed) {
                        ractive.set({
                            showErrorMessage: true,
                            errorMessage: "必须同意托管协议"
                        });

                        return false;
                    }
                    var user = {
                        userName: $.trim(userName),
                        idCode: $.trim(idCode),
                        mobile: $.trim(global.CC.user.mobile),
                    };
                    accountService.registerUmpay(user,
                        function (res) {
                            if (res.success) {
                                ractive.set('accountStatus',
                                    'justOpenSuccess');
                                ractive.set(
                                    'umpAccount', {
                                        accountId: res.data.accountId,
                                        accountName: res.data.accountName
                                    });
                            } else {
                                var msg = (res.data ? res.data.retMsg :
                                    (res.error instanceof Array ? res.error[
                                        0].message : res.message));
                                ractive.set({
                                    showErrorMessage: true,
                                    errorMessage: msg
                                });
                            }
                        });
                });
        }
    });
});


// 继续开通
ractive.on('continue-open', function () {
    if (!this.get('isQuickCheck')) {
        this.set({
            showErrorMessage: true,
            errorMessage: "必须同意托管协议"
        });
    } else {
        Confirm.create({
            msg: '签订是否成功？',
            okText: '签订成功',
            cancelText: '签订失败',
            ok: function () {
                window.location.reload();
            },
            cancel: function () {
                window.location.reload();
            }
        });
    }
});

ractive.on('agreement-check', function () {
    return false;
});

ractive.on('maskInvestAgreement', function () {
    popupInvestRactive.show();
});

ractive.on('get-pwd', function (e) {
    var self = this;
    var $this = $(e.node);
    var text = $this.text();

    if ($this.hasClass('disabled')) {
        return;
    }

    $this.text('操作中...')
        .addClass('disabled');

    var api = '/api/v2/upayment/sendPassword/MYSELF';
    $.get(api, function (o) {
        if (o.success) {
            self.set('getPwdReturn', true);
        } else {
            alert('操作出错~');
        }
        $this.text(text)
            .removeClass('disabled');
    })
        .error(function (o) {
            console.info('请求出现错误，' + o.statusText);
            $this.text(text)
                .removeClass('disabled');
        });
});