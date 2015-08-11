'use strict';
module.exports = function (router, auth) {
    router.get('/api/v0/hello/world', auth.pass());
    router.get('/api/v2/message/notifications/:page/:userId', auth.owner());


    // 支付相关
    router.post('/api/v2/lianlianpay/bindCard/:userId', auth.user());
    router.post('/api/v2/lianlianpay/deposit/:userId', auth.user());
    router.post('/api/v2/lianlianpay/withdraw/:userId', auth.user());
    router.post('/api/v2/lianlianpay/depositReturn', auth.pass());
    router.get('/api/v2/lianlianpay/banks', auth.user());
    router.get('/api/v2/lianlianpay/provinceCodes', auth.user());
    router.get('/api/v2/lianlianpay/provinceCityCodes/:provinceName', auth.user());
    router.post('/api/v2/lianlianpay/authenticateUser/:userId', auth.user());
    router.post('/api/v2/lianlianpay/withdrawReturn', auth.pass());
    router.post('/api/v2/loanIntent/addNew', auth.pass());
    router.get('/api/v2/loanIntent/:userId/listAll', auth.user()); 
    router.get('/api/v2/loan/getLoanProduct/productKey/:productKey');
    
    router.get('/api/v2/message/markAsRead/:messageId', auth.user());
    router.get('/api/v2/message/user/:userId/listByStatus', auth.user());
    router.get('/api/v2/message/user/:userId/notifications', auth.user());

    router.post('/api/v2/user/authenticateEmail', auth.user());
    router.get('/api/v2/user/:userId/invite', auth.user());
    router.post('/api/v2/users/mobile/encrypt', auth.pass());
};
