'use strict';
module.exports = function (router) {

    var ccBody = require('cc-body');
	
	router.get('/newAccount', function (req, res, next) {
        req.url = '/newAccount/';
        next();

    });

	// 未登录访问account下的页面,跳转到 /
    router.get('/newAccount/*', function (req, res, next) {
        if (!req.cookies.ccat) {
            res.redirect('/login');
            return;
        }
        next();
    });

    // topNav 需要的东西
    router.get('/newAccount/*', function (req, res, next) {

        // assign user数据
        var user = res.locals.user;
        if (user && user.idNumber) {
            delete user.idNumber;
        }
        
            res.locals.title = '我的账户_奇乐融_联想控股成员企业-正奇金融旗下互联网金融战略平台';
    res.locals.keywords = '奇乐融|乐投宝|乐享盈|P2P网贷|P2P理财|网络理财|个人理财|投资理财|互联网金融|投资理财|';
    res.locals.description = '奇乐融(http://www.qilerong.com/) - 联想控股成员企业--正奇金融旗下互联网金融战略平台，由安徽唯源金融信息服务有限公司运营。践行普惠金融，助力财富增值。奇乐融致力于为中小微企业及个人提供专业、透明、安心、稳盈的互联网金融服务。';
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

                if (email === 'notavailable@qilerong.com') {
                    return false;
                }

                return true;
            },

            // 检查是否绑定银行卡
            checkCard: function () {
                return user.bankCards.length ? true :
                    false;
            },

            // 检查是否开通第三方支付
            checkUmpay: function () {
                return !!user.name;

            },
            authenticates: req.uest('/api/v2/user/MYSELF/authenticates').get('body'),
            isEnterprise: res.locals.user.enterprise,
            groupMedal: req.uest('/api/v2/users/MYSELF/groupMedal')
                .end()
                .then(function (r) {
                    var results = r.body.results;
                    if (results) {
                        for(var i = 0; i < results.length; i ++) {
                            
                            results[i] = results[i] + "!3";
                        } 

                        return results;
                    } else {
                        return [];
                    }
            })

        });


        // safetyProgress
        var items = ['checkMobile', 'checkEmail', 'checkCard', 'checkUmpay'];
        var avail = items.reduce(function (
            ret, item) {
            if (res.locals[item]()) {
                ret += 1;
            }
            return ret;
        }, 0);

        res.locals.safetyProgress = avail / items.length * 100;

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

    router.get('/newAccount/home', function (req, res) {
        Promise.join(
            req.uest('/api/v2/user/MYSELF/statistics/invest')
            .get('body'),
            req.uest(
                '/api/v2/user/MYSELF/paymentPasswordHasSet')
            .get('body'),
            function (investStatistics, paymentPasswordHasSet) {
                res.locals.user.investStatistics =
                    investStatistics;
                res.locals.user.paymentPasswordHasSet =
                    paymentPasswordHasSet;
                res.render('newAccount/home', {
                    title: '奇乐融',
                    isEnterprise: res.locals.user.enterprise
                });
            });
    });

    router.get('/newAccount/invest/*', function (req, res) {
    	res.render('newAccount/invest', {
    		title: '奇乐融'
    	});
    });

    router.get('/newAccount/loanRequest/*', function (req, res) {
        res.render('newAccount/loan', {
            title: '奇乐融'
        });
    });

    [
        "bankCards",
        "authentication",
        "password",
        "resetPassword",
        "userInfo"
    ].forEach(function (tabName) {
        router.get('/newAccount/settings/' + tabName, function (req, res) {
            Promise.join(
                req.uest(
                    '/api/v2/user/MYSELF/authenticates'
                )
                .get('body'),
                req.uest(
                    '/api/v2/user/MYSELF/paymentPasswordHasSet')
                .get('body'),
                req.uest('/api/v2/user/MYSELF/fundaccountsMap')
                .get('body'),
                function (authenticates, paymentPasswordHasSet, fundaccountsMap) {
                    res.locals.user.authenticates =
                        authenticates;
                    res.locals.user.paymentPasswordHasSet =
                        paymentPasswordHasSet;
                    res.locals.user.fundaccountsMap =
                        fundaccountsMap;
                    res.render('newAccount/settings', {
                        tabName: tabName,
                        title: '奇乐融'
                    });
                });
        });
    });

    // 修改密码
    router.post("/newAccount/change_password", ccBody, function (req,
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
    router.get('/newAccount/recharge', function (req, res, next) {

        var enterprise = res.locals.user.enterprise;
        var banks = _.filter(res.locals.user.bankCards, function (r) {
            return r.deleted === false;
        });
        if (!banks.length && !enterprise) {
            res.redirect('/newAccount/settings/bankCards');
        } else {
            next();
        }
    });

    // 对体现进行限制
    router.get('/newAccount/withdraw', function (req, res, next) {

        var enterprise = res.locals.user.enterprise;
        Promise.join(req.uest(
                '/api/v2/user/MYSELF/paymentPasswordHasSet')
            .get('body'),
            function (paymentPasswordHasSet) {
                res.locals.user.paymentPasswordHasSet = paymentPasswordHasSet;
                var banks = _.filter(res.locals.user.bankCards, function (r) {
                    return r.deleted === false;
                });

                if (!banks.length && !enterprise) {
                    res.redirect('/newAccount/settings/bankCards');
                } else {
                    next();
                }
            });        
    });
    router.get('/newAccount/fund/:name',function(req,res,next){
        res.render('/newAccount/fund',{urlname:req.params.name});
        
    });
}
