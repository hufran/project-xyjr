"use strict";

var utils = require('ccc/global/js/lib/utils');
//var LLPBANKS = require('ccc/global/js/modules/cccllpBanks');

var Confirm = require('ccc/global/js/modules/cccConfirm');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var CommonService = require('ccc/global/js/modules/common').CommonService;
var CccOk = require('ccc/global/js/modules/cccOk');
var Message = require('ccc/global/js/modules/cccMessage');
require('ccc/xss.min');
// 过滤银行卡，只显示enabled=true的
var banksList={}
var banks=[];
var smsid,interval;

if (CC.user.account) {
    CC.user.account.Faccount = utils.bankAccount(CC.user.account.account);
}

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});
var payMethod="lianlianpay",financingAPI;
if(payMethod==="lianlianpay"){
    financingAPI="/api/v2/lianlianpay/banks";
}else{
    financingAPI="/api/v2/jdpay/banks";
}

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/newAccount/partials/settings/bankCards.html'),

    data: {
        status: CC.user.lccbUserId ? 1 : 0,
        payment: CC.user.name ? true : false,
        //banks: banks,
        msg: {
            BANK_NULL: false,
            CARD_NULL: false,
            CARD_INVALID: false,
        },
        bank: '',
        bankAccount: banksabled || [],
        province: '',
        city: '',
        ifDel: false,
        mobile: banksabled.length ? CC.user.bankCards[0].account.bankMobile : '',
        realName: CC.user.name,
        isAuditing : false,
        // CC.user.fundaccountsMap.data.auditingList.length > 0 ? true : false
        lccbId: CC.user ? CC.user.lccbUserId : ''
    },
    oninit: function () {
        accountService.getUserInfo(function (o) {
            ractive.set('realName', o.user.name);
        });
        SeverName();
    },
    oncomplete: function () {
        // accountService.getProvince(function (res) {
        //     ractive.set('province', changeToList(res));
        //     ractive.set('myProvince','广东');
        //     var fProvince = ractive.get('myProvince') || '广东';
        //     accountService.getCity(fProvince, function (res) {
        //         ractive.set('city', changeToList(res));
        //     });
        // });
        CommonService.getLccbId(CC.user.id, function(res) {
            if(res.status == 0) {
                if(res.data.lccbId == 0) {
                    ractive.set('lccbId', '');
                    ractive.set('status', 0);
                    ractive.set('kaitong', "激活");
                } else if (res.data.lccbId == -1){
                    ractive.set('status', 0);
                    ractive.set('kaitong', "开通");
                    ractive.set('lccbId', res.data.lccbId);
                } else{
                    ractive.set('status', 1);
                    ractive.set('lccbId', res.data.lccbId);
                }            
            }
        })        
    }
});

//判断是什么业务显示不同的银行卡列表
//changeSeverName();
// $('select[name="severName"]').on('change',function(){
//     changeSeverName();
// })
function changeSeverName(){
    if ($('select[name="severName"]').val()=='融资借款') {//融资借款
        request('GET','/api/v2/jdpay/banks4AppServer').end().
            then(function (r) {
                banks=[];
                banksList=r.body;
                for (var i in banksList) {
                    name=banksList[i];
                    banks.push({'name': name});
                };
                ractive.set('banks', banks);
                console.log('#####bank');
                console.log(banks);
            });
    }else{//理财
        request('GET',financingAPI).end().
            then(function (r) {
                banks=[];
                banksList=r.body;
                for (var i in banksList) {
                    name=banksList[i];
                    banks.push({'name': name});
                };
                ractive.set('banks', banks);
                console.log('#####bank');
                console.log(banks);
            });
    };
}

function SeverName(){
    request('GET',"/api/v2/lccb/banks").end().
        then(function (r) {
            banks=[];
            banksList=r.body;
            for (var i in banksList) {
                name=banksList[i];
                banks.push({'name': name,'code': i});
            };
            ractive.set('banks', banks);
        });
}

// $('select[name="bankName"]').on("change", function() {
//     var code = $(this).find("option:selected").attr('data-code');
//     console.log(code);
//     $(".bankpic").css("background-image","url(/ccc/newAccount/img/bankIcons/"+code+".png)");
// })



// var banks = _.filter(LLPBANKS, function (r) {
//     return r.enable === true;
// });
ractive.on("validateCardNo", function () {
    var no = this.get("cardNo");
    if (!/^\d{5,40}$/.test(no)) {
        this.set("cardNoError", true);
    } else {
        this.set("cardNoError", false);
    }
});

ractive.on('checkSame', function () {
    var no = this.get("cardNo");
    var reno = this.get("recardNo");
    
    if (reno !== '') {
        if (no !== reno) {
            this.set('cardDiff', true);
            this.set("cardNoError", false);
        } else {
            this.set('cardDiff', false);
        }
    }
});


