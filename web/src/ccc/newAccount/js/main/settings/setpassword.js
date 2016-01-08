"use strict";
var resetPasswordRactive = new Ractive({
    el: '#ractive-container',
    template: require('ccc/newAccount/partials/settings/setpassword.html'),
    data: {
    }
});
resetPasswordRactive.on('setPassword', function (){
    // /account/resetPassword
    if(resetPasswordRactive.get('password') != resetPasswordRactive.get('repassword')){
        alert('两次密码不一致');
        return;
    }
    request('/account/resetPassword', {
        body: {
            mobile: '',
            newPassword: resetPasswordRactive.get('password')
        }
    }).get('body').then(function () {

    })
})