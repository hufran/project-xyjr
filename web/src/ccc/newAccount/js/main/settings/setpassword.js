"use strict";
var resetPasswordRactive = new Ractive({
    el: '#ractive-container',
    template: require('ccc/newAccount/partials/settings/setpassword.html'),
    data: {
    }
});
resetPasswordRactive.on('setPassword', function (){
    if(resetPasswordRactive.get('password') != resetPasswordRactive.get('repassword')){
        alert('两次密码不一致');
        return;
    }
    if(resetPasswordRactive.get('password').length < 6) {
        alert('密码应大于等于6位')
        return;
    }
    request('POST', '/api/v2/resetPassword', {
        body: {
            mobile: CC.mobile,
            newPassword: resetPasswordRactive.get('password')
        }
    }).get('body').then(function (r) {
        if(r.success) {
            alert('密码设置成功')
            request('/quickLogin/' + CC.mobile + '/' + CC.currentTime + '/' + CC.md5key).get('body').then(function (r){
                window.location.href = '/';
            })
        }else {
            alert(r.error.message);
            window.location.href = '/';
        }
    })
})