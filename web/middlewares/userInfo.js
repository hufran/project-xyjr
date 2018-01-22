'use strict';

var _ = require('lodash-node');

exports.userInfo = function (req, res, next) {

    if (!req.cookies.ccat) {
        return next();
    }

    req.uest.get('/api/v2/whoami')
        .end()
        .then(function (r) {
            var user = r.body.user;
            if (user) {
                user.logined = true;

                res.locals.user = res.locals.user || {};
                _.assign(res.locals.user, user);
            }
            next();
        });
};