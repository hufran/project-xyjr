jQuery(function(){
	jQuery('.sider img').clone().appendTo('.sider');
	jQuery('.sider img').eq(1).css('top','275');
	
	function gundong(){
		var imgH1=parseInt(jQuery('.sider img').eq(0).css('top'));
		var imgH2=parseInt(jQuery('.sider img').eq(1).css('top'));
		if (imgH1>-275) {
			jQuery('.sider img').animate({top: '-=55'},500);
		}else if(imgH1==-275){
				jQuery('.sider img').eq(0).remove();
				jQuery('.sider img').clone().appendTo('.sider');
				jQuery('.sider img').eq(1).css('top','275');
			
		}
	}
		var t1 = window.setInterval(gundong,1000); 

	 
	
})