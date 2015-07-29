'use strict';

module.exports = function (hook) {

    hook.get('/aboutus/:tab', ['data', 'locals', 'params', 'redirect','res'], function (data, locals, params, redirect,res) {
        var cateMap = {
            aboutus: 'INTRODUCTION',
            background: 'INTRODUCTION',
            responsibility: 'INTRODUCTION',
            news: 'NEWS',
            announcement:'PUBLICATION',
            contactus: 'INTRODUCTION',
            help:'INTRODUCTION'
        };
        var nameMap = {
            aboutus: '奇乐融简介',
            background: '成立背景',
            responsibility: '社会责任',
            news: '行业新闻',
            announcement:'最新公告',
            contactus: '联系我们',
            help:'帮助中心',
            safety:'安全保障'
        }
        
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
            text: '新闻资讯',
            url: '/aboutus/news',
    },{
            text: '通知公告',
            url: '/aboutus/announcement',
    },{
            text: '联系我们',
            url: '/aboutus/contactus',
     },{ 
         
             text: '帮助中心',
            url: '/aboutus/help',
      },{ 
              text: '安全保障',
            url: '/aboutus/safety'
    }];
        var tabIndex;
        
        var loop =function() {
            for (var index = 0, length = tabs.length; index < length; index++) { 
            var tab = tabs[index];	 
            if (tab.text === nameMap[params.tab]) {	 
               tabIndex = index;	 
               break;	 
            } 
       }
        } 
        loop();
        
        if (nameMap[params.tab]) {
            _.assign(locals, {
                tabs: tabs,
                currentTab: nameMap[params.tab],
                tabIndex : tabIndex,
                tab: {
                    name: params.tab,
                    text: nameMap[params.tab]
                },
                contents: data.get('/api/v2/cms/category/'+cateMap[params.tab]+'/name/' + encodeURIComponent(nameMap[params.tab])).then(function (r) {
                   console.log(r);
                    var contents= r.length > 0 ? r : null;
                    return contents;
                })
            });

            return {
                view: 'aboutus/index',
                parseTemplateVars: false
            };
        }

    });
};
