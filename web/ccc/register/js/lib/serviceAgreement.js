/**
 * @file 长江财富服务规则的交互逻辑层
 * @author lilulu(lilulu@hanhua.com)
 */

"use strict";
var Ractive = require('ractive/ractive-legacy');
exports.popupServiceAgreement = {
    instance: false,
    init: function () {

        this.popupServiceAgreementRactive = new Ractive({
            el: '#service-agreement-wraper',
            template: require('../../partials/serviceAgreement.html'),
            data: {
                visible: false
            }
        });

        var popupServiceAgreementRactive = this.popupServiceAgreementRactive;

        // 初始化captcha
        // showCaptcha();

        popupServiceAgreementRactive.on('close', function () {
            this.set('visible', false);
            //utils.maskLayer.close();
        });
    },

    show: function (postCloseHook) {
        if (!this.instance) {
            this.init();
            this.instance = true;
        }
        if (typeof postCloseHook === 'function') {
            var listener = this.popupServiceAgreementRactive.on(
                'close', function () {
                    postCloseHook();
                    listener.cancel();
                });
        }
        this.popupServiceAgreementRactive.set('visible', true);
    }
};