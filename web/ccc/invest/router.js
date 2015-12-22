'use strict';
module.exports = function (router) {
    router.get('/invest', function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }

        res.expose(user, 'user');
        res.locals.title = '理财产品_718bank理财平台';
        res.locals.keywords = '网络投资|P2P理财|个人理财|奇乐融投资理财|';
        res.locals.description =
<<<<<<< HEAD
            '718bank理财平台为您提供了多种理财产品，每种理财产品都有不同的特点，满足您的投资需求。理财产品有：新手专享、活动专享、新能宝等。';
        var productKey = ['LTB', 'LXY', 'QT'];
=======
            '奇乐融投资理财提供优质的P2P网贷投资理财项目。投资理财用户通过奇乐融平台进行投标、理财计划等方式进行投资获得高收益。';
        var productKey = ['XSZX', 'HDZX', 'LCZQ'];
>>>>>>> 142f78cb3fa6dd8e5e9d391ef6d6e83cc8c69f3f
        res.locals.products = [];
        req.uest('/api/v2/loan/getLoanProduct/productKey/' +
                productKey[0])
            .end()
            .then(function (r) {
                console.log("r.body======");
                console.log(r.body);
                res.locals.products.push(r.body);
                req.uest(
                        '/api/v2/loan/getLoanProduct/productKey/' +
                        productKey[1])
                    .end()
                    .then(function (r) {
                        console.log(r.body);
                        res.locals.products.push(r.body);
                        req.uest(
                                '/api/v2/loan/getLoanProduct/productKey/' +
                                productKey[2])
                            .end()
                            .then(function (r) {
                                console.log(r.body);
                                res.locals.products.push(
                                    r.body);
                                res.render(
                                    'invest/list');
                            });
                    });
            });
    });
}
