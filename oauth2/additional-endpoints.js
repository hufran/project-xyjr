'use strict';
module.exports = function (router, auth) {
    router.get('/api/v0/hello/world', auth.pass());
    router.get('/api/v2/message/notifications/:page/:userId', auth.owner());


    // 支付相关
    router.post('/api/v2/lianlianpay/bindCard/:userId', auth.user());
    router.post('/api/v2/lianlianpay/deposit/:userId', auth.user());
    router.post('/api/v2/lianlianpay/withdraw/:userId', auth.user());
    router.post('/api/v2/loanIntent/addNew', auth.pass());
    router.get('/api/v2/loanIntent/:userId/listAll', auth.user());
    router.get('/api/v2/lianlianpay/banks', auth.user());
    router.get('/api/v2/lianlianpay/provinceCodes', auth.user());
    router.get('/api/v2/lianlianpay/provinceCityCodes/:provinceName', auth.user());
    router.get('/api/v2/loan/getLoanProduct/productKey/:productKey', auth.user());
    router.post('/api/v2/lianlianpay/authenticateUser/:userId', auth.user());
};
