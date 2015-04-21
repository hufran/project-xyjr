/**
 * @file 点击查看大图的交互逻辑层
 * @author lilulu(lilulu@hanhua.com)
 */

"use strict";
var Ractive = require('ractive/ractive-legacy');
var $ = require('jquery');

exports.popupBigPic = {
    instance: false,
    init: function () {

        this.popupBigPicRactive = new Ractive({
            el: '#big-pic-container',
            template: require('ccc/loan/partials/bigPic.html'),            
            data: {
                visible: false,
                imgs: [],
                currentIndex: 0,
                selectorsMarginLeft: 0,
                stageLen: 5,
                imgLen:0
            }
        });

        var popupBigPicRactive = this.popupBigPicRactive;

        popupBigPicRactive.on('end-big-pic', function () {
            this.set('visible', false);
            $(".mask-layer")
            .hide();            
        });                
    
        // 大图浏览时切换
        var timer;
        popupBigPicRactive.on("prev-big next-big", function (e) {

            if (e.name === "prev-big") {
                this.set("currentIndex", this.get("currentIndex") - 1);
            } else {
                this.set("currentIndex", this.get("currentIndex") + 1);
            }

            if (timer) {
                clearTimeout(timer);
            }

            // 定时隐藏
            this.set("showTip", true);
            timer = setTimeout(function () {
                relateDataRactive.set("showTip", false);
            }, 1000);

            return false;
        });
    },

    show: function (options,postCloseHook) {
        if (!this.instance) {
            this.init();
            this.instance = true;
        }
        if (typeof postCloseHook === 'function') {
            var listener = this.popupBigPicRactive.on(
                'close', function () {
                    postCloseHook();
                    listener.cancel();
                });
        }
        this.popupBigPicRactive.set('visible', true);
        this.popupBigPicRactive.set('currentIndex', options.index || this.popupBigPicRactive.get('currentIndex'));
        this.popupBigPicRactive.set('imgs', options.imgs || this.popupBigPicRactive.get('imgs'));
        $(".mask-layer")
            .show();
    }        
};