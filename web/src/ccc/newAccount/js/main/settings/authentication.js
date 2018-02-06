"use strict";

var utils = require('ccc/global/js/lib/utils');
var Confirm = require('ccc/global/js/modules/cccConfirm');
var accountService = require('ccc/newAccount/js/main/service/account').accountService;
var CccOk = require('ccc/global/js/modules/cccOk');
var format = require('@ds/format');
var CommonService = require('ccc/global/js/modules/common').CommonService;
require('ccc/xss.min');

var banksabled = _.filter(CC.user.bankCards, function (r) {
    return r.deleted === false;
});
var banksList={}
var banks=[];
var smsid, accountNames,interval;

var ractive = new Ractive({
    el: "#ractive-container",
    template: require('ccc/newAccount/partials/settings/authentication.html'),

    data: {
        isQuickCheck: true,
        authenticateInfo: {
            name: CC.user.name || '',
            idNumber: ''
        },
        bank: banksabled.length? true:false,
        paymentPasswordHasSet : CC.user.paymentPasswordHasSet || false,
        format: format,
        bankNumber: '',
        bankMobile: '',
        accountName: '',
        lccbId: CC.user ? CC.user.lccbUserId : '',
        authority: CC.user ? CC.user.lccbAuth : '',
        action: ''
    },
    oninit: function () {
        accountService.getUserInfo(function (res) {
            ractive.set('authenticateInfo', {
                name: res.user.name,
                idNumber: res.user.idNumber,
            });
            if(ractive.get('bank')) {
                ractive.set('bankNumber', CC.user.bankCards[0].account.account)
                ractive.set('bankMobile', CC.user.bankCards[0].account.bankMobile)
            }
        });

        CommonService.getLccbId(CC.user.id, function(res) {
            if(res.status == 0) {
                if(res.data.lccbId == 0) {
                    ractive.set('lccbId', '');
                    ractive.set('buttonname', '立即激活');
                }else{
                    ractive.set('lccbId', res.data.lccbId);
                    ractive.set('buttonname', '授权投资');
                }
                ractive.set('authority', res.data.lccbAuth);                
            }
        })
    },
    oncomplete: function () {
       // SeverName() 
       if(ractive.get('bank')) {
          var bankcode = CC.user.bankCards[0].account.bank
          $(".bankpic").css('background-image','url(/ccc/newAccount/img/bankIcons/'+ bankcode + '.png)')         
       }      
    }
});

var popupDepositAgreement = require('ccc/agreement/js/main/depositAgreement').popupDepositAgreement;
ractive.on('maskDepositAgreement', function (e) {
    e.original.preventDefault();
    popupDepositAgreement.show();
});

// 要认证
ractive.on('checkName',function(){
    var name = this.get("name");
    this.set('showErrorMessageName',false);
    if(this.get("authenticateInfo").name){return}
    utils.formValidator.checkName(name, function (bool, error) {
        if (!bool) {
            ractive.set({
                showErrorMessageName: true,
                errorMessageName: utils.errorMsg[error]
            });
        }
    });
});
ractive.on('checkIdNumber',function(){
    var idNumber = this.get("idNumber");
    this.set('showErrorMessageId',false);
    if(this.get("authenticateInfo").idNumber){return}
        if(CC.user.enterprise){
            if (!/^\d{5,20}$/.test(idNumber)) {        
                ractive.set({
                    showErrorMessageId: true,
                    errorMessageId: "请输入正确的执照编号"
                });
            }else{
                this.set('showErrorMessageId',false);
            }
        }else{
            utils.formValidator.checkIdNumber(idNumber, function (bool, error) {
                if (!bool) {
                    ractive.set({
                        showErrorMessageId: true,
                        errorMessageId: utils.errorMsg[error]
                    });
                }
            });
        }   
});

ractive.on('checkbankNumber', function(){
    var bankNumber = this.get("bankNumber");
    this.set('showErrorbankNumber',false);
    if(!bankNumber){
        var error = 'BANK_NULL'
        ractive.set({
            showErrorbankNumber: true,
            errorbankNumber: utils.errorMsg[error]
        });
    }else{        
        if (!/^\d{5,40}$/.test(bankNumber)) {  
            var error = 'BANK_ERR'      
            ractive.set({
                showErrorbankNumber: true,
                errorbankNumber: utils.errorMsg[error]
            });
        }else{
            this.set('showErrorbankNumber',false);
        }
    }
    
})

