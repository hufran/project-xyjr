'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.locals.title = '九信金融';
    res.expose(user, "user");
    res.locals.carousel = req.uest(
        '/api/v2/cms/carousel_detail')
        .end()
        .get('body');
    res.locals.latestPublication = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('最新公告'))
        .end()
        .get('body')
        .then( function(data) {
            var data = parseCMStitle(data.slice(0,5));
            return data;
        });
    res.locals.latestOne = req.uest(
        '/api/v2/cms/category/PUBLICATION/name/' + encodeURIComponent('最新公告'))
        .end()
        .get('body')
        .then( function(data){
            console.log(data);
            var data = parseCMStitle(data.slice(0,1));
            return data;
        });
            
    res.locals.latestNews = req.uest(
        '/api/v2/cms/category/COVERAGE/name/' + encodeURIComponent('媒体报道'))
        .end()
        .get('body')
        .then( function(data) {
            var data = parseCMStitle(data.slice(0,5));
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
        if(data[i].title.length >= 20) {
            data[i].title = data[i].title.substring(0,20) + "...";
        }
    }
    return data;
}