'use strict';

var $ = global.jQuery = require('jquery');
var utils = require('assets/js/lib/utils');
var Ractive = require('ractive/ractive-legacy');
var Tips = require('assets/js/modules/cccTips');
require('assets/js/modules/cccTab');

var inviteTpl = require('ccc/account/partials/invite.html');

var inviteRactive = new Ractive({
    el: '.invite-wrap',
    template: inviteTpl,
    data: {
        inviteUrl: 'http://' + window.location.host + '/register?referral=' + CC.user.mobile
    }
})

ZeroClipboard.config({swfPath: '/assets/img/ZeroClipboard.swf'});
var client = new ZeroClipboard(document.getElementById("copy-button"));

client.on("ready", function( readyEvent ) {
  client.on("aftercopy", function( event ) {
    alert("复制成功！");
  });
});



