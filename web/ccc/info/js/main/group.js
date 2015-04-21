'use strict';
var $ = require('jquery');
$(".leader-photo li")
    .click(function () {
        var arrow_left = 458;
        var now_index = $(this)
            .index();
        $(".leader-detail li")
            .eq(now_index)
            .addClass('show')
            .siblings("li")
            .removeClass('show');
        arrow_left = arrow_left + now_index * 82;
        $(".group-arrow")
            .css("left", arrow_left + "px");
        $(this)
            .closest("li")
            .find("img")
            .addClass("no-shade");
        var other_img = $(this)
            .closest("li")
            .siblings("li")
            .find("img");
        other_img.removeClass("no-shade");
    });