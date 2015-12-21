'use strict';
module.exports = function (router) {
    var pageSize = 10;

    router.get('/aboutus/:tab', function (req, res) {

        var cateMap = {
            team: 'INTRODUCTION',
//            aboutus: 'INTRODUCTION',
            introduction: 'INTRODUCTION',
            recruitment: 'INTRODUCTION',
//            background: 'INTRODUCTION',
//            consultant: 'INTRODUCTION',
            partner: 'INTRODUCTION',
            safety: 'INTRODUCTION',
            // things: 'INTRODUCTION',
             contactus: 'INTRODUCTION',

            // manage:'PUBLICATION',
            // media:'COVERAGE',
            // action:'NEWS',
            // notice:'PUBLICATION'
        };
        var nameMap = {
            team: '团队介绍',
//            aboutus: '关于我们',
            introduction: '平台介绍',
            recruitment: '保障机构',
//            background: '平台背景',
//            consultant: '权威顾问',
            partner: '合作伙伴',
            // things: '大事记',
             safety: '安全保障',
             contactus: '联系我们',
             
            // action: '行业新闻',
            // media: '媒体报道',
            // notice: '最新公告',
            // manage: '经营报告'
        };

        var indexMap = {
              team: '团队介绍',
//            aboutus: '关于我们',
            introduction: '平台介绍',
            recruitment: '保障机构',
//            background: '平台背景',
//            consultant: '权威顾问',
            partner: '合作伙伴',
            // things: '大 事 记',
             safety: '安全保障',
             contactus: '联系我们',
            
            // action: '公司动态',
            // media: '媒体报道',
            // notice: '平台公告',
            // manage: '经营报告'
        };

        var tabs = [{
             text: ' 团队介绍',
             url: '/aboutus/team',
         }, {
            text: '平台介绍',
            url: '/aboutus/introduction'
         }, {
             text: '保障机构',
             url: '/aboutus/recruitment'
         }, {
            text: '合作伙伴',
            url: '/aboutus/partner',
         }, {
             text: '安全保障',
             url: '/aboutus/safety',
         }, {
             text: '联系我们',
             url: '/aboutus/contactus',
         },
//           {
        //     text: '公司动态',
        //     url: '/aboutus/action'
        // }, {
        //     text: '媒体报道',
        //     url: '/aboutus/media'
        // }, {
        //     text: '平台公告',
        //     url: '/aboutus/notice'
        // }, {
        //     text: '经营报告',
        //     url: '/aboutus/manage'
        // }
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
        
//        if(tab.text=='平台介绍'){
//    res.locals.description = '';}
//        else if(tab.text=='平台背景'){
//    res.locals.description = '';}
//        else if(tab.text=='权威顾问'){
//    res.locals.description = '';}
//    //     else if(tab.text=='团队介绍'){
//    // res.locals.description = '';}
//        else if(tab.text=='合作伙伴'){
//    res.locals.description = '';}
        // else{
        //  res.locals.description = '奇乐融经营报告为用户提供奇乐融最新运营数据信息。';};
               
         if(tab.text=='安全保障'){
             res.locals.keywords = '安全保障_718bank理财平台';
             res.locals.title = '投资风险、风险控制、风控、安全保障、投资安全、安全机制';
             res.locals.description = '718bank理财平台与各大投资公司的战略合作以及多年的风险控制经验使得投资理财有了安全保障，拥有成熟完善的安全保障机制。';
  }
//        else{
//             res.locals.keywords = '奇乐融'+tab.text;
//             res.locals.title = tab.text+'_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
//   };
 //        if (req.params.tab === 'action' || req.params.tab === 'media' || req.params.tab === 'notice' || req.params.tab === 'manage') {
 //            var isList = true;
 //        } else {
 //            var isList = false;
 //        };
//        console.log("success");
        req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab]) + '?sort' + 'PUBDATE').end().then(function (r) {
            if (r.body.length >= 1) {
                var current = (req.query.page === undefined) ? 1 : req.query.page;
                req.uest('/api/v2/cms/channel/' + r.body[0].channelId + '?page=' + current + '&pageSize='+ pageSize)
                    .end()
                    .then(function (r) {
                        formatNews(r.body.results);
                        var contents = r.body.results.length > 0 ? r.body.results : null;
                        res.render('aboutus/index', {
                            totalPage: createList(
                                Math
                                .ceil(r.body
                                    .totalSize /
                                    pageSize)),
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
                                text: indexMap[req.params.tab]
                            },
                            contents: contents,
                            // isList: isList
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
                        text: indexMap[
                            req.params
                            .tab]
                    },
                    contents: contents,
                    // isList: isList
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