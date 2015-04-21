'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/safe/index', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.render('safe/index', {
        title: '安全保障'
    });
});