'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);
var moment = require('moment');
var pageSize = 10;

router.get('/cms/:channelName', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
    req.uest(
        '/api/v2/cms/channels')
        .end()
        .then(function (r) {
            var channels = r.body;
            var channelName = req.params.channelName;
            var channelId = '';
            var current = (req.query.page === undefined) ? 1 : req.query
                .page;
            for (var i = 0; i < channels.length; i++) {
                if (getChannelIdByName(channelName) === channels[i].name) {
                    channelId = channels[i].id;
                    break;
                }
            }
            req.uest(
                '/api/v2/cms/channel/' + channelId + '?page=' + current +
                '&pagesize=' + pageSize)
                .end()
                .then(function (r) {
                    res.render(channelName + '/list', {
                        title: getChannelIdByName(channelName),
                        news: formatNews(r.body.results),
                        totalPage: createList(Math.ceil(r.body.totalSize /
                            pageSize)),
                        channelName: getChannelIdByName(channelName),
                        current: parseInt(current, 10)
                    });
                });
        });
});

router.get('/cms/p/:id', function (req, res) {
    var user = res.locals.user;
    res.expose(user, "user");
   
    req.uest(
        '/api/v2/cms/article/' + req.params.id)
        .end()
        .then(function (r) {
         res.locals.title = r.body.title + '九信金融-国内首家PE系互联网金融平台';
            res.render('news/detail', {
                detail: formatDetail(r.body)
            });
        });
});

function getChannelIdByName(channel) {
    var channelMap = {
        news: '最新公告',
        medias: '媒体报道'
    };
    return channelMap[channel];
}


function formatNews(news) {
    for (var i = 0; i < news.length; i++) {
        news[i].pubDate = moment(news[i].pubDate)
            .format('YYYY-MM-DD');
    }
    return news;
}

function formatDetail(item) {
    item.pubDate = moment(item.pubDate)
        .format('YYYY/MM/DD');
    return item;
}

function createList(len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr[i] = i;
    }
    return arr;
}