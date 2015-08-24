'use strict';
module.exports = function (router) {
    router.get('/invest/list', function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }

        res.expose(user, 'user');
        res.locals.title = '奇乐融';
        res.locals.keywords = '个人投资理财，投资理财公司，理财产品排行';
        res.locals.description =
            '正奇金融！';
        var productKey = ['LTB', 'LXY', 'QT'];
        res.locals.products = [];
        req.uest('/api/v2/loan/getLoanProduct/productKey/' +
                productKey[0])
            .end()
            .then(function (r) {
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
