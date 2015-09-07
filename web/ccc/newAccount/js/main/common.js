'use strict';

var navRactive = new Ractive({
	el: '.account-nav',
	template: require('ccc/newAccount/partials/nav.html'),
	data: {
		showInvestToggleMenu : false,
		showAccountToggleMenu : false
	},
	oninit: function () {
		var location = window.location.pathname.split('/');
		var tab = location[location.length-1];
		this.set(tab, true);
	}	
});
	
navRactive.on('toggleMenu', function (event) {
	var toggleMenu = event.node.getAttribute('data-toggle');
	this.set(toggleMenu, !this.get(toggleMenu));
});
