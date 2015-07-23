'use strict';
module.exports = function (hook) {

    hook.get('/aboutus/:tab', ['data', 'locals', 'params', 'redirect'], function (data, locals, params, redirect) {
        var cateMap = {
            aboutus: '公司简介',
            partner: '公司简介',
            job: '公司简介',
            contactus: '公司简介',
            recruit:'公司简介'
        };
        var nameMap = {
            aboutus: '有色金融',
            job: '联系我们',
            contactus: '合作伙伴',
            partner: '股东背景',
            recruit:'诚聘英才',
            safety: '安全保障'
        }
        
         var tabs = [{
            text: '有色金融',
            url: '/aboutus/aboutus'
    }, {
            text: '股东背景',
            url: '/aboutus/partner'
    }, {
            text: '联系我们',
            url: '/aboutus/job'
    }, {
            text: '合作伙伴',
            url: '/aboutus/contactus',
    },{
            text: '诚聘英才',
            url: '/aboutus/recruit',
    },{
            text: '安全保障',
            url: '/aboutus/safety',
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
                contents: data.articles(cateMap[params.tab], nameMap[params.tab]).then(function (r) {
                    var contents= r.length > 0 ? r[0].content : null;console.log(contents);console.log(r)
                    return contents
                })
            });

            return {
                view: 'aboutus/index',
                parseTemplateVars: false
            };
        }

    });
};
