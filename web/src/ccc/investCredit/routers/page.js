'use strict';
module.exports = function (router) {
    router.get('/', function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }

        res.expose(user, 'user');
        res.locals.title = 'P2P投资产品_718金融平台';
        res.locals.keywords = '网络投资|P2P投资|个人投资|奇乐融P2P投资|';
        res.locals.description =
            '718金融平台为您提供了多种P2P投资产品，每种理P2P投资产品都有不同的特点，满足您的投资需求。P2P投资产品有：新手专享、活动专享、新能宝等。';

//        var productKey = ['XSZX', 'HDZX', 'LCZQ'];
//        res.locals.products = [];
//        req.uest('/api/v2/loan/getLoanProduct/productKey/' +
//                productKey[0])
//            .end()
//            .then(function (r) {
//                console.log("r.body======");
//                console.log(r.body);
//                res.locals.products.push(r.body);
//                req.uest(
//                        '/api/v2/loan/getLoanProduct/productKey/' +
//                        productKey[1])
//                    .end()
//                    .then(function (r) {
//                        console.log(r.body);
//                        res.locals.products.push(r.body);
//                        req.uest(
//                                '/api/v2/loan/getLoanProduct/productKey/' +
//                                productKey[2])
//                            .end()
//                            .then(function (r) {
//                                console.log(r.body);
//                                res.locals.products.push(
//                                    r.body);
//                                res.render(
//                                    'invest/list');
//                            });
//                    });
//            });
        res.render();
    });
}
