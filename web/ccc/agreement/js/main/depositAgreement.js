/**
 * @file 盈投保平台服务规则的交互逻辑层
 * @author lilulu(lilulu@hanhua.com)
 */

"use strict";

var Ractive = require('ractive/ractive-legacy');
var maskLayer = require('assets/js/lib/maskLayer');
var template = require('ccc/agreement/partials/depositAgreement.html');
var maskLayer = require('assets/js/lib/maskLayer');

exports.popupDepositAgreement = {
    instance: false,
    init: function () {

        this.popupDepositAgreementRactive = new Ractive({
            el: '#service-agreement-wraper',
            template: template,
            data: {
                visible: false
            }
        });

        var popupDepositAgreementRactive = this.popupDepositAgreementRactive;

        // 初始化captcha
        // showCaptcha();

        popupDepositAgreementRactive.on('close', function () {
            this.set('visible', false);
            maskLayer.close();
        });                          
    },

    show: function () {
        if (!this.instance) {
            this.init();
            this.instance = true;
        }
        var popupDepositAgreementRactive = this.popupDepositAgreementRactive;
        maskLayer.show({
            onClick: function () {
                popupDepositAgreementRactive.fire('close');
            }
        });
        this.popupDepositAgreementRactive.set('visible', true);
    }
};
