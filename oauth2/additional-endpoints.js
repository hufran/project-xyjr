'use strict';
module.exports = function (router, auth) {
    router.get('/api/v0/hello/world', auth.pass());
    router.get('/api/v2/message/notifications/:page/:userId', auth.owner());


    // 支付相关
    router.post('/api/v2/lianlianpay/bindCard/:userId', auth.user());
    router.post('/api/v2/lianlianpay/deposit/:userId', auth.user());
    router.post('/api/v2/lianlianpay/withdraw/:userId', auth.user());
};
