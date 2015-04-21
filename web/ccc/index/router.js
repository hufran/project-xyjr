'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
router.get('/', function (req, res, next) {
    var user = res.locals.user;
    res.expose(user, "user");
    res.locals.carousel = req.uest(
        '/api/v2/cms/carousel_detail')
        .end()
        .get('body');

    // use lcoal first
//    res.locals.carousel = [{
//        img: '/ccc/index/img/carousel/001.jpg',
//        "bgc": "#e8f6f7",
//        "title": ""
//    }, {
//        img: '/ccc/index/img/carousel/002.jpg',
//        "bgc": "#071347",
//        "title": ""
//    }, {
//        img: '/ccc/index/img/carousel/003.jpg',
//        "bgc": "#96a7b1",
//        "title": ""
//    }];

    res.locals.latestPublication = req.uest(
            '/api/v2/cms/category/PUBLICATION/name/' +
            encodeURIComponent('最新公告'))
        .end()
        .get('body')
        .get(0);

    res.render({
        partners: require('./js/partners.json'),
        title: '首页',
        rushHeads: '<!--[if lt IE 10]><link rel="stylesheet" type="text/css" href="/ccc/index/css/ie-flip.css" /><![endif]-->'
    });
});
