'use strict';
var $ = require('jquery');
$(".arrow").click(function(){ 
    var active_index = $(".step-wrapper").find(".active").index();       
    var next_index = 0;
    var max_index = $(".step-wrapper li").length - 1;
    if($(this).attr("id") === "arrow-left"){        
        next_index = active_index - 1;
    } else {
        next_index = active_index + 1;
    }    
    if( next_index < 0 ){
        next_index = 0;
    }    
    if( next_index > max_index ){
        next_index = max_index;
    }
    $($(".step-wrapper li")[next_index]).addClass("active").siblings().removeClass("active");
});
