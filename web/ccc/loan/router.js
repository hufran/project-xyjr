'use strict';
var router = module.exports = require('@ds/base')
    .createSubApp(__dirname);

var moment = require('moment');
require('moment/locale/zh-cn');

function mask (str, s, l) {
	if (!str) {
		return '';
	}
	var len = str.length;
	if (!len) {
		return '';
	}
	if (!l || l < 0) {
		l = len === 2 ? 1 : len - 2;
	} else if (l > len - 1) {
		l = len - 1;
		s = !! s ? 1 : 0;
	}
	if (s > len) {
		s = len - 1;
	}
	str = str.substring(0, s) + (new Array(l + 1))
		.join('*') + str.substring(s + l);
	str = str.substring(0, len);
	return str;
}

var requestId = '';
// TODO 对id进行正则匹配
router.get('/loan/:id', require('../../middlewares/userPayment')
    .userPayment, require('../../middlewares/userFunds')
    .userFunds, require('../../middlewares/userInfo')
    .userInfo,
    function (req, res) {
        var user = res.locals.user;
        res.expose(user, "user");

        // agreement
        var agreement = null;
        if (res.locals.user && res.locals.user.accountId) {
            agreement = req.uest('/api/v2/user/MYSELF/agreement')
                .end()
                .then(function (r) {
                    return r.body;
                });
            if (!_.isEmpty(agreement)) {
                _.assign(res.locals.user, {
                    agreement: agreement
                });
            }
        }

        res.render('loan/detail', {
            loans: req.uest(
                '/api/v2/loan/' + req.params.id)
                .end()
                .then(function (r) {
                    var result = parseLoan(r.body);
                    requestId = result.loanRequest.id;                     
                    return result;
                }),
            invests: req.uest(
                '/api/v2/loan/' + req.params.id + '/invests')
                .end()
                .then(function (r) {
                    for (var i = 0, l = r.body.length; i < l; i++) {
                        r.body[i].submitTime = moment(r.body[i].submitTime)
                            .format('YYYY-MM-DD');
                        var _name = r.body[i].userLoginName;
						if (_name.length === 2) {
							r.body[i].userLoginName = mask(_name, 1);
						} else {
							r.body[i].userLoginName = mask(_name, 2);
						}
                    }
                    return r.body;
                }),
            // TODO 如何共享 loanRequestId 减少请求次数
            replay: req.uest(
                '/api/v2/loan/' + req.params.id +
                '/repayments')
                .end()
                .then(function (r) {

                    if (Array.isArray(r.body.data)) {
                        var repayments = [];
                        for (var i = 0; i < r.body.data.length; i++) {
                            repayments.push(r.body.data[i].repayment);
                        }
                        return repayments;
                    } else {
                        return r.body.data.repayments;
                    }
                })
        });
    });

router.get('/loan/:requestId/proof', function (req, res) {
    res.json(
        req.uest(
            '/api/v2/loan/request/' + req.params.requestId +
            '/proofs')
        .end()
        .then(function (r) {
            var proofs = [];
            for (var i = 0, l = r.body.length; i < l; i++) {
                proofs.push({
                    src: r.body[i].uri
                });
            }
            return proofs;
        })
    );

});

function parseLoan(loan) {
    var methodZh = {
        'MonthlyInterest': '按月付息到期还本',
        'EqualInstallment': '按月等额本息',
        'EqualPrincipal': '按月等额本金',
        'BulletRepayment': '一次性还本付息',
        'EqualInterest': '月平息'
    };

    var purposeMap = {
        'SHORTTERM': '短期周转',
        'PERSONAL': '个人信贷',
        'INVESTMENT': '投资创业',
        'CAR': '车辆融资',
        'HOUSE': '房产融资',
        'CORPORATION': '企业融资',
        'OTHER': '其它借款'
    };
    loan.rate = loan.rate / 100;
    loan.dueDate = loan.timeout * 60 * 60 * 1000 + loan.timeOpen;
    if (loan.timeSettled) {
        loan.borrowDueDate = formatBorrowDueDate(loan.timeSettled, loan
            .duration);
        loan.timeSettled = moment(loan.timeSettled)
            .format('YYYY-MM-DD');
    } else {
        // 借款成立日
        loan.timeSettled = loan.dueDate + 1 * 24 * 60 * 60 * 1000;
        loan.borrowDueDate = formatBorrowDueDate(loan.timeSettled, loan
            .duration);
        loan.timeSettled = moment(loan.timeSettled)
            .format('YYYY-MM-DD');
    }
    loan.loanRequest.timeSubmit = moment(loan.loanRequest.timeSubmit)
        .format('YYYY-MM-DD');
    loan.dueDate = moment(loan.dueDate)
        .format('YYYY-MM-DD');
    loan.method = methodZh[loan.method];
    loan.timeLeft = formatLeftTime(loan.timeLeft);
    loan.purpose = purposeMap[loan.purpose];
    //格式化期限
    if (loan.duration.days > 0) {
        if (typeof loan.duration.totalDays === "undefined") {
            loan.fduration = loan.duration.days;                            
        } else {
            loan.fduration = loan.duration.totalDays;                            
        }
        loan.fdurunit = "天";
    } else {                        
        loan.fduration = loan.duration.totalMonths;
        loan.fdurunit = "个月";
    }
    //格式化序列号
    if( loan.providerProjectCode ){
        if( loan.providerProjectCode.indexOf('#') > 0 ){
            var hh_project_code = loan.providerProjectCode.split('#');
            loan.fProjectType = hh_project_code[0];
            loan.fProjectCode = hh_project_code[1];
        } else {
            loan.fProjectType = '';
            loan.fProjectCode = loan.providerProjectCode;
        }        
    }    
    return loan;
}

// TODO 支持format
function formatLeftTime(leftTime) {
    var dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
    leftTime -= dd * 1000 * 60 * 60 * 24;
    var hh = Math.floor(leftTime / 1000 / 60 / 60);
    leftTime -= hh * 1000 * 60 * 60;
    var mm = Math.floor(leftTime / 1000 / 60);
    leftTime -= mm * 1000 * 60;
    var ss = Math.floor(leftTime / 1000);
    leftTime -= ss * 1000;

    return dd + '天' + hh + '小时' + mm + '分';
}

function formatBorrowDueDate(timeSettled, duration) {
    var borrowTime = moment(timeSettled)
        .format('YYYY-MM-DD');
    borrowTime = borrowTime.split('-');
    var year = parseInt(borrowTime[0], 10);
    var month = parseInt(borrowTime[1], 10);
    var day = parseInt(borrowTime[2]);
    var addMonth = month + duration.totalMonths;
    if( duration.days > 0 ){
        return moment(timeSettled).add('days',duration.totalDays).format('YYYY-MM-DD');       
    } else {
        if (!(addMonth % 12)) {
            //console.log(addMonth);
            year = Math.floor(addMonth / 12) - 1 + year;
            month = addMonth - (Math.floor(addMonth / 12) - 1) * 12;
        } else {
            year = Math.floor(addMonth / 12) + year;
            month = addMonth - Math.floor(addMonth / 12) * 12;
        }
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;    
    }        
}