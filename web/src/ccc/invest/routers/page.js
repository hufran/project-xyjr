'use strict';
module.exports = function (router) {
    router.get('/', async function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }
        res.expose(user, 'user');
        res.locals.title = '理财产品_718金融理财平台';
        res.locals.keywords = '理财产品、投资、理财投资、个人理财、理财新品、新能宝、活动专享、新手专享';
        res.locals.description =
            '718金融理财平台为您提供了多种理财产品，每种理财产品都有不同的特点，满足您的投资需求。理财产品有：新手专享、活动专享、新能宝等。';
        req.uest('/api/v2/navigation/listDisplayProductForPc/pc')
            .then(function (data){
                var productKey=[];
                res.locals.products =[];
                res.locals.products.push(data.body[0]);
                res.locals.products.push(data.body[1]);
                res.locals.products.push(data.body[2]);
                res.expose('', 'product');
                res.render();
                return false;
            })
    });
router.get('/:product', async function (req, res) {
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }
        res.expose(user, 'user');
        res.locals.title = '理财产品_718bank理财平台';
        res.locals.keywords = '网络投资|P2P理财|个人理财|718bank投资理财|';
        res.locals.description =
            '718bank理财平台为您提供了多种理财产品，每种理财产品都有不同的特点，满足您的投资需求。理财产品有：新手专享、活动专享、新能宝等。';
        req.uest('/api/v2/navigation/listDisplayProductForPc/pc')
            .then(function(data){
                res.locals.products=data.body;
                res.expose(req.params.product, 'product')
                res.render('index');
                return false;
            })
    });
}
