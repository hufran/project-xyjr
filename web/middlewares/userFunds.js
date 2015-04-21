'use strict';

var _ = require('lodash-node');

exports.userFunds = function (req, res, next) {
    if (!res.locals.user) {
        return next();
    }

    req.uest.get('/api/v2/user/' + res.locals.user.id + '/userfund')
        .end()
        .then(function (r) {
            var userFund = r.body;
            _.assign(res.locals.user, userFund);
            next();
        });
};