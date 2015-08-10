/**
 * @file 账户数据对接模块交互逻辑
 * @author huip(hui.peng@creditcloud.com)
 */

'use strict';

exports.accountService = {
    registerUmpay: function (user, next) {
        request('POST', '/api/v2/upayment/register/MYSELF')
            .type('form')
            .send(user)
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    bindAgrement: function(agreementList,next) {
        request('POST', '/api/v2/upayment/bindAgreement/MYSELF')
            .type('form')
            .send({agreementList: agreementList})
            .end()
            .then(function (r) {
                next(r.body);
            });
        
    },
    
    getLoanCount: function(status,next){         
        var api = '/api/v2/user/MYSELF/loan/count';
        api = api+status;
        request('GET', api)                
        .end()
            .then(function (r) {                  
                if( r.body.data > 0 ){                    
                    next(r.body.data);                    
                } else {
                    next(0);
                }
            });
    },
    authenticateUser: function(user, next) {
        request('POST', '/api/v2/lianlianpay/authenticateUser/MYSELF')
            .type('form')
            .send(user)
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    checkAuthenticate: function (next) {
        request('GET', '/api/v2/user/MYSELF/authenticates')
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    getProvince: function (next) {
        request('GET', '/api/v2/lianlianpay/provinceCodes')
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    getCity: function (provinceName, next) {
        request('GET', '/api/v2/lianlianpay/provinceCityCodes/' + provinceName)
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    getUserInfo: function (next) {
        request('GET', '/api/v2/user/MYSELF/userinfo')
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    getAccount: function (next) {
        request('GET', '/api/v2/user/MYSELF/fundaccounts')
            .end()
            .then(function (r) {
                next(r.body);
            });
    },
    feedback:function(userId,params,next){
          request('POST', '/api/v2/user/'+userId+'/feedback')
            .type('form')
            .send(params)
            .end()
            .then(function (r) {
                next(r.body);
            });
        
    }
        
};
