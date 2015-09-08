'use strict';
module.exports = function (router) {
    var pageSize = 10;

    router.get('/aboutus/:tab', function (req, res) {
        var cateMap = {
            aboutus: 'INTRODUCTION',
            background: 'INTRODUCTION',
            team: 'INTRODUCTION',
            partner: 'INTRODUCTION',
            things: 'INTRODUCTION',
            contactus: 'INTRODUCTION',
            recruitment: 'INTRODUCTION',
            manage:'PUBLICATION',
            media:'COVERAGE',
            action:'NEWS',
            notice:'PUBLICATION'
        };
        var nameMap = {
            aboutus: '平台简介',
            background: '股东背景',
            team: '团队介绍',
            partner: '合作机构',
            things: '大事记',
            safety: '安全保障',
            contactus: '联系我们',
            recruitment: '招贤纳士',
            action: '行业新闻',
            media: '媒体报道',
            notice: '最新公告',
            manage: '经营报告'
        };

        var indexMap = {
            aboutus: '奇乐融简介',
            background: '股东背景',
            team: '团队介绍',
            partner: '合作机构',
            things: '大事记',
            safety: '安全保障',
            contactus: '联系我们',
            recruitment: '招贤纳士',
            action: '公司动态',
            media: '媒体报道',
            notice: '平台公告',
            manage: '经营报告'
        };

        var tabs = [{
            text: '平台简介',
            url: '/aboutus/aboutus'
        }, {
            text: '股东背景',
            url: '/aboutus/background'
        }, {
            text: '团队介绍',
            url: '/aboutus/team'
        }, {
            text: '合作机构',
            url: '/aboutus/partner',
        }, {
            text: '大 事 记',
            url: '/aboutus/things',
        }, {
            text: '安全保障',
            url: '/aboutus/safety',
        }, {
            text: '联系我们',
            url: '/aboutus/contactus',
        }, {
            text: '招贤纳士',
            url: '/aboutus/recruitment'
        }, {
            text: '公司动态',
            url: '/aboutus/action'
        }, {
            text: '媒体报道',
            url: '/aboutus/media'
        }, {
            text: '平台公告',
            url: '/aboutus/notice'
        }, {
            text: '经营报告',
            url: '/aboutus/manage'
        }];
        var tabIndex;
        for (var index = 0, length = tabs.length; index < length; index++) {
            var tab = tabs[index];
            if (tab.text === indexMap[req.params.tab]) {
                tabIndex = index;
                break;
            }
        }

        console.log("success");
        req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab]) + '?sort' + 'PUBDATE').end().then(function (r) {
            if (r.body.length > 1) {
                var current = (req.query.page === undefined) ? 1 : req.query.page;
                req.uest('/api/v2/cms/channel/' + r.body[0].channelId + '?page=' + current + '&pageSize=10')
                    .end()
                    .then(function (r) {
                        formatNews(r.body.results);
                        var contents = r.body.results.length > 0 ? r.body.results : null;

                        res.render('aboutus/index', {
                            totalPage: createList(
                                Math
                                .ceil(r.body
                                    .totalSize /
                                    10)),
                            current: parseInt(
                                current,
                                10),
                            tabs: tabs,
                            currentTab: nameMap[
                                req.params.tab
                                ],
                            tabIndex: tabIndex,
                            tab: {
                                name: req.params
                                    .tab,
                                text: nameMap[
                                    req.params
                                    .tab]
                            },
                            contents: contents
                        });
                    });


            } else {

                formatNews(r);
                var contents = r.body.length >
                    0 ? r.body : null;
                res.render('aboutus/index', {
                    tabs: tabs,
                    currentTab: nameMap[
                        req.params.tab
                        ],
                    tabIndex: tabIndex,
                    tab: {
                        name: req.params
                            .tab,
                        text: nameMap[
                            req.params
                            .tab]
                    },
                    contents: contents
                });
            }
        });


    });


    function formatNews(news) {
        news = news || [];
        for (var i = 0; i < news.length; i++) {
            news[i].pubDate = moment(news[i].pubDate)
                .format('YYYY-MM-DD');
        }
        //                        console.log(news);
        return news;
    }


    function createList(len) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr[i] = i;
        }
        return arr;
    }


};