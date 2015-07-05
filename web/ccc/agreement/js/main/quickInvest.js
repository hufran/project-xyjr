/**
 * @file 快速投资协议
 * @author huip(hui.peng@creditcloud.com)
 */
"use strict";
var template = require('ccc/agreement/partials/quickInvest.html');
var maskLayer = require('ccc/global/js/lib/maskLayer');
exports.popupInvestRactive = {
    instance: false,
    init: function () {

        this.popupInvestRactive = new Ractive({
            el: '#quickInvest-agreement-wraper',
            template: template,
            data: {
                visible: false
            }
        });

        var popupInvestRactive = this.popupInvestRactive;

        // 初始化captcha
        // showCaptcha();

        popupInvestRactive.on('close', function () {
            this.set('visible', false);
            maskLayer.close();
        });                          
    },

    show: function () {
        if (!this.instance) {
            this.init();
            this.instance = true;
        }
        this.popupInvestRactive.set('visible', true);
        var popupInvestRactive = this.popupInvestRactive;
        maskLayer.show({
            onClick: function () {
                popupInvestRactive.fire('close');
            }
        });
    }
};
