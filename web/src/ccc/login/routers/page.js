'use strict';
module.exports = function (router) {
    router.get('/', function (req, res) {
        _.assign(res.locals, {
            title : '718_bank理财平台',
            keywords : '718_bank理财平台',
            description : '718_bank理财平台'
        });
        res.render();
    });
}
