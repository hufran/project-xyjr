'use strict';

//var $ = require('jquery');
require('bootstrap/js/tab');


request.get('/api/v2/cms/category/INTRODUCTION/name/奇乐融简介')
            .end()
            .then(function (res) {
                console.log(res);
            });


$('.arrow').on('click', function () {
    $(this).children("i").toggleClass('glyphicon-chevron-right');
    $(this).children("i").toggleClass('glyphicon-chevron-down');  
    $('.content').toggle(); 
});

//var articles = {
//    'common':[
//        {
//            'title':'• 中融钱邦是什么？',
//            'content': '中融钱邦（www.zrqb.com），专业的供应链金融服务与理财平台，是由中融博弘互联网科技（北京）有限公司运营的互联网金融 P2B 平台。平台以信息撮合为核心，一端对接有投资理财需求的各类理财者，提供安全、便捷、收益可观的理财产品，一端对接核心企业供应链不同节点的实力企业，提供专业、便捷、高效的融资渠道，推动直接融资，践行普惠金融，助力中国实体经济的发展。'
//        }
//    ]
//};

//var articleRactive = new Ractive({
//   el:$(".invest-wrapper"),
////    template: require('/partials/content.html'),
//    data: {
//        article: articles['common']
//    }
//});

var $preArrow = null;
$('.question-title').on('click', function () {

    var $this = $(this);
    var $wp = $this.parents("div.each-question");
    var $arrow = $wp.find('span');
    var klass = 'opened';
    var right = 'glyphicon-menu-right';
    var down = 'glyphicon-menu-down';

    if ($preArrow) {
        $preArrow.removeClass(down).addClass(right);
    }
    $preArrow = $arrow;

    if ($wp.hasClass(klass)) {
        $wp.removeClass(klass);
        $arrow.removeClass(down).addClass(right);
    } else {
        $('.each-question').removeClass(klass);
        $wp.addClass(klass);
        $arrow.removeClass(right).addClass(down);
    }
});

var hash = location.hash;

// 自动展开三方账户
if (hash === '#paymentAccount') {
    var $wp = $('.each-question');
    $wp.eq($wp.length - 1).addClass('opened');
}

$(".article-content p").hide()
$(".article-content p").ready(function(){
  $(".each-question").click(function(){
  $(".opened .article-content p").toggle();
  });
});


//$(".article-content p").hide()
//$(".question-title").click(function(){
//    $(".article-content p").toggle(function(){
//         $(".article-content p").hide();
//       },function(){
//         $(".article-content p").show();
//       });
//});
