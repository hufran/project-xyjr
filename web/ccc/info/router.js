'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

//实现列表左侧切换
router.get(/^\/info/, function (req, res, next) {    
    // 定位tab
    var tabs = [{
        text: '九信金融',
        url: '/info/index'
    }, {
        text: '集团背景',
        url: '/info/group' 
    }, {
        text: '联系我们',
        url: '/info/contactus'
    }, 
    // {
    //     text: '相关政策',
    //     url: '/info/policy'
    // }, {
    //     text: '加入我们',
    //     url: '/info/recruit'       
    // }

    ];

    var path = req.path.replace(/\/$/, '');
    var tabIndex;

    for (var index = 0, length = tabs.length; index < length; index++) {
        var tab = tabs[index];
        if (tab.url === path) {
            tabIndex = index;
            break;
        }        
    }
    
    // default to /info/index
    tabIndex = tabIndex || 0;
    
    // decide title
    // res.locals.title = tabs[tabIndex].text;
    res.locals.title = "关于我们-九信金融，您的私人财富管家！";
    res.locals.description = '九信金融是国内知名金融集团九鼎投资倾力打造的互联网金融平台。九鼎投资是第一家登陆国内资本市场的私募股权机构，为“中国PE第一股”，净资产超100亿元，总市值近700亿元。';
    
    // expose to view
    res.locals.tabs = tabs;
    res.locals.tabIndex = tabIndex;
    
    // assign user数据
    var user = res.locals.user;
    res.expose(user, "user");
    
    // load middleware to find view base on req.path
    next();
});