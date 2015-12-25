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
    router.get('/api/v2/lianlianpay/bankCodes', auth.user());
    router.get('/api/v2/lianlianpay/provinceCodes', auth.user());
    router.get('/api/v2/lianlianpay/provinceCityCodes/:provinceName', auth.user());
    router.post('/api/v2/lianlianpay/authenticateUser/:userId', auth.user());
    router.post('/api/v2/lianlianpay/withdrawReturn', auth.pass());
    router.post('/api/v2/lianlianpay/deleteCard/:userId', auth.user());
    router.post('/api/v2/user/:userId/setPaymentPassword', auth.user());
    router.post('/api/v2/user/:userId/updatePaymentPassword', auth.user());
    router.post('/api/v2/user/:userId/resetPaymentPassword', auth.user());
    router.get('/api/v2/user/:userId/paymentPasswordHasSet', auth.user());
    router.get('/api/v2/user/:userId/validatePaymentPassword', auth.user());
    router.get('/api/v2/user/:userId/certificates/proofs', auth.pass());
    router.get('/api/v2/user/:userId/membership', auth.user());
    router.get('/api/v2/user/:userId/fundaccountsMap', auth.user());
    router.get('/api/v2/user/:userId/funds/query', auth.user());
    router.post('/api/v2/loanIntent/addNew', auth.pass());
    router.get('/api/v2/loanIntent/:userId/listAll', auth.user()); 
    router.get('/api/v2/loan/getLoanProduct/productKey/:productKey',auth.pass());
      
    router.get('/api/v2/message/markAsRead/:messageId', auth.user());
    router.get('/api/v2/message/user/:userId/listByStatus', auth.user());
    router.get('/api/v2/loans/getLoanWithProduct', auth.pass());
    router.get('/api/v2/message/user/:userId/notifications', auth.user());

    router.post('/api/v2/user/authenticateEmail', auth.user());
    router.get('/api/v2/user/:userId/invite', auth.user());
    router.post('/api/v2/users/mobile/encrypt', auth.pass());

    //积分
    router.get('/api/v2/points/user/:userId/getTotalPoints', auth.user());
    router.get('/api/v2/points/user/:userId/listByPeroid/:from/:to', auth.user());
    router.get('/api/v2/points/user/:userId/listAll', auth.user());
    router.get('/api/v2/points/user/:userId/listAdds', auth.user());
    router.get('/api/v2/points/user/:userId/listReduced', auth.user());
    router.get('/api/v2/users/:userId/groupMedal', auth.user());
    router.get('/api/v2/reward/getReferralUsers/:uid', auth.user());

    router.get('/api/v2/coupon/:userId/coupons/byStatus', auth.user());
    router.get('/api/v2/loan/:id/invests/:page/:pageSize', auth.pass());

    //银盈通
    router.post('/api/v2/yinyingtong/onlineBankDeposit/:userId', auth.pass());
    router.post('/api/v2/yinyingtong/depositReturn', auth.pass());
    router.post('/api/v2/yinyingtong/getBankInfo', auth.pass());

    //0元购
    router.get('/api/v2/invest/shouldInvest', auth.user());
    router.post('/api/v2/invest/user/:userId/forOffline', auth.user());

    router.get('/api/v2/loans/products/list', auth.pass());

    router.post('/api/v2/users/achieve/userShare/check', auth.pass());
    router.post('/api/v2/users/achieve/userShare', auth.pass());
    router.get('/api/v2/lianlianpay/bankBranches/:cityCode/:branchNameFilter/:cardNo', auth.pass());
    router.get('/api/v2/loans/getLoanWithProduct', auth.pass());
    router.get('/api/v2/user/:userId/userAuthenticate', auth.user());
     //导航
    router.get('/api/v2/navigation/listPlayPanes', auth.pass());
//    实名认证
    router.get('/api/v2/guozhengtong/authenticateUser/:userId', auth.user());
};
