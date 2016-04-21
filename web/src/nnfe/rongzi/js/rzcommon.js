$.get("/project-xyjr/web/src/nnfe/global/header.html",function(data){
		$(".header").html(data);
	});
$.get("/project-xyjr/web/src/nnfe/global/footer.html",function(data){
	$(".footer").html(data);
});

//融资跳转
// function nextStep(stepPre,stepNext){
// 	var red=jQuery(stepPre+' .red');
// 	if (red.parent('.label').siblings('input').val()==false||red.parent('.label').siblings('select').val()==false||red.parent('.label').siblings('div input').val()==false) {
// 		alert('you wrong!');
// 	}else{
// 		stepPre.addClass('hide');
// 		stepNext.removeClass('hide');
// 	}
// }
function isInputVal(inpId){
	if (inpId.val()==undefined) {
		return false;
	}
}

jQuery(function(){
	jQuery('.rongzi.step1 .nextStep').click(function(){
		if(jQuery('#companyName').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			return false;
		}else if (jQuery('#userName').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			return false;
		}else if (jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			return false;
		}else if (jQuery('#companyAddress').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			return false;
		}else if (jQuery('#business').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			return false;
		}else{
			jQuery('.rongzi.step1').addClass('hide');
		  	jQuery('.rongzi.step2').removeClass('hide');
		}
			// isInputVal(jQuery('#companyName'));
			// isInputVal(jQuery('#userName'));
			// isInputVal(jQuery('#userCode'));
			// isInputVal(jQuery('#companyAddress'));
			// isInputVal(jQuery('#business'));
			// isInputVal(jQuery('#phoneNum'));

			
			// alert(jQuery(this).attr('for'));
			
			// if (jQuery(this).siblings('input').val()==false) {
			// 	alert('you wrong!');
			// }
			// else if(jQuery(this).siblings('select').val()==false){
			// 	alert('you wrong!');
			// }
			// else if(jQuery(this).siblings('div input').val()==false){
			// 	alert('you wrong!');
			// }
			// else{
			// 	jQuery('.rongzi.step1').addClass('hide');
			// 	jQuery('.rongzi.step2').removeClass('hide');
			// }

		// alert(jQuery('.rongzi.step1 .red').parent('.label').siblings('input').attr('id'));
		// if (jQuery('.rongzi.step1 .red').parent('.label').siblings('input').val()==false||jQuery('.rongzi.step1 .red').parent('.label').siblings('select').val()==false||jQuery('.rongzi.step1 .red').parent('.label').siblings('div input').val()==false) {
		// 	alert('you wrong!');
		// }else{
		// 	jQuery('.rongzi.step1').addClass('hide');
		// 	jQuery('.rongzi.step2').removeClass('hide');
		// }
	})
	
	//nextStep('.rongzi.step1','.rongzi.step2');
})


