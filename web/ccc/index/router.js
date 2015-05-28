'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.locals.title = '九信金融-国内首家PE系互联网金融平台｜P2P理财｜投资理财｜P2P网贷';
    res.locals.keywords = '互联网金融，P2P理财，P2P网贷，网络融资，投资理财，九信金融，九信金融官网';
    res.locals.description = '九信金融由国内知名投资机构九鼎投资倾力打造，是国内首家私募系互联网金融平台。平台由九信投资管理有限公司（www.jiuxinfinance.com）运营，注册资金20亿元人民币。九鼎投资是第一家登陆国内资本市场的私募股权机构，为“中国PE第一股”，净资产超100亿元。';
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
