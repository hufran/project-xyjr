'use strict';
module.exports = function (router, auth) {

    router.get('/api/v0/hello/world', auth.pass());
    router.get('/api/v2/message/notifications/:page/:userId', auth.owner());
    router.get('/api/v2/cms/appBootPage', auth.pass());
    //dada add
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
    router.get('/api/v2/user/:userId/funds/query', auth.pass());
    router.post('/api/v2/loanIntent/addNew', auth.pass());
    router.get('/api/v2/loanIntent/:userId/listAll', auth.user());
    router.get('/api/v2/loan/getLoanProduct/productKey/:productKey',auth.pass());
    
    

    router.get('/api/v2/message/markAsRead/:messageId', auth.user());
    router.get('/api/v2/message/user/:userId/listByStatus', auth.user());
    router.get('/api/v2/loans/getLoanWithProduct', auth.pass());
    router.get('/api/v2/message/user/:userId/notifications', auth.user());

    router.post('/api/v2/user/authenticateEmail', auth.user());
    router.get('/api/v2/user/:userId/invite', auth.user());
    //红包功能 add by Jude start
    router.get('/api/v2/rebateCounpon/listUserCouponPlacement/:userId', auth.pass());//根据用户ID获取可用奖券列表
    router.post('/api/v2/invest/tenderUseRebate/:userId', auth.pass());//投标使用返现券
    router.get('/api/v2/rebateCounpon/getRebateCouponRecordsByCouponId/:couponId',auth.pass());//根据现金券ID获取现金券的使用记录
    router.post('/api/v2/rebateCounpon/listUserCouponPlacementByCond/:userId', auth.pass());//根据奖券的类型和状态查询奖券
    router.get('/api/v2/rebateCounpon/getUsingCouponPackage',auth.user());//根据条件查询我的红包
    router.post('/api/v2/rebateCounpon/getUserCouponPlacementsByCond/:userId', auth.user());//根据奖券的类型和状态查询奖券
    
    //红包功能 add by Jude end
    router.post('/api/v2/users/mobile/encrypt', auth.pass());
    //调查问卷 add by Jude
    router.post('/api/v2/users/userQuestion', auth.pass());//提交调查问卷结果
    router.get('/api/v2/users/userQuestion/getMark/:userId', auth.pass());//登录之后查询问卷分数
    //债券转让手续费计算
    router.get('/api/v2/accountRate', auth.pass());//债权转让手续费百分比
    
    //昨日收益
    router.get('/nnfe/userFund/getYesterdayYields', auth.pass());//昨日收益
    router.get('/api/v2/user/:userId/userfundNew', auth.pass());//昨日收益
    

    router.get('/api/v2/navigation/listDisplayProductForPcContainData', auth.pass());//列表页面按钮写成读取数据
    router.get('/api/v2/loan/getLoan4Pc/:id', auth.pass()); //详情页面合同写成读取数据
    router.get('/api/v2/loan/getLoan/:id', auth.pass()); //APP详情页面合同写成读取数据
    //积分
    router.get('/api/v2/points/user/:userId/getTotalPoints', auth.user());
    router.get('/api/v2/points/user/:userId/listByPeroid/:from/:to', auth.user());
    router.get('/api/v2/points/user/:userId/listAll', auth.user());
    router.get('/api/v2/points/user/:userId/listAdds', auth.user());
    router.get('/api/v2/points/user/:userId/listReduced', auth.user());
    router.get('/api/v2/users/:userId/groupMedal', auth.user());
    router.get('/api/v2/reward/getReferralUsers/:uid', auth.user());

    router.get('/api/v2/coupon/:userId/coupons/byStatus', auth.user());//auth.user()
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
    //首页标的
    router.get('/api/v2/loans/home/summary', auth.pass());

     //用户注册动态
    router.get('/api/v2/users/getHomeDynamicData', auth.pass());

    //实名认证
    router.post('/api/v2/guozhengtong/authenticateUser/:userId', auth.owner());

    //债转相关
    router.post('/api/v2/creditassign/create/:userId/:investId/:creditDealRate', auth.user());
	router.get('/api/v2/creditassign/listForCreditAssign/:userId', auth.user());
	router.get('/api/v2/creditassign/list', auth.pass());
	router.get('/api/v2/creditassign/creditAssignDetail/:creditassignId', auth.pass());
	router.post('/api/v2/creditassign/cancel/:creditAssignId', auth.user());
	router.post('/api/v2/creditassign/autoAssign/:userId', auth.user());
    //债转转让记录
    router.get('/api/v2/creditassign/list/loan/:loanId', auth.pass());
    //自动投标
    router.post('/api/v2/:userId/save_autobid_config',auth.user());
    router.post('/api/v2/resetPassword',auth.pass());
    router.get('/api/v2/:userId/autobid_config',auth.user());
    router.get('/api/v2/getMd5keyData/:userId',auth.user());
    router.get('/api/v2/quickLogin/a/getUser/:mobile/:currentTime/:md5key',auth.pass());
    router.get('/api/v2/quickLogin/:mobile/:currentTime/:md5key',auth.pass());

    //退出登录日志
    router.post('/api/v2/user/:userId/add/activity',auth.user());

    //yeepay
    router.post('/api/v2/yeepay/deposit/:userId', auth.user());
    router.get('/api/v2/yeepay/BankDepositReturn', auth.pass());
    router.all('/api/v2/yeepay/WapDepositReturn', auth.pass());
    router.post('/api/v2/yeepay/withdrawReturn', auth.pass());
    router.get('/api/v2/yeepay/provinceCodes', auth.user());
    router.get('/api/v2/yeepay/provinceCityCodes/:provinceName', auth.user());
    router.post('/api/v2/yeepay/bindCard/:userId', auth.user());
    router.post('/api/v2/yeepay/deleteCard/:userId', auth.user());
    router.post('/api/v2/yeepay/withdraw/:userId', auth.user());
    
    router.post('/api/v2/yeepay/wapBankDeposit/:userId', auth.user());
    router.post('/api/v2/yeepay/onlineBankDepositNoBind/:userId', auth.user());
    //获取产品的列表
    router.get('/api/v2/navigation/listDisplayProductForPc/:client', auth.pass());
    router.get('/api/v2/navigation/listDisplayProductForApp/:client', auth.pass());
    router.get('/api/v2/navigation/listMessageForAppHome/:client/:size', auth.pass());
    //添加提现银行卡 新接口
    router.post('/api/v2/smsCaptcha/:userId',auth.pass());
    //购买新接口
    router.post('/api/mermaid/invest/tenderUseRebate',auth.user());
    router.post('/api/mermaid/invest/tender',auth.user());
    //充值新街口
    router.post('/api/mermaid/yeepay/wapBankDeposit',auth.user());
    //提现新接口
    router.post('/api/mermaid/yeepay/withdraw', auth.user());
    //消息新接口
    router.get('/api/mermaid/message/notifications/:userId/:page/:count', auth.user());//auth.user()
    router.get('/api/mermaid/message/markAsRead/:messId', auth.user());//auth.user()
    router.get('/api/mermaid/message/countNewNotifications/:userId', auth.user());//auth.user()
    //新接口登录
    router.post('/api/mermaid/users/login',auth.pass());
    //新接口注册
    router.post('/api/mermaid/users/register',auth.pass());
    //修改登录密码
    router.post('/api/mermaid/users/reset_password/password',auth.user());
    //修改交易密码
    router.post('/api/v2/smsCaptcha/:userId',auth.pass());
    router.post('/api/mermaid/users/resetPaymentPassword',auth.pass());
    //实名认证
    router.post('/api/mermaid/guozhengtong/authenticateUser',auth.pass());
    //分享好友
    router.get('/api/v2/user/:userId/inviteCode/', auth.pass());
    //新PC充值接口
    router.post('/api/v2/yeepay/onlineBankDeposit/:userId', auth.pass());
    router.post('/api/v2/jdpay/gateway/deposit/:userId', auth.user());
	//jdpay回调地址
	router.post('/api/v2/jdpay/gateway/BankDepositReturn', auth.pass());
    router.post('/api/v2/jdpay/asynNotify', auth.pass());
	router.post('/api/v2/jdpay/asynNotifyWap', auth.pass());

    //jd银行列表
    router.get('/fish/api/v3/jdpay/bank/list',auth.pass());
    router.get('/api/v2/jdpay/banks', auth.pass());

    //新H5充值
    router.post('/api/v2/jdpay/onlineBankDeposit4Wap/:userId', auth.pass());
    router.get('/api/mermaid/users/checkToken',auth.pass());
    router.get('/api/mermaid/users/refToken',auth.user());
    
    //美人鱼用户信息
    router.get('/api/mermaid/api/find/用户信息',auth.pass());
    router.get('/api/mermaid/message/user/:userId/listByStatus',auth.pass());
    router.post('/api/mermaid/users/changePassword',auth.pass());

    //绑卡选择业务
    router.get('/api/v2/jdpay/banks4AppServer', auth.pass());
};
