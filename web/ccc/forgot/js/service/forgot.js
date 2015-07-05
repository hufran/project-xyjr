'use strict';

exports.forgotService = {
    doReset: function (user, next) {
        request.post('/api/v2/auth/reset_password?captcha_token=' + user.token + '&captcha_answer='+ user.captcha, {
            body: user
        }).then(function (res) {
            if (res.body.success) {
                next(true, null);
            } else {
                next(false, res.body.error[0].message);
            }
        });
    }
};
