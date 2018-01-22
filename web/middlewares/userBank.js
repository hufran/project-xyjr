'use strict';

var _ = require('lodash-node');

exports.userBank = function (req, res, next) {
    if (!res.locals.user) {
        return next();
    }

    req.uest.get('/api/v2/user/MYSELF/fundaccounts')
        .end()
        .then(function (r) {
            var userBank = r.body[0];
            _.assign(res.locals.user,userBank);
            next();
        });
};