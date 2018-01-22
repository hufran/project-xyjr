
jQuery(function(){
		tclone();
		var t1 = window.setInterval(gundong,1500);
})
function gundong(){
	var slideHeight = jQuery('.sider').height();
	var maxH = slideHeight*4;
	var imgH1=parseInt(jQuery('.sider ul').eq(0).css('margin-top'));
	var imgH2=parseInt(jQuery('.sider ul').eq(1).css('margin-top'));
	if (imgH1>-maxH) {
		jQuery('.sider ul').animate({marginTop: '-='+slideHeight},500);
	}else if(imgH1<=-maxH){
		jQuery('<ul>' +
			'<li>新奥集团(港02688)</li>' +
			'<li>华夏幸福基业(600340)</li>' +
			'<li>庞大集团(601258)</li>' +
			'<li>荣盛(002146)</li>' +
			'<li>升达林业(002259)</li>' +
			'</ul>').appendTo('.sider');
			jQuery('.sider ul').eq(1).css('margin-top',slideHeight+'px');
			jQuery('.sider ul').animate({marginTop: '-='+slideHeight},500);

			jQuery('.sider ul').eq(0).remove();
	}
}
function tclone(){
	jQuery('<ul>' +
		'<li>新奥集团(港02688)</li>' +
		'<li>华夏幸福基业(600340)</li>' +
		'<li>庞大集团(601258)</li>' +
		'<li>荣盛(002146)</li>' +
		'<li>升达林业(002259)</li>' +
		'</ul>').appendTo('.sider');

	jQuery('.sider ul').eq(1).css('margin-top','0px');
	
}