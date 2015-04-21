'use strict';
var router = module.exports = require('express').Router();
var crypto = require('crypto');
var config = require('config');
router.get('/verify/loan', function (req, res) {
    var code = req.query.code;
    var verifySystemCode = config.verifySystemCode;
    var verifySystemMd5key = config.verifySystemMd5key;
    var d = new Date();
    var current = Math.round(d.getTime() / 1000) + 300;
    var mac = crypto.createHash('md5').update(verifySystemMd5key+"&"+verifySystemCode+"&"+code+"&"+current).digest('hex')+current;
    var loanVerifyUrl = config.urlLoanVerify+"?from="+verifySystemCode+"&id="+code+"&mac="+mac;
    res.redirect(loanVerifyUrl);
});