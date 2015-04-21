/**
 * @file 首页数据交互逻辑
 * @author huip(hui.peng@creditcloud.com)
 */

'use strict';
var request = require('cc-superagent-promise');

exports.loanService = {
    getLoanProof: function(requestId,next) {
        request
            .get('/loan/'+ requestId + '/proof')
            .end()
            .then(function (res) {
                next(res.body);
            });
    }
};