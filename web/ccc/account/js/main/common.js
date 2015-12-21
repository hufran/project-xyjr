'use strict';
var accountService = require('ccc/account/js/main/service/account').accountService;

var navRactive = new Ractive({
    el: '#navContainer',
    template: require('ccc/account/partials/nav.html'),
    oninit: function () {
    	var self= this,currentTab;
    	var location = window.location.pathname.split('/');
        if (location.length > 3) {
            currentTab = location[location.length - 2];
        } else {
            currentTab = location[location.length -1];
        }

    	self.set('currentTab', currentTab);
    }
});

var accountInfoRactive = new Ractive({
    el: '.account-info',
    template: require('ccc/account/partials/info.html'),
    data: {
      availableAmount: CC.user.availableAmount
    },
    oninit: function () {
    	var self = this;
    	//用户信息
    	accountService.getUserInfo(function (r) {
    		self.set('userInfo', r.user);
    	});
    	//实名
    	accountService.getAuthentication(function (r) {
        if (!r.serviceError) {
          self.set('idauthenticated', r.data.idauthenticated);
          self.set('emailAuthenticated', r.data.emailAuthenticated);
        } 
    	});
    }
});
