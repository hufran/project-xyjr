'use strict';

var accountService = require('ccc/account/js/main/service/account')
    .accountService;
var template = require('ccc/account/partials/autobid/autobid.html');
var utils = require('ccc/global/js/lib/utils');

var feedbackRactive = new Ractive({
    el: '.autobid-ractive-container',
    template: template,
    data: {
        captcha: {
            img: '',
            token: ''
        },
        user: {
            advice: '',
            mobile: ''
        },
        errors: {
            msg: '',
            visible: 'false'
        }
    }
});

