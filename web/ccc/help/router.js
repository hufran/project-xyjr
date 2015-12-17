'use strict';
module.exports = function (router) {
    var pageSize = 10;
    router.get('/help/:tab', function (req, res) {
        var cateMap = {
            invest: 'HELP'
            // aboutus: 'HELP',
            // product: 'HELP',
            // safety: 'HELP',
            // login: 'HELP',
            // money: 'HELP',
            // explain: 'HELP',
            // law:'HELP',
            // cash:'HELP',
            //  member:'HELP'

        };
        var nameMap = {
            invest: '我要投资'
            // aboutus: '关于奇乐融',
            // product: '产品介绍',
            // safety: '风控安全',
            // login: '注册/登录',
            // money: '投资理财',
            // explain: '名词解释',
            // law: '法律安全',
            // cash:'充值/提现',
            // member:'会员/积分'
        };
        
            var indexMap={
                invest: '我要投资'
            // aboutus: '关于奇乐融',
            // product: '产品介绍',
            // safety: '风控安全',
            // login: '注册/登录',
            // money:'投资理财',
            // explain: '名词解释',
            // law:'法律安全',
            //     cash:'充值/提现',
            //     member:'会员/积分'
        };

        var tabs = [{
             text: '我要投资',
             url: '/help/invest'
         }
        ];

            var tabIndex;
            for (var index = 0, length = tabs.length; index < length; index++) {
                var tab = tabs[index];
                if (tab.text === indexMap[req.params.tab]) {
                    tabIndex = index;
                    break;
                }
            }
        
           var user = res.locals.user;
        // if(tab.text=='关于奇乐融'){
        //     res.locals.title='帮助中心_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
        //     res.locals.keywords='奇乐融帮助中心';
        //     res.locals.description = '奇乐融帮助中心为您解答各种操作问题，提供p2p投资,网络投资,贷款咨询服务';
        // }else{
        //     res.locals.title=tab.text+'_帮助中心_奇乐融';
        //     res.locals.keywords=tab.text;
        //     res.locals.description = '奇乐融帮助中心为您解答各种操作问题，提供p2p投资,网络投资,贷款咨询服务';
        // }
        
        
        
        

            req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab])).end().then(function (r) {
                if (r.body.length > 1) {
                    var current = (req.query.page === undefined) ? 1 : req.query.page;
                    req.uest('/api/v2/cms/channel/' + r.body[0].channelId + '?page=' + current + '&pagesize=10').end()
                        .then(function (r) {
                        console.log('=======',nameMap[req.param.tab]);
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
