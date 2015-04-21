var $ = require('jquery');
var Box = require('assets/js/modules/cccBox');
var tpl = require('partials/modules/cccOk.html');

function CccOk(options) {
	
	// defaults
	var defaults = {
		title: '信息提示',
		tpl: tpl,
		width: 400,
		height: 180,
		overlay: false,
		msg: '确定要这么做？',
		complete: function() {},
		okText: '确定',
		cancelText: '取消',
		ok: function() {},
		cancel: function() {},
		debug: false,
	};
	
	var config = {};
	$.extend(config, defaults, options);
	
	if (config.debug) {
		console.log('debug:cccConfirm:config', config);
	}
	
	var before = function() {
		config.tpl = config.tpl.replace('{{okText}}', config.okText);
		config.tpl = config.tpl.replace('{{msg}}', config.msg);
	};
	
	var initialize = function() {
		
		// before init
		before();
		
		new Box({
			title: config.title,
			value: config.tpl,
			width: config.width,
			height: config.height,
			overlay: config.overlay,
			showed: function(ele, box) {
				// click ok
				$(ele).find('.btn-confirm-ok').on('click', function(){
					config.ok($(this), ele, box);
				});
				
				// click cancel
				$(ele).find('.btn-confirm-cancel').on('click', function(){
					config.cancel($(this), ele, box);
					box.hide();
				});
				
				config.complete(ele, box);
			}
		});
	};
	
	
	
	initialize.call(this);
}

module.exports.create = function(options) {
	CccOk(options);
};

