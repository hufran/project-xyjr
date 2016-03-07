jQuery(function(){
	
	function gundong(){
		var imgH=parseInt(jQuery('.sider img').css('top'));
		if (imgH>-220) {
			jQuery('.sider img').animate({top: '-=55'},500);
		}else if (imgH==-220){
			jQuery('.sider img').animate({top: '-=55'},0,function(){
				jQuery('.sider img').css('top',0);
			})
		};
	}
	var t1 = window.setInterval(gundong,1000); 
	
})