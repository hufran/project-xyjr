var Box = require('ccc/global/js/modules/cccBox');
var tpl = require('ccc/global/partials/payedBefore.html');

function payedBefore(options) {

    // defaults
    var defaults = {
        title: '提前还款',
        tpl: tpl,
        width: 500,
        height: 300,
        overlay: false,
        msg: '提前还款模板tpl',
        complete: function() {},
        okText: '提前还款',
        ok: function() {},
        close:function(){},
        debug: false,
    };

    var config = {};
    $.extend(config, defaults, options);

    if (config.debug) {
        console.log('debug:cccConfirm:config', config);
    }

    var before = function() {
        config.tpl = config.tpl.replace('{{amount1}}', config.amount1);
        config.tpl = config.tpl.replace('{{amount2}}', config.amount2);
        config.tpl = config.tpl.replace('{{amount3}}', config.amount3);
        config.tpl = config.tpl.replace('{{amount4}}', config.amount4);
        config.tpl = config.tpl.replace('{{amount5}}', config.amount5);
        config.tpl = config.tpl.replace('{{amount6}}', config.amount6);
        config.tpl = config.tpl.replace('{{amount7}}', config.amount7);
        config.tpl = config.tpl.replace('{{date}}', config.date);
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
                

                $(ele).prev().find('.close').on('click',function(){

                    config.close($(this), ele, box);
                });               

                config.complete(ele, box);
            }
        });
    };



    initialize.call(this);
}

module.exports.create = function(options) {
    payedBefore(options);
};
