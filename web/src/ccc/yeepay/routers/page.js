'use strict';
module.exports = function (router) {
    var qs = require('qs');
    var ccBody = require('cc-body');
    var log = require('bunyan-hub-logger')({app: 'web', name: 'yeepay'});
    var config = require('config');
    // post绑卡单独处理
    _.each({
        '/bindCard': '/bindCard',
        '/deleteCard': '/deleteCard'
    }, function (api, fe) {
        router.post(fe, ccBody,
            function (req, res, next) {
                req.body.userId = res.locals.user.id;
                var data = qs.stringify(req.body);
                req.body = data.replace(/%5B\d+%5D/g, '');
                next();
            },
            function (req, res) {
                req.uest.post('/api/v2/yeepay' + api + '/MYSELF')
                    .type('form')
                    .send(req.body)
                    .end()
                    .then(function (r) {
                        if (r.body.success) {
                            var data = {
                                success: r.body.success,
                            };
                            res.json(data);
                        } else {
                            res.json(r.body);
                        }
                    });
            });
    });

	_.each({
	    '/tender': '/tender',
	}, function (api, fe) {
	    router.post(fe, ccBody,
	        function (req, res, next) {
	            req.body.userId = res.locals.user.id;
	            var data = qs.stringify(req.body);
	            req.bodyStr = data.replace(/%5B\d+%5D/g, '');
                console.log(req.bodyStr);
	            next();
	        },
	        function (req, res) {
	            req.uest.post('/api/v2/invest/tender/MYSELF/loan/'+ req.body.loanId)
	                .type('form')
	                .send(req.bodyStr)
	                .end()
	                .then(function (r) {
                        res.json(r.body);
	                });
	        });
	});
	
    _.each({
        '/withdraw': '/withdraw',
    }, function (api, fe) {
        router.post(fe, ccBody,
            function (req, res, next) {
                req.body.userId = res.locals.user.id;
                var data = qs.stringify(req.body);
                req.body = data.replace(/%5B\d+%5D/g, '');
                next();
            },
            function (req, res) {
                console.log(req.body);
                req.uest.post('/api/v2/yeepay' + api + '/MYSELF')
                    .type('form')
                    .send(req.body)
                    .end()
                    .then(function (r) {
                        res.json(r.body);
                    });
            });
    });

	_.each({
	    '/deposit': '/deposit',
	    '/onlineBankDeposit' : '/onlineBankDeposit'
	}, function (api, fe) {
	    router.post(fe, ccBody, function (req, res, next) {
	        log.info({
	            type: 'yeepay'+fe+'/request',
	            req: req,
	            body: req.body
	        });
            req.body.retUrl = req.headers.host + '/yeepay/BankDepositReturn';
	        var data = qs.stringify(req.body);
	        req.body = data.replace(/%5B\d+%5D/g, '');
	        next();
	    }, function (req, res) {
	        req.uest.post('/api/v2/yeepay' + api + '/MYSELF')
	            .type("form")
	            .send(req.body)
	            .end()
	            .then(function (r) {
	                log.info({
	                    type: 'yeepay'+fe+'/post',
	                    req: req,
	                    body: r.body
	                });
//	                res.render('post', {
//	                    data: r.body
//	                });
                    res.redirect(r.body.message);
	            });
	    });
	});

    _.each({
        '/BankDepositReturn': '/BankDepositReturn',
        '/withdrawReturn': '/withdrawReturn'
    }, function (api, fe) {
        router.get(fe, function (req, res) {
            log.info({
                type: 'yeepay'+fe+'/request',
                req: req,
                body: req.body
            });
                req.uest.get('/api/v2/yeepay' + api)
                .send(req.query)
                .end()
                .then(function (r) {
                    log.info({
                        type: 'yeepay'+fe+'/return',
                        req: req,
                        body: r.body
                    });
                    var results = qs.stringify({
                        method: fe,
                        api: api,
                        body: r.body
                    });
                    res.redirect('/newAccount/recharge');
                });
            });
    });

};

