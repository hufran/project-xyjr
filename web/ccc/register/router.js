'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/register*', function(req, res, next) {
    res.locals.CLEAN_PAGE = true;
    res.locals.titlePrefix = '注册';
    res.locals.title = '用户注册|九信金融-国内首家PE系互联网金融平台';
    next();
});

/*
router.get('/register', function(req,res,next) {
    //res.locals.CLEAN_PAGE = true;
    res.locals.titlePrefix = '注册';
    next();
});
*/
