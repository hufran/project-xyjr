var Box = require('ccc/global/js/modules/cccBox');
var tpl = require('ccc/global/partials/modules/cccMessage.html');
var utils = require('ccc/global/js/lib/utils');

function CccMeassage(options) {

    // defaults
    var defaults = {
        title: '请输入短信验证码',
        tpl: tpl,
        width: 400,
        height: 170,
        overlay: false,
        msg: '确定要这么做？',
        complete: function() {},
        okText: '确定',
        cancelText: '取消',
        ok: function() {},
        cancel: function() {},
        close:function(){},
        debug: false,
        test: '123'
    };

    var config = {};
    $.extend(config, defaults, options);

    if (config.debug) {
        console.log('debug:cccConfirm:config', config);
    }

    var before = function() {
        config.tpl = config.tpl.replace('{{okText}}', config.okText);
        config.tpl = config.tpl.replace('{{msg}}', config.msg);
        config.tpl = config.tpl.replace('{{test}}', config.test);
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
                    utils.formValidator.checkSmsCaptcha($(ele).find('.msmcaptcha').value,function(err,msgg){
                        if (!err) {
                            $(ele).find('.errMess')
                                .html('验证码错误');
                            return false;
                        }
                        
                    })
                    config.ok($(this), ele, box);
                });
                

                $(ele).prev().find('.close').on('click',function(){

                    config.close($(this), ele, box);
                });
                // click cancel
                $(ele).find('.btn-confirm-cancel').on('click', function(){
                    config.cancel($(this), ele, box);
                    box.hide();
                });

                //getCaptcha
                $(ele).find('.getcaptcha').on('click', function() {
                    console.log('获取验证码')
                    var $captchaBtn = $(ele).find(".getcaptcha");
                    if ($captchaBtn.hasClass('disabled')) {
                        return;
                    }
                    countDown()
                })

                config.complete(ele, box);
                function countDown() {
                    $(ele).find('.getcaptcha')
                        .addClass('disabled');
                    var previousText = '获取验证码';
                    var mssg = '$秒后重新发送';

                    var left = 60;
                    var interval = setInterval((function () {
                        if (left > 0) {
                            $(ele).find('.getcaptcha')
                                .html(mssg.replace('$', left--));
                        } else {
                            $(ele).find('.getcaptcha')
                                .html(previousText);
                            $(ele).find('.getcaptcha')
                                .removeClass('disabled');
                            clearInterval(interval);
                        }
                    }), 1000);
                }
            }
        });
    };



    initialize.call(this);
}

module.exports.create = function(options) {
    CccMeassage(options);
};