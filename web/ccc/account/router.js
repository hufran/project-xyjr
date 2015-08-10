'use strict';
module.exports = function (router) {
var ccBody = require('cc-body');

router.get('/account', function (req, res, next) {
    req.url = '/account/';
    next();
});

// 未登录访问account下的页面,跳转到 /
router.get(/^\/account\//, function (req, res, next) {
    if (!req.cookies.ccat) {
        res.redirect('/');
        return;
    }
    next();
});

// topNav 需要的东西
router.get(/^\/account\//, function (req, res, next) {

    // 定位tab
    var tabs = [{
        text: '我的账户',
        url: '/account'
    }, {
        text: '我的债权',
        url: '/account/invest'
    }, {
        text: '交易记录',
        url: '/account/funds'
    }, {
        text: '账户管理',
        url: '/account/umpay',
        subTabs: [{
            text: '实名认证',
            url: '/account/umpay'
        }, {
            text: '个人信息',
            url: '/account/userInfo'
        }, {
            text: '提现银行卡信息',
            url: '/account/bankcard'
        }, {
            text: '平台密码',
            url: '/account/settings'
        }, {
            text: '安全认证',
            url: '/account/safety'
        }
        //{
            //text: '托管密码',
            //url: '/account/paypwd'
        //},
        // {
        //     text: '无密协议',
        //     url: '/account/agreement'
        // }, 
       ]
    }, {
        text: '还款管理',
        url: '/account/loan'
    }, {
        text: '我的红包',
        url: '/account/coupon'
    }, {
        text: '我的积分',
        url: '/account/integration'
    },{
        text:'我的邀请',
        url:'/account/invite'
    },{
        text:'消息中心',
        url:'/account/message'
    },{
        text:'用户反馈',
        url:'/account/feedback'
    }];

    var path = req.path.replace(/\/$/, '');
    var tabIndex, subTabIndex;

    loop: for (var index = 0, length = tabs.length; index < length; index++) {
        var tab = tabs[index];

        if (tab.url === path) {
            tabIndex = index;
            break loop;
        }

        if (tab.subTabs) {
            for (var idx = 0, len = tab.subTabs.length; idx < len; idx++) {
                var subTab = tab.subTabs[idx];
                if (subTab.url === path) {
                    tabIndex = index;
                    subTabIndex = idx;
                    break loop;
                }
            }
        }
    }

    // expose to view
    res.locals.tabs = tabs;
    res.locals.tabIndex = tabIndex;
    res.locals.subTabIndex = subTabIndex || 0;

    // assign user数据
    var user = res.locals.user;
    if (user && user.idNumber) {
        delete user.idNumber;
    }
    res.expose(user, 'user');
    // 检测用户是否登录
    if (!user) {
        next();
    }
    _.assign(res.locals, {
        // 检查手机号
        checkMobile: function () {
            return !!user.mobile;
        },

        // 检查邮箱
        checkEmail: function () {
            var email = user.email;
            if (!email) {
                return false;
            }

            if (email ===
                'notavailable@creditcloud.com'
            ) {
                return false;
            }

            return true;
        },

        // 检查是否绑定银行卡
        checkCard: function () {
            return user.bankCards.length ? true : false;
        },

        // 检查是否开通第三方支付
        checkUmpay: function () {
            return !!user.name;
        }
    });

    // safetyProgress
    var items = ['checkMobile',
        'checkCard',
        'checkUmpay'
    ];
    var avail = items.reduce(function (
        ret, item) {
        if (res.locals[item]()) {
            ret += 1;
        }
        return ret;
    }, 0);
    res.locals.safetyProgress = avail /
        items.length * 100;

    // riskText
    var riskText;
    var percent = res.locals.safetyProgress;
    if (percent <= 25) {
        riskText = '弱';
    } else if (percent > 25 && percent <=
        75) {
        riskText = '中';
    } else {
        riskText = '强';
    }
    res.locals.riskText = riskText;

    // 问候语
    var now = new Date();
    var hours = now.getHours();
    if (6 < hours && hours < 9) {
        res.locals.greetingText = '早上好';
    } else if (9 <= hours && hours < 12) {
        res.locals.greetingText = '上午好';
    } else if (12 <= hours && hours < 13) {
        res.locals.greetingText = '中午好';
    } else if (13 <= hours && hours < 18) {
        res.locals.greetingText = '下午好';
    } else {
        res.locals.greetingText = '晚上好';
    }
    next();
});


