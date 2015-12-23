'use strict';
module.exports = function (router) {
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.locals.title = '首页_718bank理财平台';
    res.locals.keywords = '理财、投资、财富、理财投资、个人理财、理财产品、理财平台、金融理财、个人投资、普惠金融';
    res.locals.description = '718bank理财平台是新毅网络旗下，致力于为投资者提供专业、绿色、智能、透明、安全的理财服务，是新型的互联网理财服务交易平台。';
    if (user && user.idNumber) {
        delete user.idNumber;
    }
    
    res.expose(user, 'user');
    res.locals.carousel = req.uest(
        '/api/v2/cms/carousel_detail')
        .end()
        .get('body');
    
    res.locals.latestOne = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('平台公告'))
        .end()
        .get('body')
        .then( function(data){
       
//            var data = parseCMStitle(data.slice(0,1));
            return data;
        });
    res.locals.expireOne = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('到期公告'))
        .end()
        .get('body')
        .then( function(data){
       
//            var data = parseCMStitle(data.slice(0,1));
            return data;
        });
    res.locals.latestPublication = req.uest(
        '/api/v2/cms/category/NEWS/name/' + encodeURIComponent('新闻资讯'))
        .end()
        .get('body')
        .then( function(data) {
//            var data = parseCMStitle(data.slice(0,5));
//            var data = data.slice(0,5);
            return data;
        });
        res.locals.latestImgPublication = req.uest(
        '/api/v2/cms/category/NEWS/name/' + encodeURIComponent('图片新闻资讯'))
        .end()
        .get('body')
        .then( function(data) {
            console.log('====',data);
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
