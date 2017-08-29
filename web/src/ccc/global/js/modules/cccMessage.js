var Box = require('ccc/global/js/modules/cccBox');
var tpl = require('ccc/global/partials/modules/cccMessage.html');

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
        phone: '123'
    };

    var config = {};
    $.extend(config, defaults, options);

    if (config.debug) {
        console.log('debug:cccConfirm:config', config);
    }

    var before = function() {
        config.tpl = config.tpl.replace('{{okText}}', config.okText);
        config.tpl = config.tpl.replace('{{msg}}', config.msg);
        config.tpl = config.tpl.replace('{{phone}}', config.phone);
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
                var data;
                $(ele).find('.btn-confirm-ok').on('click', function(){                    
                    var msmcaptcha = $(ele).find('.msmcaptcha').val();
                    if(!/^\d{6}$/.test(msmcaptcha)) {
                        $(ele).find('.errMess')
                                .html('验证码错误');
                            return false;
                    } else {
                        config.ok($(this), ele, box, data, msmcaptcha);
                    }                                      
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
                    $.post('/api/v2/lccb/sendMsg/' + CC.user.userId, {
                            transtype: config.transtype,
                            cardnbr: CC.user.bankCards[0].account.account
                        }, function(res) {
                            if(res.status == 0) {
                                data = res.data;
                                countDown();
                            }else{
                                $(ele).find('.errMess')
                                .html('发送失败');
                            return false;
                            }
                        })
                    
                })

                config.complete(ele, box);
                function countDown() {
                    $(ele).find('.getcaptcha')
                        .addClass('disabled');
                    var previousText = '获取验证码';
                    var mssg = '$秒';

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