"use strict";
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var items = ['checkMobile','checkId', 'checkPwd','checkEmail'];
var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/newAccount/partials/settings/userInfo.html'),

    data: {
        showBasic:true,
        currentTab:'basic',
        expand: true,
        bindMsg: null,
        unbindMsg: null,
        idNumber:'',
        percent: 0,
        levelText:'弱',
        agreement: typeof CC.user.accountId === 'undefined' ? false : CC.user
            .agreement,
        accountId: CC.user.agreement ? CC.user.agreement : false,
        mobile: formatNumber(CC.user.mobile),
        activatedEmail: CC.user.authenticates.emailAuthenticated,
        idauthenticated: CC.user.authenticates.idauthenticated,
        paymentPasswordHasSet : CC.user.paymentPasswordHasSet || false
    },
    init: function() {
                var self = this;    
                accountService.getUserInfo(function (userinfo) {
                    if (userinfo.personal) {
                        ractive.set('male', ''+userinfo.personal.male);
                    }
                    if (userinfo.personal && userinfo.personal.education && userinfo.personal.education.educationLevel) {
                        ractive.set('educationLevel', userinfo.personal.education.educationLevel)
                    }
                    if (userinfo.career && userinfo.career.company && userinfo.career.company.industry) {
                        ractive.set('companyIndustry', userinfo.career.company.industry);
                    }
                    if (userinfo.career && userinfo.career.salary) {
                        ractive.set('salary', userinfo.career.salary)
                    }
                    if (userinfo.personal && userinfo.personal.maritalStatus) {
                        ractive.set('maritalStatus', userinfo.personal.maritalStatus)
                    }
                    
                    if (CC.user.authenticates.idauthenticated) {
                        var idNumber = formatNumber(userinfo.user.idNumber, 4, 4);
                        ractive.set('idNumber', idNumber);
                    };
                });   
                var avail = items.reduce(function (
                    ret, item) {
                    if (self[item]()) {
                        ret += 1;
                    }
                    return ret;
                }, 0);
                var percent = avail/items.length * 100;
                self.set('percent',percent);
                var levelText;
                if (percent <= 25) {
                    levelText = '弱';
                } else if (percent > 25 && percent <=
                    75) {
                    levelText = '中';
                } else {
                    levelText = '强';
                }
                self.set('levelText',levelText);
    },
    checkMobile:function() {
        return !!CC.user.mobile;
    },
    checkId: function() {
        return CC.user.authenticates.idauthenticated;
    },
    checkPwd: function() {
        return CC.user.paymentPasswordHasSet; 
    },
    checkEmail: function() {
        return CC.user.authenticates.emailAuthenticated;
    }
});

ractive.on('changeTab', function (event) {
	var tab = event.node.getAttribute('data-tab');
	if (tab !== this.get('currentTab')) {
		this.set('currentTab', tab);
		this.set('showBasic', !this.get('showBasic'));
	}
});

function formatNumber(number, left, right) {
    if (!number) {
        return '';
    }
    left = left || 3;
    right = right || 4;
    var tmp = '';
    for (var i = 0; i < number.length; i++) {
        if (i < left || (number.length - right) <= i) {
            tmp += number[i];
        } else {
            tmp += '*';
        }
    }
    return tmp;
}

$(function (){
    $(".goRz").click(function (e){
        e.preventDefault();
        $('.rzz').toggle();
    });

    $(".rzE_button").click(function (){
        var email = $('.rZemail').val();
        if (email == '') {
            $('.errors').text('请输入邮箱!');
            $('.errors').css('backgroundImage','url(/ccc/register/img/gou-bg.png)');
        } else if (!email.match(/[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+/)) {
            $('.errors').text('请输入正确的邮箱!');
			$('.errors').css('backgroundImage','url(/ccc/register/img/gou-bg.png)');

        } else {
            $('.errors').text('');
            $.post('/api/v2/users/creditEmail/MYSELF', {
                email : email
            }, function(o){
                //console.log(o);
                if (o.success) {
                    alert('认证邮件已发送至您的账号为' + o.data + '的邮箱，快去认证吧！');
                    window.location.reload();
                } else {
                    alert(o.error[0].message);
                    window.location.reload();
                }
            });
        }
    });
});

ractive.on('submit',function() {
    var male = this.get('male');
    var companyIndustry  = this.get('companyIndustry');
    var educationLevel = this.get('educationLevel');
    var salary = this.get('salary');
    var maritalStatus  = this.get('maritalStatus');
    accountService.updatePersonalInfo(male,educationLevel,maritalStatus,function(r) {
        if (!r.error) {
            accountService.updateCareerInfo(companyIndustry,salary,function(r) {
                if (!r.error) {
                    alert('信息编辑成功');
                } else {
                   alert('信息编辑失败,请稍后重试！'); 
                }   
            });
        } else {
             alert('信息编辑失败,请稍后重试！'); 
        }
    });
    return false;
});
           