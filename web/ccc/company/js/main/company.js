'use strict';
var $ = require('jquery');
$(".licence-wrapper .arrow").click(function(){     
    var active_index = $(".licence-content").find(".show").index();       
    var next_index = 0;
    var max_index = $(".licence-content li").length - 1;
    if($(this).attr("id") == "left-arrow"){        
        next_index = active_index - 1;
    } else {
        next_index = active_index + 1;
    }
    console.log(next_index);
    if( next_index < 0 ){
        next_index = 0;
    }    
    if( next_index > max_index ){
        next_index = max_index;
    }
    $($(".licence-content li")[next_index]).addClass("show").siblings().removeClass("show");
});