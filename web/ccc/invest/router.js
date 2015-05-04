'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/touzi/list', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.locals.title = '小额投资理财|个人投资理财|投资理财公司-九信金融';
    res.locals.keywords = '小额投资理财，个人投资理财，投资理财公司';
    res.locals.description = '九信金融投资理财平台免费为个人及企业提供银行、九鼎投资企业、上市公司、金融公司等机构的投资理财产品，低门槛、高收益、高安全。个人小额投资理财，就上九信金融！';
    res.render('invest/list');
});