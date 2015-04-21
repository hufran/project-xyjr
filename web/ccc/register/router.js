'use strict';
var router = module.exports = require('express')
    .Router();
var config = require('config');

//router.get('/register/invitation', function (req, res) {
//    var checkUrl = config.urlInvitation;
//    if (req.query.code) {
//        var reqUrl = req.url;
//        var queryParams = reqUrl.substring(reqUrl.indexOf('?') + 1, reqUrl.length);
//        req.uest(checkUrl + '&' + queryParams)
//            .end()
//            .then(function (r) {
//                r = JSON.parse(r.text);
//                if (r.checkresult !== 1) {
//                    res.json({
//                        success: false,
//                        message: 'INVITATION_INVALID'
//                    });
//                } else {
//                    res.json({
//                        success: true,
//                        message: null
//                    });
//                }
//            });
//    } else {
//        res.json({
//            success: false,
//            message: 'INVITATION_NULL'
//        });
//    }
//});