ractive.on('checkSmsCaptcha', function () {
    var smsCaptcha = this.get('smsCaptcha');
    if (!/^\d{6}$/.test(smsCaptcha)) {
        this.set('textError', '验证码错误');
        this.set('SMS_NULL', true);
    } else {
        this.set('SMS_NULL', false);
    }
});

ractive.on("validatePhoneNo", function () {
    var no = this.get("mobile");
    if (!/^1\d{10}$/.test(no)) {
        this.set("phoneNoError", true);
    } else {
        this.set("phoneNoError", false);
    }
});

ractive.on('doDel', function () {
    this.set('ifDel',true);
});
ractive.on("bind-card-submit", function (e) {
    e.original.preventDefault();
    this.fire("validateCardNo");
    var cardNoError = this.get("cardNoError");
    if (cardNoError) {
        return false;
    }

    if ($('select[name="bankName"]').val()=='请选择开户银行'){
        showErrorIndex('showErrorMessagea1','errorMessagea1','* 请选择开户银行');
        return false;
    }else{
        clearErrorIndex('showErrorMessagea1','errorMessagea1');
    } 
    
    this.fire("validatePhoneNo");
    var phoneNoError = this.get("phoneNoError");
    if (phoneNoError) {
        return false;
    }

    this.fire("checkSmsCaptcha")
    var SMS_NULL = this.get('SMS_NULL');
    if (SMS_NULL) {
        return false;
    }
    // var bankr= _.filter(CC.user.bankCards, function (r) {
    // return r.deleted === false;
    // });
    var bankName = this.get('bankCode');
    var cardNo = this.get('cardNo');
    // var recardNo = this.get('recardNo');
    var cardPhone = this.get('mobile');
    // var province = this.get('myProvince');
    // var city = this.get('myCity');
    // var branchName = this.get('branchName');
    var smsCaptcha = this.get('smsCaptcha');
    //选择业务类型
    // if ($('select[name="severName"]').val()==''){
    //     showErrorIndex('showErrorMessagea0','errorMessagea0','* 请选择业务类型');
    //     return false;
    // }else{
    //     clearErrorIndex('showErrorMessagea0','errorMessagea0');
    // } 

    
    // if(cardNo === ''){
        // showErrorIndex('showErrorMessagea','errorMessagea','* 卡号不能为空');
    //     this.set("cardNoError", true)
    //     return false;
    // }else{
    //      clearErrorIndex('showErrorMessagea','errorMessagea');
    // }
    if(!smsid){
        this.set('textError', '验证码错误');
        this.set('SMS_NULL', true)
        return false;
    }
    // if(recardNo === ''){
    //     showErrorIndex('showErrorMessageb','errorMessageb','* 确认卡号不能为空');
    //     return false;
    // }else{
    //     clearErrorIndex('showErrorMessageb','errorMessageb');
    // }
    
    // var cardNoError = this.get("cardNoError")==undefined?true:this.get("cardNoError");
    // var cardDiff = this.get('cardDiff')==undefined?true:this.get('cardDiff');

    // if(cardDiff ==true){
    //     showErrorIndex('showErrorMessageb','errorMessageb','* 两次银行卡号不一致');
    //     return false;
    // }else{
    //     clearErrorIndex('showErrorMessageb','errorMessageb');
    // }

    // if (cardNoError || cardDiff) {
    //     return false;
    // }
    
    var sendObj = {
        smsid: smsid,
        validatemsg: filterXSS(smsCaptcha),
        userphonenum: filterXSS(cardPhone),
        bankcode: filterXSS(bankName),
        cardnbr: filterXSS(cardNo)        
    }

    $.post('/api/v2/lccb/userChangeBank/'+ CC.user.id, sendObj,function(r){
        var msg;
        if (r.status == 0) {
           msg = '绑卡成功'
        }else{
            msg= '绑卡失败'
        }
        CccOk.create({
            msg: msg,
            okText: '确定',
            ok: function () {
                window.location.reload();
            },
            cancel: function () {
                window.location.reload();
            }
        });
    })

    

    // $.post('/yeepay/bindCard', sendObj, function (r) {
    //     if(r.success) {
    //         CccOk.create({
    //             msg: '绑卡成功',
    //             okText: '确定',
    //             ok: function () {
    //                 window.location.reload();
    //             },
    //             cancel: function () {
    //                 window.location.reload();
    //             }
    //         });
    //     } else {
    //         if(r.error[0].message){
    //             var error = r.error[0].message
    //             if(error.indexOf("绑卡失败")>-1)  {                                          
    //                 }else{
    //                     error = '绑卡失败' + error;
    //             }
    //         }
    //         CccOk.create({
    //             msg: error,
    //             okText: '确定',
    //             ok: function () {
    //                 window.location.reload();
    //             },
    //             cancel: function () {
    //                 window.location.reload();
    //             }
    //         });
    //     }
    // });
});

