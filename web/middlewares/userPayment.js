'use strict';

var _ = require('lodash-node');

exports.userPayment = function (req, res, next) {
    if (!res.locals.user) {
        return next();
    }

    req.uest.get('/api/v2/user/' + res.locals.user.id + '/payment')
        .end()
        .then(function (r) {
            var userPayment = r.body;
            _.assign(res.locals.user,userPayment);
            next();
        });
};