'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);


//实现列表左侧切换
router.get(/^\/help/, function (req, res, next) {    
    // 定位tab
    var tabs = [{
        text: '账户安全',
        url: '/help/account'
    }, {
        text: '投资收益',
        url: '/help/invester'
    }, {
        text: '充值提现',
        url: '/help/borrower'
    }, {
        text: '注册登录',
        url: '/help/common',        
    },
    // {
    //     text: '名词解释',
    //     url: '/help/noun'
    // }, {
    //     text: '安全保障问题',
    //     url: '/help/safety',        
    // },
     ];

    var path = req.path.replace(/\/$/, '');
    var tabIndex;

    loop: for (var index = 0, length = tabs.length; index < length; index++) {
        var tab = tabs[index];

        if (tab.url === path) {
            tabIndex = index;
            break loop;
        }        
    }
    
    tabIndex = tabIndex || 0; // /help -> /help/noun

    // expose to view
    res.locals.tabs = tabs;
    res.locals.tabIndex = tabIndex;
    // assign user数据
    var user = res.locals.user;
    if (user && user.idNumber) {
        delete user.idNumber;
    }
    res.expose(user, 'user');
    next();
});

router.get('/help', function (req, res) {    
    res.render('help/index', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/noun', function (req, res) {    
    res.render('help/noun', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/common', function (req, res) {    
    res.render('help/common', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/invester', function (req, res) {    
    res.render('help/invester', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/borrower', function (req, res) {    
    res.render('help/borrower', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/account', function (req, res) {    
    res.render('help/account', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

router.get('/help/safety', function (req, res) {    
    res.render('help/safety', {
        title: '新手指引|九信金融-国内首家PE系互联网金融平台'
    });
});

