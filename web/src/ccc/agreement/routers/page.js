'use strict';
module.exports = function (router) {

    router.get('/:param', function (req, res, next) {
        var param = req.params.param;

        var tabMap = {
            regist: '用户注册协议',
            assignInvest: '债权转让协议',
            noviceInvest: '新手专享协议',
            employeeInvest: '员工专享协议',
            net: '网络交易资金存管协议'
        };

        if (!tabMap[param]) {
            return next();
        }

        res.locals.contents = req.uest('/api/v2/cms/category/DECLARATION/name/'+encodeURIComponent(tabMap[param])).end().get('body').then(function (r) {
            var contents= r.length > 0 ? r : null;
            return contents;
        });
        res.render('index');
    });



    router.get('/mobile/:param', function (req, res, next) {
        var param = req.params.param;
        console.log(req.query.key);
        res.locals.contents = req.uest('/api/v2/cms/category/DECLARATION/name/'+encodeURIComponent(req.query.key)).end().get('body').then(function (r) {
            var contents= r.length > 0 ? r : null;
            return contents;
        });
        res.render('mobile/' + param);
    });

};
