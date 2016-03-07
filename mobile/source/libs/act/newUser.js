
jQuery(function(){
		tclone();
		var t1 = window.setInterval(gundong,1000); 
})
function gundong(){
	var slideHeight = jQuery('.sider').height();
	var maxH = slideHeight*4;

	var imgH1=parseInt(jQuery('.sider img').eq(0).css('top'));
	var imgH2=parseInt(jQuery('.sider img').eq(1).css('top'));
	if (imgH1>-maxH) {
		jQuery('.sider img').animate({top: '-='+slideHeight},500);
	}else if(imgH1<=-maxH){
			tclone();
			jQuery('.sider img').eq(0).remove();
	}
}
function tclone(){
	jQuery('<img src="assets/image/act/sider.png">').appendTo('.sider');

	jQuery('.sider img').eq(1).css('top','0px');
	
}