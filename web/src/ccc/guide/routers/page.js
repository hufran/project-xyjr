'use strict';
module.exports = function (router) {
router.get('/', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '新手引导_718金融平台';
    res.locals.keywords = '投资指南、新手引导、新手必读、用户须知、新手帮助';
    res.locals.description = '718金融平台针对新注册用户给予更高的收益和奖券激励。';
    res.render();
});

}
