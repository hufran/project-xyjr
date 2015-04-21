/**
 * @file 盈投保平台服务规则的交互逻辑层
 * @author lilulu(lilulu@hanhua.com)
 */

"use strict";
var Ractive = require('ractive/ractive-legacy');
exports.popupRegistAgreement = {
    instance: false,
    init: function () {

        this.popupRegistAgreementRactive = new Ractive({
            el: '#regist-agreement-wraper',
            template: require('../../partials/registAgreement.html'),
            data: {
                visible: false
            }
        });

        var popupRegistAgreementRactive = this.popupRegistAgreementRactive;

        // 初始化captcha
        // showCaptcha();

        popupRegistAgreementRactive.on('close', function () {
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
            var listener = this.popupRegistAgreementRactive.on(
                'close', function () {
                    postCloseHook();
                    listener.cancel();
                });
        }
        this.popupRegistAgreementRactive.set('visible', true);
    }
};