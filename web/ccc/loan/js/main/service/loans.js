/**
 * @file 首页数据交互逻辑
 * @author huip(hui.peng@creditcloud.com)
 */

'use strict';

exports.loanService = {
    getLoanProof: function(userId,next) {
        request
            .get('/api/v2/user/'+ userId + '/certificates/proofs')
            .end()
            .then(function (res) {
                next(res.body);
            });
    }
};