ractive.on('checkbankPhone', function(){
    var bankPhone = this.get("bankPhone");
    this.set('showErrorbankPhone',false);   
    if(!bankPhone){
        var error = 'MOBILE_NULL'
        ractive.set({
            showErrorbankPhone: true,
            errorbankPhone: utils.errorMsg[error]
        });
    }else{        
        if (!/^1\d{10}$/.test(bankPhone)) {
            var error = 'MOBILE_INVALID'        
            ractive.set({
                showErrorbankPhone: true,
                errorbankPhone: utils.errorMsg[error]
            });
        }else{
            this.set('showErrorbankPhone',false);
        }
    }   
})

ractive.on('checkmessageTxt', function(){
    var messageTxt = this.get("messageTxt"); 
    this.set('showErrormessageTxt',false);   
    if(!messageTxt){
        var error = 'SMSCAPTCHA_INVALID'
        ractive.set({
            showErrormessageTxt: true,
            errormessageTxt: utils.errorMsg[error]
        });
    }else{
        if (!/^\d{6}$/.test(messageTxt)) {
            var error = 'SMSCAPTCHA_INVALID'        
            ractive.set({
                showErrormessageTxt: true,
                errormessageTxt: utils.errorMsg[error]
            });
        }else{
            this.set('showErrormessageTxt',false);
        }
    }    
})

$('select[name="bankName"]').on("change", function() {
    var code = $(this).find("option:selected").attr('data-code');
    console.log(code);
    $(".bankpic").css("background-image","url(/ccc/newAccount/img/bankIcons/"+code+".png)");
})

$('#agree').on('click', function() {
    $('.agree-error').html('');
})
//原有开户逻辑
// ractive.on("register-account-submit", function () {   
//     var that=this;
    
//     this.fire('checkName');
//     this.fire('checkIdNumber');
//     this.fire('checkbankNumber');
//     this.fire('checkbankPhone');
//     this.fire('checkmessageTxt');
//     if ($('select[name="bankName"]').val()=='请选择开户银行') {
//         ractive.set({
//             showErrorbankName: true,
//             errorbankName: '请选择开户银行'
//         });
//         return false;
//     }else{
//         ractive.set("showErrorbankName", false);
//     }
//     if(this.get('showErrorMessageName') || this.get('showErrorMessageId') || this.get('showErrorbankNumber') || this.get('showErrorbankPhone') || this.get('showErrormessageTxt')) {
//         return false;
//     }

//     if (document.getElementById('agree').checked == true){
//         $('.agree-error').html('');
//     }else{
//         $('.agree-error').html('请先同意开通银行存管协议');
//         return;
//     }

//     if(!smsid){
//         var error = 'SMSCAPTCHA_INVALID'        
//         ractive.set({
//             showErrormessageTxt: true,
//             errormessageTxt: utils.errorMsg[error]
//         });
//         return
//     }
//     var name = filterXSS(this.get("name")) || this.get("authenticateInfo").name;
//     var idNumber = filterXSS(this.get("idNumber")) || this.get("authenticateInfo").idNumber;
//     var bankNumber = filterXSS(this.get("bankNumber"));
//     var bankName = filterXSS(this.get("bankName"));
//     var bankPhone = filterXSS(this.get("bankPhone"));
//     var messageTxt = filterXSS(this.get("messageTxt"));
//     utils.formValidator.checkName(name, function (bool, error) {
//         if (!bool) {
//             ractive.set({
//                 showErrorMessageName: true,
//                 errorMessageName: utils.errorMsg[error]
//             });
//         } else {
//             utils.formValidator.checkIdNumber(idNumber, function (bool, error) {
//                 if (!bool) {
//                     ractive.set({
//                         showErrorMessageId: true,
//                         errorMessageId: utils.errorMsg[error]
//                     });

//                     return false;
//                 }

