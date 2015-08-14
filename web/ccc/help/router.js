'use strict';
module.exports = function (router) {
    var pageSize = 10;
    router.get('/help/:tab', function (req, res) {
            var cateMap = {
                aboutus: 'HELP',
                product: 'HELP',
                safety: 'HELP',
                login: 'HELP',
                money: 'HELP',
                explain: 'HELP',
                law: 'HELP'
            };

            var nameMap = {
                aboutus: '关于奇乐融',
                product: '产品介绍',
                safety: '风控安全',
                login: '注册/登陆',
                money: '投资理财',
                explain: '名词解释',
                law: '法律安全'
            };

            var indexMap = {
                aboutus: '关于奇乐融',
                product: '产品介绍',
                safety: '风控安全',
                login: '注册/登陆',
                money: '投资理财',
                explain: '名词解释',
                law: '法律安全'
            };

            var tabs = [{
                text: '关于奇乐融',
                url: '/help/aboutus'
        }, {
                text: '产品介绍',
                url: '/help/product'
        }, {
                text: '风控安全',
                url: '/help/safety'
        }, {
                text: '注册/登陆',
                url: '/help/login',
        }, {
                text: '投资理财',
                url: '/help/money',
        }, {
                text: '名词解释',
                url: '/help/explain',
        }, {
                text: '法律安全',
                url: '/help/law'
        }];

            var tabIndex;
            for (var index = 0, length = tabs.length; index < length; index++) {
                var tab = tabs[index];
                if (tab.text === indexMap[req.params.tab]) {
                    tabIndex = index;
                    break;
                }
            }

            req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab])).end().then(function (r) {
                if (r.body.length > 1) {
                    var current = (req.query.page === undefined) ? 1 : req.query.page;
                    req.uest('/api/v2/cms/channel/' + r.body[0].channelId + '?page=' + current + '&pagesize=10').end()
                        .then(function (r) {
                            formatNews(r.body.results);
                            var contents = r.body.results.length >
                                0 ? r.body.results : null;

                            res.render('help/index', {
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
                    res.render('help/index', {
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