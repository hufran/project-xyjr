'use strict';
module.exports = function (router) {
    var result = {
        'SUCCESSFUL' : '邮箱认证成功！',
        'UNSUCCESSFUL':'邮箱认证失败！',
        'EXPIRED':'邮箱认证链接已过期！',
        'AUTHENTICATED':'邮箱已认证,请不要重复认证！'
    };

    router.get('/register', function(req,res,next) {
        if ((req.query.e||'').match(/^\d+$/)) {
            res.locals.empReferral = req.query.e;
        }
        if (req.cookies.ccat) {
            res.redirect('/account/home');
        }
        next();
    });

    router.get('/register/renzheng', function (req, res, next) {
        res.locals.message = result[req.query.message] || '';
        next();
    });
}