//                 var user = {
//                     userId: CC.user.id,
//                     realName: $.trim(name),
//                     idNumber: $.trim(idNumber),
//                     bankName: bankName,
//                     cardNo: bankNumber,
//                     cardPhone: bankPhone,
//                     smsCaptcha: messageTxt,
//                     smsid: smsid
//                 };
//                 var msg,link;
//                 if (that.get('bank') && that.get('paymentPasswordHasSet')) {
//                     msg = "恭喜您，认证成功！";
//                 } else {
//                     msg = "认证成功，请开通交易密码";
//                     link = '/newAccount/settings/password';
//                 }
//                 accountService.authenticateUser(user,
//                     function (res) {
//                         console.log(res)
//                         if (res.success) {
//                             CccOk.create({
//                                 msg: msg,
//                                 okText: '现在开通',
//                                 cancelText: '稍后再说',
//                                 ok: function () {                                    
//                                     if (link) {                                        
//                                         window.location.href = link;
//                                     } else {
//                                         window.location.reload();
//                                     }

//                                 },
//                                 cancel: function () {
//                                     window.location.reload();
//                                 },
//                                 close:function(){
//                                     window.location.reload();
//                                 }
//                             });
//                         } else {
//                           setTimeout(function(){
//                             window.location.reload();
//                           },5000);
//                             if (!(res.error[0] && res.error[0].message)) {
//                                 res.error[0].message = "银行存管开通失败";
//                             }
//                             CccOk.create({
//                                 msg: res.error[0].message,
//                                 okText: '确定',
//                                 cancelText: '',
//                                 ok: function () {
//                                     window.location.reload();
//                                 },
//                                 cancel: function () {
//                                     window.location.reload();
//                                 },
//                                 close:function(){
//                                   window.location.reload();
//                                 },
//                             });
//                         }
//                     });
//             });
//         }
//     });
// });
ractive.on("register-account-submit", function () {   
    var that=this;
    
    this.fire('checkName');
    this.fire('checkIdNumber');


    if(this.get('showErrorMessageName') || this.get('showErrorMessageId')) {
        return false;
    }

    if (document.getElementById('agree').checked == true){
        $('.agree-error').html('');
    }else{
        $('.agree-error').html('请先同意开通银行存管协议');
        return;
    }


    var name = filterXSS(this.get("name")) || this.get("authenticateInfo").name;
    var idNumber = filterXSS(this.get("idNumber")) || this.get("authenticateInfo").idNumber;

    var user = {
        userId: CC.user.id,
        name: $.trim(name),
        idNumber: $.trim(idNumber),
        successUrl: window.location.href
    };
    openBank(user)
});

ractive.on("open_submit",function(e){
   e.original.preventDefault();
   console.log("跳转？？？？")
})


// 继续开通
ractive.on('continue-open', function () {
    if (!this.get('isQuickCheck')) {
        this.set({
            showErrorMessage: true,
            errorMessage: "必须同意托管协议"
        });
    } else {
        Confirm.create({
            msg: '签订是否成功？',
            okText: '签订成功',
            cancelText: '签订失败',
            ok: function () {
                window.location.reload();
            },
            cancel: function () {
                window.location.reload();
            }
        });
    }
});

ractive.on('agreement-check', function () {
    return false;
});

ractive.on('sendTelCode', function (){
    this.fire('checkbankNumber');
    this.fire('checkbankPhone');
    this.set('showErrormessageTxt',false);
    var $captchaBtn = $(".getcaptcha");
    var cardnbr = this.get("bankNumber");
    var cardPhone = this.get("bankPhone");
    var username = this.get("name") || this.get("authenticateInfo").name;
    if ($captchaBtn.hasClass('disabled')) {
        return;
    }
    if(!username){
        this.fire('checkName');
    }
    if(this.get('showErrorbankNumber') || this.get('showErrorbankPhone') || this.get('showErrorMessageName')){
        return;
    }
    
    var smsType = '800001';
    var userId = CC.user.userId;
    countDown();    
    CommonService.getMessage2(smsType, userId, cardnbr,cardPhone, username, function (r) {
        if (r.status == 0) {
            smsid = r.data;            
        }else{
            ractive.set({
                showErrormessageTxt: true,
                errormessageTxt: '发送失败'
            });
            $('.getcaptcha')
                .html("获取验证码");
            $('.getcaptcha')
                .removeClass('disabled');
            clearInterval(interval);
        }
    });
});

