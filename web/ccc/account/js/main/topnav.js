'use strict';
var accountService = require('ccc/account/js/main/service/account').accountService;
require('ccc/global/js/modules/tooltip');
var Box = require('ccc/global/js/modules/cccBox');
var Confirm = require('ccc/global/js/modules/cccConfirm');

$('ul.info li')
    .tooltip({
        placement: 'top',
        container: $('.info-tooltip-container')
    });




 accountService.getUserInfo(function (res) {
     if(!res.user){
         res.user={};
         res.user.name='';}
    new Ractive({
    el: ".username",
    template:'{{#if !name}}{{user.loginName}}{{else}}{{name}}{{/if}}', 
    data: {
       name:res.user.name
    }
});
     
 accountService.getTotalInters(function (res) {
    new Ractive({
    el: ".integration",
    template:'{{#if !interTotal}}0{{else}}{{interTotal}}{{/if}}', 
    data: {
       interTotal:res
    }
});
 });
     
     
     
     
     
     if (!res.user.name) {
    var isEnterprise = CC.user.enterprise;
    var url = isEnterprise ? '/payment/corp_account/open' : '/payment/account/open';
    var tpl = require('ccc/account/partials/paymentNotice.html');
    new Box({
        title: '开户提示', 
        value: tpl.replace('$url', url),
        name:CC.user.loginName,
        cla: 'corp-account-wrap',
        showed: function (ele, box) {
            $(ele).find('.btn-sm').click(function(){
                box.hide();
                Confirm.create({
                    msg: '三方账户是否开通成功？',
                    okText: '开通成功',
                    cancelText: '开通失败',
                    ok: function () {
                        window.location.href = "/";
                    },
                    cancel: function () {
                        window.location.reload();
                    }
                });
            });
        }
    });
}
     
     
     
     
     
        });
