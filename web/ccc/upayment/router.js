'use strict';
var router = module.exports = require('express')
    .Router();
var qs = require('qs');
var bodyParser = require('body-parser');

//require('cc-debug');
//var debug = require('debug')('cc:ds:upayment');

var upayUrl = 'https://pay.soopay.net/spay/pay/payservice.do';

// post
_.each({
    '/corporationNetSave': '/corporationNetSave',
    '/netSave': '/netSave',
    '/bindCard': '/bindCard',
    '/tender': '/tender',
    '/withdraw': '/withdraw',
    '/bindAgreement': '/bindAgreement',
    '/usrAcctPay': '/usrAcctPay',
    '/unbindAgreement': '/unbindAgreement'
}, function (api, fe) {
    router.post('/upayment' + fe, bodyParser(),
        function (req, res, next) {
            console.log(req.body);
            req.body.retUrl = (req.connection.encrypted ? 'https://' :
                'http://') + req.headers.host;        
            //debug(fe + ' request: %j', req.body);
            var data = qs.stringify(req.body);
            req.body = data.replace(/%5B\d+%5D/g, '');
            next();
        },
        function (req, res) {            
            req.uest.post('/api/v2/upayment' + api + '/MYSELF')
                .type("form")
                .send(req.body)
                .end()
                .then(function (r) {
                    console.log(r.body);
                    if (r.body.error && r.body.error[0].message ==='WITHDRAW_EXCEED_LIMIT') {
                        return res.render('payment/return', {
                            customText: '您今日申请提现次数过多，请明天再试。',
                            data: r.body
                        });
                    }
                    res.render('payment/post', {
                        postUrl: upayUrl,
                        data: r.body.data
                    });
                });
        });
});

// return back
_.each({
    //'/corporationNetSaveReturn': '企业充值',
    '/netSaveReturn': '充值',
    '/usrAcctPayReturn': '给商户转账',
    '/withdrawReturn': '提现请求提交',
    '/tenderReturn': '投标',
    '/bindCardReturn': '绑卡请求提交',
    '/bindAgreementReturn': '签订用户协议',
    '/unbindAgreementReturn': '解除用户已签订协议'
}, function (optype, fe) {
    router.get('/upayment' + fe,
        function (req, res) {    
        console.log(req.url);
            req.uest.get('/api/v2' + req.url)
                .end()
                .then(function (r) {
                    console.log(r.body);
                    res.render('payment/return', {
                        optype: optype,
                        data: r.body
                    });
                });
        });
});

router.post('/upayment/tender', bodyParser('json'), function (req, res) {
    req.uest.post("/api/v2/upayment/tender/MYSELF")
        .type("form")
        .send(req.body)
        .end()
        .then(function (r) {
            r.body.data.sign = encodeURIComponent(r.body.data.sign);
            res.render('payment/netsave', {
                postUrl: upayUrl,
                data: r.body.data
            });
        });
});

router.get('/upayment/bankcard', function (req, res) {
    res.json(req.uest.get('/api/v2/user/MYSELF/fundaccounts')
        .end()
        .then(function (r) {
            return r.body;
        }));
});


// 无密处理
_.each({
	'/nopwd/tender': '/tenderNoPwd'
}, function (api, fe) {
    router.post('/upayment' + fe, bodyParser(),
        function (req, res) {
			var parms = '/loan/' + req.body.loanId + '/amount/' + req.body.amount;
			console.log(parms);
            req.uest.post('/api/v2/upayment' + api + '/user/MYSELF' + parms)
                .type("form")
                .send({placementId:req.body.placementId})
                .end()
                .then(function (r) {
					console.log(r.body);
                    res.render('payment/return', {
                        postUrl: upayUrl,
                        data: r.body.data,
						optype: '投标'
                    });
                });
        });
});
