'use strict';
var accountService = require('ccc/account/js/main/service/account').accountService;
require('ccc/global/js/modules/tooltip');

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
        });
