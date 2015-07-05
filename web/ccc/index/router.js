'use strict';
module.exports = function (router) {
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.locals.title = '九信金融-国内首家PE系互联网金融平台｜P2P理财｜投资理财｜P2P网贷';
    res.locals.keywords = '互联网金融，P2P理财，P2P网贷，网络融资，投资理财，九信金融，九信金融官网';
    res.locals.description = '九信金融是九鼎投资（净资产超110亿元上市公司）旗下互联网金融平台，为您提供P2P理财、投资理财、P2P网贷等专业、安全、稳健产品。上市公司担保，本息全额保障，8年PE风控经验，第三方资金托管，是投资者首选的的P2P投资理财平台！';
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
            var data = parseCMStitle(data.slice(0,1));
            return data;
        });
    res.locals.latestPublication = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('最新公告'))
        .end()
        .get('body')
        .then( function(data) {
            //var data = parseCMStitle(data.slice(0,5));
            var data = data.slice(0,5);
            return data;
        });
            
    res.locals.latestNews = req.uest(
        '/api/v2/cms/category/COVERAGE/name/' + encodeURIComponent('媒体报道'))
        .end()
        .get('body')
        .then( function(data) {
            //var data = parseCMStitle(data.slice(0,5));
            var data = data.slice(0,5);
            return data;
        });
    // res.locals.friendsLinks = req.uest(
    //     '/api/v2/cms/category/LINK/name/' + encodeURIComponent('友情链接'))
    //     .end()
    //     .get('body');
    // res.locals.cooperation = req.uest(
    //     '/api/v2/cms/category/COOPERATION/name/' + encodeURIComponent('合作伙伴'))
    //     .end()
    //     .get('body');
    res.render({
        rushHeads: '<!--[if lt IE 10]><link rel="stylesheet" type="text/css" href="/ccc/index/css/ie-flip.css" /><![endif]-->'
    });
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
