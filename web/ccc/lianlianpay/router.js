'use strict';
module.exports = function (router) {
    var qs = require('qs');
    var ccBody = require('cc-body');
    var log = require('bunyan-hub-logger')({app: 'web', name: 'lianlianpay'});
    var config = require('config');
    // post绑卡单独处理
    _.each({
        '/bindCard': '/bindCard',
        '/withdraw': '/withdraw',
        '/deleteCard': '/deleteCard'
    }, function (api, fe) {
        router.post('/lianlianpay' + fe, ccBody,
            function (req, res, next) {
                req.body.userId = res.locals.user.id;
                var data = qs.stringify(req.body);
                req.body = data.replace(/%5B\d+%5D/g, '');
                next();
            },
            function (req, res) {
                req.uest.post('/api/v2/lianlianpay' + api + '/MYSELF')
                    .type('form')
                    .send(req.body)
                    .end()
                    .then(function (r) {
                        console.log(r.body);
                        console.log("#############");
                        if (r.body.success) {
                            var data = {
                                success: r.body.success,
                            };
                            res.render('lianlianpay/return', {
                                data: data
                            });
                        } else {
                            res.render('lianlianpay/return', {
                                data: r.body
                            });
                        }
                    });
            });
    });


	_.each({
	    '/tender': '/tender'
	}, function (api, fe) {
	    router.post('/lianlianpay' + fe, ccBody,
	        function (req, res, next) {
	            req.body.userId = res.locals.user.id;
	            var data = qs.stringify(req.body);
	            req.body = data.replace(/%5B\d+%5D/g, '');
	            next();
	        },
	        function (req, res) {
			
				console.log("*******************************");
				console.log(api);
				console.log("*******************************");
				
	            req.uest.post('/api/v2/invest' + api + '/MYSELF')
	                .type('form')
	                .send(req.body)
	                .end()
	                .then(function (r) {
	                    if (r.body.success) {
                        	var data = {
                            	success: r.body.success,
                        	};
                        	res.render('lianlianpay/return', {
                            	data: data
                         	});
	                    } else {
	                    	res.render('lianlianpay/return', {
                            	data: r.body
                         	});
	                    }
	                });
	        });
	});
	
	_.each({
	    '/deposit': '/deposit',
	    '/onlineBankDeposit' : '/onlineBankDeposit'
	}, function (api, fe) {
	    router.post('/lianlianpay' + fe, ccBody, function (req, res, next) {
	        log.info({
	            type: 'lianlianpay'+fe+'/request',
	            req: req,
	            body: req.body
	        });
	        // req.body.retUrl = (req.connection.encrypted ? 'https://' : 'http://') + req.headers.host;
	        var data = qs.stringify(req.body);
	        req.body = data.replace(/%5B\d+%5D/g, '');
	        next();
	    }, function (req, res) {
	        req.uest.post('/api/v2/lianlianpay' + api + '/MYSELF')
	            .type("form")
	            .send(req.body)
	            .end()
	            .then(function (r) {
	                log.info({
	                    type: 'lianlianpay'+fe+'/post',
	                    req: req,
	                    body: r.body
	                });
	                var emsg;
	                try {
	                    emsg = r.body.error[0].message;
	                } catch(e){}
	                if (emsg ==='WITHDRAW_EXCEED_LIMIT') {
	                    return res.render('payment/return', {
	                        customText: '您今日申请提现次数过多，请明天再试。',
	                        data: r.body
	                    });
	                }
	                res.render('lianlianpay/post', {
	                    data: r.body
	                });
	            });
	    });
	});

    

    // _.each({
    //     '/withdrawReturn': '/withdrawReturn',
    //     '/depositReturn': '/depositReturn',
    // }, function (api, fe) {
    //     router.get('/lianlianpay' + fe,
    //         function (req, res) {
    //             log.info({
    //                 type: 'lianlianpay'+fe + '/request',
    //                 req: req,
    //             });
    //             req.uest.get('/api/v2' + req.url)
    //                 .end()
    //                 .then(function (r) {
    //                     log.info({
    //                         type: 'lianlianpay'+fe+'/result',
    //                         req: req,
    //                         body: r.body
    //                     });
    //                     res.render('lianlianpay/return', {
    //                         data: r.body
    //                     });
    //                 });
    //         });
    // });

};