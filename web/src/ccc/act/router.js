'use strict';
var ccBody = require('cc-body');
var middlewares = require('./middlewares');

module.exports = function (router) {
    router.get('/act', middlewares.registerPage);
    router.get('/act/ajax/smsCaptcha', middlewares.captchaRequired, middlewares.smsCaptcha);
    router.get('/act/ajax/voiceCaptcha', middlewares.captchaRequired, middlewares.voiceCaptcha);
    router.post('/act/ajax/submit', ccBody, middlewares.doRegister);
};
