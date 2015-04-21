'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/invest/list', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.render('invest/list',{
        title: '投资列表'
    });
});