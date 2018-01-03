var Box = require('ccc/global/js/modules/cccBox');
var tpl = require('ccc/global/partials/planlist.html');

function planlist(options) {

    // defaults
    var defaults = {
        title: '',
        tpl: tpl,
        width: 650,
        height: 200,
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
        config.tpl = config.tpl.replace('{{num}}', config.num);
        config.tpl = config.tpl.replace('{{amount}}', config.amount);
        config.tpl = config.tpl.replace('{{lixi}}', config.lixi);
        config.tpl = config.tpl.replace('{{guanlifei}}', config.guanlifei);
        config.tpl = config.tpl.replace('{{faxi}}', config.faxi);
        config.tpl = config.tpl.replace('{{jianmian}}', config.jianmian);
        config.tpl = config.tpl.replace('{{money}}', config.money);
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
    planlist(options);
};
