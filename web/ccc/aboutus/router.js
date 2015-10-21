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
            recruitment: '保障机构',
            action: '行业新闻',
            media: '媒体报道',
            notice: '最新公告',
            manage: '经营报告'
        };

        var indexMap = {
            aboutus: '平台简介',
            background: '股东背景',
            team: '团队介绍',
            partner: '合作伙伴',
            things: '大 事 记',
            safety: '安全保障',
            contactus: '联系我们',
            recruitment: '保障机构',
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
            text: '合作伙伴',
            url: '/aboutus/partner',
        }, {
            text: '大 事 记',
            url: '/aboutus/things',
        }, {
            text: '安全保障',
            url: '/aboutus/safety',
        }, {
            text: '保障机构',
            url: '/aboutus/recruitment'
        }, {
            text: '联系我们',
            url: '/aboutus/contactus',
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
             console.log('=======');
            console.log(tab);
            if (tab.text === indexMap[req.params.tab]) {
                console.log('=======');
                console.log(tab);
                tabIndex = index;
                 console.log(tabIndex);
                break;
            }
        }
                    var user = res.locals.user;
        
        if(tab.text=='平台简介'){
    res.locals.description = '奇乐融是联想控股成员企业--正奇金融旗下互联网金融战略平台，奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';}
        else if(tab.text=='股东背景'){
    res.locals.description = '奇乐融是联想控股成员企业--正奇金融旗下互联网金融战略平台';}
        else if(tab.text=='团队介绍'){
    res.locals.description = '奇乐融依托正奇金融强大的专业团队，高标准和高要求选拔标杆人才，注重企业文化和经验传承，倾力打造一支专业化程度高、责任心强的互联网金融专业人才团队。';}
        else if(tab.text=='合作伙伴'){
    res.locals.description = '奇乐融先后与兴业银行、中国科学技术大学、招商银行、大成律师事务所、连连支付、CFCA、普华永道、云信、通联支付、宇信科技达成战略合作';}
        else if(tab.text=='大事记'){
    res.locals.description = '奇乐融(http://www.qilerong.com/) - 联想控股成员企业--正奇金融旗下互联网金融战略平台，由安徽唯源金融信息服务有限公司运营。践行普惠金融，助力财富增值。奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';}
        else if(tab.text=='安全保障'){
    res.locals.description = '奇乐融精挑类金融机构（小贷、担保、租赁、典当、保理等）或实力企业作为保障机构，细选保障机构推荐的项目';}
        else if(tab.text=='保障机构'){
    res.locals.description = '优质保障机构正奇租赁、创新担保、国正小贷、增益供应链、金丰典当齐聚奇乐融';}
        else if(tab.text=='联系我们'){
    res.locals.description = '奇乐融(http://www.qilerong.com/) - 联想控股成员企业--正奇金融旗下互联网金融战略平台，由安徽唯源金融信息服务有限公司运营。践行普惠金融，助力财富增值。奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';}
        else if(tab.text=='公司动态'){
    res.locals.description = '奇乐融公司动态栏目为用户提供最新的奇乐融公司动态等信息。';}
        else if(tab.text=='媒体报道'){
    res.locals.description = '奇乐融媒体报道栏目为用户提供最新的奇乐融媒体报道、平台新闻等信息。';}
        else if(tab.text=='平台公告'){
    res.locals.description = '奇乐融平台公告为用户提供奇乐融最新动态及站内公告信息。';}
        else{
         res.locals.description = '奇乐融经营报告为用户提供奇乐融最新运营数据信息。';};
               
        if(tab.text=='平台简介'){
            res.locals.keywords = '奇乐融投资理财|P2P网贷理财|互联网金融|';
            res.locals.title = '关于我们_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
 }else{
            res.locals.keywords = '奇乐融'+tab.text;
            res.locals.title = tab.text+'_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
  };
        if (req.params.tab === 'action' || req.params.tab === 'media' || req.params.tab === 'notice' || req.params.tab === 'manage') {
            var isList = true;
        } else {
            var isList = false;
        };
        console.log("success");
        req.uest('/api/v2/cms/category/' + cateMap[req.params.tab] + '/name/' + encodeURIComponent(nameMap[req.params.tab]) + '?sort' + 'PUBDATE').end().then(function (r) {
            if (r.body.length > 1) {
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
                                text: indexMap[
                                    req.params
                                    .tab]
                            },
                            contents: contents,
                            isList: isList
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
                    isList: isList
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