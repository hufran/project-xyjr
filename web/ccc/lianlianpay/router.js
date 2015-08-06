'use strict';
module.exports = function (router) {
	var qs = require('qs');
	var ccBody = require('cc-body');
	var log = require('bunyan-hub-logger')({app: 'web', name: 'lianlianpay'});

	// post
	_.each({
	    '/bindCard': '/bindCard',
	    '/deposit' : '/deposit',
	    '/withdraw' : '/withdraw'
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
	                	console.log("##########");
	                	console.log(r.body);
	                     if (r.body.success) {
	                         var data = {
	                            success: r.body.success,
	                        };
	                         res.render('lianlianpay/return', {
	                             data: data
	                         });
	                     } 
	                });
	        });
	});
};