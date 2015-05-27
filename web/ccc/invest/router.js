'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/touzi/list', function (req, res) {
    var user = res.locals.user;
    if (user && user.idNumber) {
        delete user.idNumber;
    }
    res.expose(user, 'user');
    res.locals.title = '个人投资理财|投资理财公司|理财产品排行-九信金融';
    res.locals.keywords = '个人投资理财，投资理财公司，理财产品排行';
    res.locals.description = '九信金融投资理财平台免费为个人及企业提供九鼎投资企业、上市公司等安全、稳健的投资理财产品和专业、多元的金融服务。个人投资理财，就上九信金融！';
    res.render('invest/list');
});
