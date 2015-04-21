'use strict';
var $ = require('jquery');
$("#help-right dd").click(function(){
    if( !$(this).hasClass("curr") ){
        $(this).addClass("curr");
        $(this).siblings("dt").show();
        var other_dl = $(this).closest("dl").siblings("dl");
        other_dl.find("dd").removeClass("curr");
        other_dl.find("dt").hide();
    } else {
        $(this).removeClass("curr");
        $(this).siblings("dt").hide();
    }
    
});