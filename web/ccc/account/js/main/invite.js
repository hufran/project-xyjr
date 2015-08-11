'use strict';

var utils = require('ccc/global/js/lib/utils');
require('ccc/global/js/lib/ZeroClipboard');
require("ccc/global/js/lib/share");
var format = require('@ds/format');
var Tips = require('ccc/global/js/modules/cccTips');

CC.imgUrlS = $('#imgurls').attr('src');
CC.imgUrl = $('#imgurl').attr('src');
ZeroClipboard.moviePath = $('#ZeroClipboard-path').attr('src');

new Ractive({
    el: '.ccc-invite-wrap',
    template: require('ccc/account/partials/invite/wrap.html'),
    data: {
        host: CC.host,
        user: CC.user,
        mobile: CC.user.mobile,
        Fmobile: '',
        moment: moment,
        totalSize: 0,
        list: [],
        loading: true,
        addText: '继续推荐',
        add: false,
        msg: null
    },
    oninit: function () {
        this.getFmobile();
    },
    onrender: function () {
        var self = this;
        this.api = '/api/v2/user/MYSELF/invite';
        $.get(this.api, function (o) {
            o = o.success ? o.data : {
                results: [],
                totalSize: 0
            };
            self.set('totalSize', o.totalSize);
            self.set('list', self.parseData(o));
            self.set('loading', false);
        });
    },
    getFmobile: function () {
        var self = this;
        $.post('/api/v2/users/mobile/encrypt', {
            mobile: CC.user.mobile
        }, function (r) {
            if (r.success) {
                self.set('Fmobile', r.data);
                console.log(r.data);
            }
            self.bindActions();

        }).error(function () {
            self.bindActions();
        });

    },
    oncomplete: function () {

    },
    // buildImgUrl: function () {
    //     var self = this;
    //     var logo = 'http://' + CC.host + $('#er-img-url').attr('src');
    //     var text = 'http://' + CC.host + '/register?rel=' + self.get('Fmobile');;
    //     return 'http://qr.liantu.com/api.php?&bg=ffffff&fg=000000&logo=' + logo + '&text=' + text;
    // },
    parseData: function (r) {
        console.log(r);
        for (var i = 0; i < r.results.length; i++) {
            var o = r.results[i];
            r.results[i].user.registerDate = new Date(r.results[i].user.registerDate);
            r.results[i].user.registerDate = moment(r.results[i].user.registerDate).format('YYYY-MM-DD hh:mm:ss')
            r.results[i].user.loginName = format.mask(o.user.loginName);
            r.results[i].Fmobile = format.mask(o.user.mobile, 3, 4);
        }
        return r.results;
    },
    status: {
        ACTIVATED: '已注册',
        UNACTIVATED: '未注册',
        DELETED: '已作废'
    },
    bindActions: function () {
        var self = this;

        // 初始化二维码
        // console.log(this.buildImgUrl());
        // $('#er-img').replaceWith('<img style="width:200px;height:200px;" src="' + this.buildImgUrl() + '">');

        $(this.el).find("#btn-invite-copy").mouseover(function () {
            $("#invite-link").select();
        });
        $(this.el).find("#invite-link").mouseover(function () {
            $(this).select();
        });

        // click to copy
        var clip = new ZeroClipboard.Client();
        clip.setHandCursor(true);
        clip.setText($(this.el).find("#invite-link").val());
        clip.glue("btn-invite-copy");

        $("#invite-link").change(function () {
            clip.setText($("#invite-link").val());
            clip.glue("btn-invite-copy");
        });

        clip.addEventListener("complete", function () {
             alert('复制成功，快发给你的好友吧~');            
            Tips.create({
                obj: $('#btn-invite-copy'),
                width: 250,
                height: 63,
                callback: function (container) {
                    container.html('<p style="padding: 20px">复制成功，快发给你的好友吧~</p>');
                    setTimeout(function () {
                        $('.cc-tips-wp').remove();
                    }, 3000);
                }
            });
        });

        // share
        $('.invite-share').share({
            showIndex: [1, 2, 9, 3, 4, 8, 10, 14],
            liMargin: 15,
            bigImg: true,
            showFont: true,
            //imgUrl: '/assets/img/',
            share: [{
                title: 'twitter',
                click: 'twitter'
            }, {
                title: '新浪微薄',
                click: 'tsina'
            }, {
                title: 'qq微博',
                click: 'tqq'
            }, {
                title: '搜狐微博',
                click: 'tsohu'
            }, {
                title: '网易微博',
                click: 't163'
            }, {
                title: 'facebook',
                click: 'fbook'
            }, {
                title: '豆瓣',
                click: 'douban'
            }, {
                title: '人人网',
                click: 'renren'
            }, {
                title: '开心网',
                click: 'kaixin001'
            }, {
                title: 'Qzone',
                click: 'qzone'
            }, {
                title: '百度搜藏',
                click: 'baidu'
            }, {
                title: '鲜果',
                click: 'xianguo'
            }, {
                title: '抓虾',
                click: 'zhuaxia'
            }, {
                title: 'delicious',
                click: 'delicious'
            }, {
                title: 'qq书签',
                click: 'qq'
            }],
            url: $('.SHARE_URL').text(),
            content: $('.SHARE_TEXT').text()
        });
    }
});