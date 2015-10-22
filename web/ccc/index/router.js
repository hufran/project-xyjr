'use strict';
module.exports = function (router) {
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.locals.title = '奇乐融_P2P网贷_P2P理财_联想控股成员企业';
    res.locals.keywords = '奇乐融|乐投宝|乐享盈|P2P网贷|P2P理财|网络理财|个人理财|投资理财|互联网金融|投资理财|';
    res.locals.description = '奇乐融(www.qilerong.com) - 联想控股成员企业--正奇金融旗下互联网金融战略平台，由安徽唯源金融信息服务有限公司运营。践行普惠金融，助力财富增值。奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';
    if (user && user.idNumber) {
        delete user.idNumber;
    }
    
    res.expose(user, 'user');
    res.locals.carousel = req.uest(
        '/api/v2/cms/carousel_detail')
        .end()
        .get('body');
    res.locals.latestOne = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('最新公告'))
        .end()
        .get('body')
        .then( function(data){
       
//            var data = parseCMStitle(data.slice(0,1));
            return data;
        });
    res.locals.latestPublication = req.uest(
        '/api/v2/cms/category/NEWS/name/' + encodeURIComponent('行业新闻'))
        .end()
        .get('body')
        .then( function(data) {
//            var data = parseCMStitle(data.slice(0,5));
//            var data = data.slice(0,5);
            return data;
        });
            
    res.locals.latestNews = req.uest(
        '/api/v2/cms/category/COVERAGE/name/' + encodeURIComponent('媒体报道'))
        .end()
        .get('body')
        .then( function(data) {
//            var data = parseCMStitle(data.slice(0,5));
//            var data = data.slice(0,5);
            return data;
        });
//     res.locals.friendsLinks = req.uest(
//         '/api/v2/cms/category/LINK/name/' + encodeURIComponent('友情链接'))
//         .end()
//         .get('body').then( function(data) {
//            return data;
//        });
     res.locals.cooperation = req.uest(
         '/api/v2/cms/category/COOPERATION/name/' + encodeURIComponent('合作伙伴'))
         .end()
         .get('body').then( function(data) {
            return data;
        });
    res.locals.userInfo = req.uest(
         '/api/v2/user/MYSELF/userinfo')
         .end()
         .get('body').then( function(data) {
        console.log(data);
            return data;
        });
    res.render({
        rushHeads: '<!--[if lt IE 10]><link rel="stylesheet" type="text/css" href="/ccc/index/css/ie-flip.css" /><![endif]-->'
    });
    var nowtime=new Date();
    var nowname='';
    if(nowtime.getHours()>=12&&nowtime.getHours()<18){
        nowname='下午';
    }else if(nowtime.getHours()>=5&&nowtime.getHours()<12){
        nowname='上午';
    }else{
       nowname='晚上'; 
    }
    
  res.locals.shangwuxiawu=nowname;
});

function parseCMStitle(data) {
    for (var i = 0; i < data.length; i++ ) {
        if(data[i].title.length >= 40) {
            data[i].title = data[i].title.substring(0,40) + "...";
        }
    }
    return data;
}
   
}