// 特定页面的
router.get('/account', function (req, res) {
    req.uest('/api/v2/user/MYSELF/statistics/invest')
        .end()
        .then(function (r) {
            _.assign(res.locals.user, r.body);
            res.render('account/index', {
                title: '我的账户|九信金融'
            });
        });
});

router.get('/account/invest', function (req, res) {
    res.render('account/invest', {
        title: '我的债权|九信金融'
    });
});

router.get('/account/funds', function (req, res) {
    res.render('account/funds', {
        title: '交易记录|九信金融'
    });
});

//account/settings 页面下的tab
[
    "umpay", // 托管账户
    "bankcard", // 银行卡信息
    "settings", // 对应修改密码
    // "paypwd",
    "safety",
    "userInfo"
].forEach(function (tabName) {
    router.get('/account/' + tabName, function (req, res) {
        Promise.join(
            req.uest('/api/v2/user/MYSELF/authenticates').get('body'),
            req.uest('/api/v2/user/MYSELF/agreement').get('body'),
            function (authenticates, agreement) {
                if (!_.isEmpty(agreement)) {
                    _.assign(res.locals.user, {
                        agreement: agreement
                    });
                }
                res.locals.user.authenticates = authenticates;
                res.render('account/settings', {
                    tabName: tabName,
                    title: '账户管理|九信金融'
                });
            });
    });
});

// 用户协议
router.get('/account/agreement', function (req, res) {
    req.uest('/api/v2/user/MYSELF/agreement')
        .end()
        .then(function (r) {
            if (!_.isEmpty(r.body)) {
                _.assign(res.locals.user, {
                    agreement: r.body
                });
            }
            res.render('account/settings', {
                tabName: 'agreement',
                title: '账户管理|九信金融'
            });
        });
});

router.get('/account/loan', function (req, res) {
    //    res.render('account/loan',{});
    res.render('account/loan', {
        //tabName: tabName,
        title: '还款管理|九信金融'
    });
});

// 修改密码
router.post("/account/change_password", ccBody, function (req,
    res) {

    /*
    currentPassword:
    newPassword:
    passwordConfirm:
    mobileCaptcha:nhmrx
    token:16243052-0c4f-4228-b1ad-7b823d637146
     */
    console.log(req.body);
    req.uest.post("/api/v2/user/MYSELF/change_password")
        .type("form")
        .send(req.body)
        .end()
        .then(function (r) {
            var result = JSON.parse(r.text);
            if (result.success) {
                res.clearCookie('ccat');
                res.json(result);
            } else {
                res.json(result.error[0]);
            }

        });
});

// 对提现进行限制,如果是企业用户,显示企业充值
router.get('/account/recharge', function (req, res, next) {
    if (!res.locals.user.name) {
        res.redirect('/account/umpay');
    } else if (!res.locals.user.bankCards.length) {
        res.redirect('account/bankcard')
    } else {        
        next();
    }
});

// 对体现进行限制
router.get('/account/withdraw', function (req, res, next) {
    if (!res.locals.user.name) {
        res.redirect('/account/umpay');
    } else {
        if (!res.locals.user.bankCards.length) {
            res.redirect('/account/bankcard');
        } else {
            next();
        }
    }
});

router.get('/account/invite', function (req, res, next) {
    res.expose(req.headers.host, 'host');
    next()
});

// 查看借款人合同
router.get('/account/allContracts/:id',
    function (req, res, next) {
        res.redirect('/api/v2/user/MYSELF/loan/' + req.params.id + '/contract');
        next();
    });

// 查看投资人合同
router.get('/account/allContracts/:id',
    function (req, res, next) {
        res.redirect('/api/v2/user/MYSELF/invest/' + req.params.id +
            '/contract');
        next();
    });

//邮箱验证
router.get('/account/authenticateEmail', function(req,res,next) {

    var email = req.query.email;
    var code = req.query.code;
    
    var sendObj = {
        code : code,
        email : email
     };

     req.uest.post('/api/v2/user/authenticateEmail')
        .type('form')
        .send(sendObj)
        .end()
        .then(function(r) {
         
            res.redirect('/register/renzheng?message=' + r.body.ConfirmResult);
         });
 });
}