ractive.on("delete-card-submit", function (e) {
    e.original.preventDefault(); 
    if (CC.user.enterprise) {
        console.log('企业用户没有手机号')
        return
    }   
    if(!this.get('lccbId')) {
        CccOk.create({
            msg: '用户尚未激活，不能更换银行卡',
            okText: '确定',
            ok: function () {
                window.location.reload();
            },
            cancel: function () {
                window.location.reload();
            }
        });
    }
    Confirm.create({
        msg: '请先确认当前的投资待还本金全部结清，再进行更换银行卡！',
        okText: '确定',
        cancelText: '取消',
        ok: function () {
            // $('.btn-confirm-cancel').trigger('click');
            // $.post('/yeepay/deleteCard', {
            $.post('/api/v2/lccb/checkIsChangeBank/' + CC.user.id, function (r) {
                $('.dialog').hide()
                if(r.status == 0) {
                    var phoneNumber1 = CC.user.bankCards[0].account.bankMobile;
                    var phoneNumber = phoneNumber1.substr(0,3) + '****' + phoneNumber1.substr(-4)                   
                    Message.create({
                        msg: '短信验证码已发送至',
                        okText: '下一步',
                        phone: phoneNumber,
                        url: '/api/v2/lccb/sms2OldMobile/'+ CC.user.id,
                        ok: function () {
                            ractive.set("status", 3)
                            $('select[name="bankName"]').on("change", function() {
                                var code = $(this).find("option:selected").attr('data-code');
                                console.log(code);
                                ractive.set('bankCode', code)
                                $(".bankpic").css("background-image","url(/ccc/newAccount/img/bankIcons/"+code+".png)");
                            })
                            $('.dialog-overlay').hide()
                            $('.dialog').hide()
                            
                        },
                        close: function () {
                            window.location.reload();
                        }
                    });
                } else {
                    CccOk.create({
                        msg: '更换银行卡失败，' + r.msg,
                        okText: '确定',
                        ok: function () {
                            window.location.reload();
                        },
                        cancel: function () {
                            window.location.reload();
                        }
                    });
                }

            });
                                        
        }
    });

});

ractive.on('selectPro', function () {
    var province = filterXSS(this.get('myProvince'));
    accountService.getCity(province, function (res) {
        ractive.set('city', changeToList(res));
    });
});

function changeToList(map) {
    var _arr = [];
    for (var key in map) {
        var tmp = {};
        tmp.key = key;
        tmp.val = map[key];
        _arr.push(tmp);
    }

    return _arr;
};

ractive.on('sendCode', function (){
    
    if (!this.get('isSend')) {
        this.set('isSend', true);       
        var smsType = '800006';
        var cardnbr = ractive.get("cardNo");
        var cardPhone = ractive.get("mobile");
        var realName = ractive.get("realName")
        if(cardnbr === ''){
            showErrorIndex('showErrorMessagea','errorMessagea','* 卡号不能为空');
            return false;
        }else{
             clearErrorIndex('showErrorMessagea','errorMessagea');
        }

        if(cardPhone == '') {
            this.set('phoneNoError', true);
            return
        }
        countDown()
        CommonService.getMessage2(smsType, CC.user.userId, cardnbr,cardPhone, realName, function (r) {
            if (r.status == 0) {
                smsid = r.data;            
            }else{
                ractive.set({
                    SMS_NULL: true,
                    textError: '发送失败'
                });
                ractive.set('isSend', false);
                $('.getcaptcha')
                    .html("获取验证码");
                $('.getcaptcha')
                    .removeClass('disabled');
                clearInterval(interval);
            }
        });
    }
});

function countDown() {
    $('.sendCode')
        .addClass('disabled');
    var previousText = '获取验证码';
    var msg = '$秒';

    var left = 120;
    interval = setInterval((function () {
        if (left > 0) {
            $('.sendCode')
                .html(msg.replace('$', left--));
        } else {
            ractive.set('isSend', false);
            $('.sendCode')
                .html(previousText);
            $('.sendCode')
                .removeClass('disabled');
            clearInterval(interval);
        }
    }), 1000);
}

function clearErrorIndex(key,msgkey){
    ractive.set(key,false);
    ractive.set(msgkey,'');
    return false;
}
function showErrorIndex(key,msgkey,msg){
    ractive.set(key,true);
    ractive.set(msgkey,msg);
    return false;
}