ractive.on('sendTelCode2', function (){
    this.set('showErrormessageTxt',false);
    var $captchaBtn = $(".getcaptcha");
    var cardnbr = this.get("bankNumber");
    var cardPhone = this.get("bankMobile");
    var username = this.get("authenticateInfo").name;
    if ($captchaBtn.hasClass('disabled')) {
        return;
    }

    if (!this.get("lccbId")) {
        var smsType = '800031';
    }else{
        var smsType = '800027';
    }
    
    var userId = CC.user.userId;
    countDown();    
    CommonService.getMessage2(smsType, userId, cardnbr,cardPhone, username, function (r) {
        if (r.status == 0) {
            smsid = r.data;            
        }else{
            ractive.set({
                showErrormessageTxt: true,
                errormessageTxt: '发送失败'
            });
            $('.getcaptcha')
                .html("获取验证码");
            $('.getcaptcha')
                .removeClass('disabled');
            clearInterval(interval);
        }
    });
});

ractive.on('jihuo-submit', function (){
    if(!this.get("lccbId")) {
        if (document.getElementById('agree').checked == true){
            $('.agree-error').html('');
        }else{
            $('.agree-error').html('请先同意开通银行存管协议');
            return;
        }

        if(!smsid){
            var error = 'SMSCAPTCHA_INVALID'        
            ractive.set({
                showErrormessageTxt: true,
                errormessageTxt: utils.errorMsg[error]
            });
            return
        }

        this.fire('checkmessageTxt');
        if (this.get("showErrormessageTxt")) {
            return
        }
    }
    
    
    var mess = this.get("messageTxt");
    if(!this.get("lccbId")){
        console.log("激活")
        $.post('/api/v2/lccb/persionInit/'+ CC.user.userId,{
            smsid: smsid,
            smsCaptcha : mess
        },function(res) {
            CccOk.create({
                msg: res.msg,
                okText: '确定',
                ok: function () {
                    window.location.reload();
                },
                cancel: function() {
                    window.location.reload();
                }
            });                    
        })
    } else {
        console.log("授权")
        $.post('/api/v2/lccbweb/userAuth/'+ CC.user.userId,{
            successUrl: window.location.href
        },function(res) {
            if(res.status ==0){
                ractive.set('action2', res.data);
                $("#form2").submit()
            }
            CccOk.create({
                msg: res.msg,
                okText: '确定',
                ok: function () {
                    window.location.reload();
                },
                cancel: function() {
                    window.location.reload();
                }
            });                    
        })
    }
    
});

function countDown() {
    $('.getcaptcha')
        .addClass('disabled');
    var previousText = '获取验证码';
    var msg = '$秒';

    var left = 120;
    interval = setInterval((function () {
        if (left > 0) {
            $('.getcaptcha')
                .html(msg.replace('$', left--));
        } else {
            $('.getcaptcha')
                .html(previousText);
            $('.getcaptcha')
                .removeClass('disabled');
            clearInterval(interval);
        }
    }), 1000);
}

function SeverName(){
    request('GET',"/api/v2/lccb/banks").end().
        then(function (r) {
            banks=[];
            banksList=r.body;
            for (var i in banksList) {
                name=banksList[i];
                banks.push({'name': name,'code': i});
                if(CC.user.bankCards.length>0 && i == CC.user.bankCards[0].account.bank) {
                    accountNames = name;
                }
            };
            ractive.set('accountName', accountNames)
            ractive.set('banks', banks);
            console.log(banks)
        });
}

function openBank(user){
    $.ajax({
        url: '/api/v2/lccbweb/bindCard/'+CC.user.id,
        type: "POST",
        data: user,
        async: false,
        success: function(res){
            if (res.status == 0) {
                ractive.set('action', res.data);
                $("#form1").submit()
                CccOk.create({
                    msg: "请求成功",
                    okText: '确定',
                    cancelText: '稍后再说',
                    ok: function () {                                    
                         window.location.reload();
                    },
                    cancel: function () {
                        window.location.reload();
                    },
                    close:function(){
                        window.location.reload();
                    }
                });
            } else {
                CccOk.create({
                    msg: "请求失败",
                    okText: '确定',
                    cancelText: '',
                    ok: function () {
                        window.location.reload();
                    },
                    cancel: function () {
                        window.location.reload();
                    },
                    close:function(){
                      window.location.reload();
                    },
                });
            }
        }
    })
}