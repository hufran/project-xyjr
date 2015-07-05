'use strict';

var utils = require('ccc/global/js/lib/utils');
var Tips = require('ccc/global/js/modules/cccTips');
require('ccc/global/js/modules/cccTab');

var inviteTpl = require('ccc/account/partials/invite.html');

var inviteRactive = new Ractive({
    el: '.invite-wrap',
    template: inviteTpl,
    data: {
        inviteUrl: 'http://' + window.location.host + '/register?referral=' + CC.user.mobile
    }
})

ZeroClipboard.config({swfPath: '/ccc/global/img/ZeroClipboard.swf'});
var client = new ZeroClipboard(document.getElementById("copy-button"));

client.on("ready", function( readyEvent ) {
  client.on("aftercopy", function( event ) {
    alert("复制成功！");
  });
});



