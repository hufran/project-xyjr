'use strict';
module.exports = function (router) {
router.get('/activity', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '正奇金融进军P2P_奇乐融_联想控股成员企业_正奇金融旗下互联网金融战略平台';
    res.render('activity');
});
    router.get('/activity/special', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '产品说明_奇乐融_联想控股成员企业_正奇金融旗下互联网金融战略平台';
    res.render('activity/special');
});
       router.get('/activity/gift', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '三重好礼_奇乐融_联想控股成员企业_正奇金融旗下互联网金融战略平台';
    res.render('activity/gift');
});
           router.get('/activity/single', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '双11活动_奇乐融_联想控股成员企业_正奇金融旗下互联网金融战略平台';
    res.render('activity/single');
});
    
}
