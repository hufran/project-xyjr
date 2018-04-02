'use strict';
module.exports = function(router) {

    var ccBody = require('cc-body');
    router.get('/jieApp', function(req, res) {
        res.render('app/jieApp', {
            title: '新毅金融'
        });
    });
}
