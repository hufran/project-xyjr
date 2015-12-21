'use strict';
module.exports = function (router) {
    router.get('/invest', function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }

        res.expose(user, 'user');
        res.locals.title = '我要投资_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
        res.locals.keywords = '网络投资|P2P理财|个人理财|奇乐融投资理财|';
        res.locals.description =
            '奇乐融投资理财提供优质的P2P网贷投资理财项目。投资理财用户通过奇乐融平台进行投标、理财计划等方式进行投资获得高收益。';
        var productKey = ['XSZX', 'HDZX', 'LCZQ'];
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
