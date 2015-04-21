'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/company/hanhua', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.render('company/hanhua', {
        title: '瀚华担保简介'
    });
});