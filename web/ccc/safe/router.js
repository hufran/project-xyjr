'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/safe', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.locals.title = '投资理财安全保障，您的私人财富管家！';
    res.locals.description = '九信金融四重安全保障，实现企业融资和个人投资理财共赢：顶级私募立体风控系统 ；上市公司连带保证；优质金融资产担保；独立资金托管与技术安全。';
    res.render('safe/index');
});