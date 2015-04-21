'use strict';

var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/mobile/regist', function (req, res) {    
    res.render('mobile/regist', {
        title: '盈投保平台注册服务协议'
    });
});
router.get('/mobile/deposit', function (req, res) {    
    res.render('mobile/deposit', {
        title: '资金托管协议'
    });
});
router.get('/mobile/service', function (req, res) {    
    res.render('mobile/service', {
        title: '盈投保平台服务规则'
    });
});