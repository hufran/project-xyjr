'use strict';
module.exports = function (router) {
    var pageSize = 10;

    router.get('/aboutus/:tab', function (req, res) {
        var cateMap = {
            aboutus: 'INTRODUCTION',
            background: 'INTRODUCTION',
            responsibility: 'INTRODUCTION',
            news: 'NEWS',
            announcement: 'PUBLICATION',
            contactus: 'CONTACT',
            contactus: 'CONTACT',
        };
        var nameMap = {
            aboutus: '奇乐融简介',
            background: '成立背景',
            responsibility: '社会责任',
            news: '行业新闻',
            announcement: '最新公告',
            contactus: '联系方式',
            safety: '安全保障',
            safety: '安全保障'
			
        };

        var indexMap = {
            aboutus: '奇乐融简介',
            background: '成立背景',
            responsibility: '社会责任',
            news: '行业新闻',
            announcement: '最新公告',
            contactus: '联系我们',
            safety: '安全保障',
            safety: '安全保障'
        };

        var tabs = [{
            text: '奇乐融简介',
            url: '/aboutus/aboutus'
        }, {
            text: '成立背景',
            url: '/aboutus/background'
        }, {
            text: '社会责任',
            url: '/aboutus/responsibility'
        }, {
            text: '行业新闻',
            url: '/aboutus/news',
        }, {
            text: '最新公告',
            url: '/aboutus/announcement',
        }, {
            text: '联系我们',
            url: '/aboutus/contactus',
        }, {
            text: '安全保障',
            url: '/aboutus/safety',
        }, {
            text: '安全保障',
            url: '/aboutus/safety'
        }];
        var tabIndex;

        // 计算当前页面的index
        var loop = function () {
            for (var index = 0, length = tabs.length; index < length; index++) {
                var tab = tabs[index];
                if (tab.text === indexMap[req.params.tab]) {
                    tabIndex = index;
                    break;
                }
            }
        };
        loop();


        req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab])).end().then(function (r) {
console.log(r.body);
            if (r.body.length > 1) {
				
                var current = (req.query.page === undefined) ? 1 : req.query.page;
                req.uest('/api/v2/cms/channel/' + r.body[0].channelId + '?page=' + current +
                        '&pagesize=10')
                    .end()
                    .then(function (r) {
                        formatNews(r.body.results);
                        var contents = r.body.results.length >
                            0 ? r.body.results : null;

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