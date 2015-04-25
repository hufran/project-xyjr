'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

router.get('/register*', function(req, res, next) {
    res.locals.CLEAN_PAGE = true;
    res.locals.titlePrefix = '注册';
    
    next();
});

/*
router.get('/register', function(req,res,next) {
    //res.locals.CLEAN_PAGE = true;
    res.locals.titlePrefix = '注册';
    next();
});
*/
