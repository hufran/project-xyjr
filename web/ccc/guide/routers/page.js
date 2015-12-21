'use strict';
module.exports = function (router) {
router.get('/', function (req,res) {
    var user = res.locals.user;
    res.expose(user, 'user');
    res.locals.title = '新手指引_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
    res.locals.keywords = '如何投资理财|投新手指导|';
    res.locals.description = '奇乐融新手引导专为新投资人设立，教您如何在奇乐融平台进行投资理财。';
    res.render();
});
   
}
