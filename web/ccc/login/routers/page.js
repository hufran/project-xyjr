'use strict';
module.exports = function (router) {
    router.get('/', function (req, res) {
        _.assign(res.locals, {
            title : '国美金融',
            keywords : '国美金融',
            description : '国美金融'
        });
        res.render();
    });
}
