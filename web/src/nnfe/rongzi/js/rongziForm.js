jQuery(function(){
	var numLetter = /^[0-9a-zA-Z]*$/g;
	var phonenum= /^[0-9]*$/g;
	var companyNum=/\d{15}/;
	var email=/^\w+([-+.]\w+)*@\w+([-.]\w+)+$/i;

	//日期时间控件
	jQuery('#companyDate').datetimepicker({

		format:"Y-m-d",
		timepicker:false,
		todayButton:false
	});
	$.datetimepicker.setLocale('zh');

	inpBlurNoEmpty('#companyName','公司全称不能为空！');
	inpBlurNoEmpty('#userName','法人姓名不能为空！');
	
	jQuery('#userCode').blur(function(){
		if (jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			jQuery('#userCode').siblings('.tip').html('法人身份证不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,"").length!=18||numLetter.test(jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,""))=='false'){
			jQuery('#userCode').siblings('.tip').html('身份证输入错误！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('#userCode').siblings('.tip').addClass('hiddenrz');
		}
	})
	//inpBlur('#userCode','法人身份证不能为空！','身份证输入错误！');
	
	inpBlurNoEmpty('#companyAddress','公司地址不能为空！');
	inpBlurNoEmpty('#business','公司经营范围不能为空！');
	
	jQuery('#phoneNum').blur(function(){
		if (jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			jQuery('#phoneNum').siblings('.tip').html('联系电话不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"").length<8||jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"").length>12||phonenum.test(jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,""))=='false'){
			jQuery('#phoneNum').siblings('.tip').html('联系电话输入错误！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('#phoneNum').siblings('.tip').addClass('hiddenrz');
		}
	})

	jQuery('#email').blur(function(){
		if (jQuery('#email').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			jQuery('#email').siblings('.tip').html('电子邮箱不能为空！').removeClass('hiddenrz');
			return false;
		}else if (email.test(jQuery('#email').val().replace(/(^\s*)|(\s*$)/g,""))=='false'){
			jQuery('#email').siblings('.tip').html('电子邮箱输入错误！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('#email').siblings('.tip').addClass('hiddenrz');
		}
	})

	inpBlurNoEmpty('#companyDate','公司成立日期不能为空！');

	jQuery('#companyLicence').blur(function(){
		if (jQuery('#companyLicence').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			jQuery('#companyLicence').siblings('.tip').html('营业执照号码不能为空！').removeClass('hiddenrz');
			return false;
		}else if (companyNum.test(jQuery('#companyLicence').val().replace(/(^\s*)|(\s*$)/g,""))=='false'){
			jQuery('#companyLicence').siblings('.tip').html('营业执照编号输入错误！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('#companyLicence').siblings('.tip').addClass('hiddenrz');
		}
	})
	inpBlurNoEmpty('#companyIC','组织机构代码不能为空！');
	
	jQuery('.rongzi.step1 .nextStep').click(function(){
		if(jQuery('#companyName').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			jQuery('#companyName').siblings('.tip').html('公司全称不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#userName').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#companyName').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#companyName').siblings('.tip').addClass('hiddenrz');
			}

			jQuery('#userName').siblings('.tip').html('法人姓名不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#userName').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#userName').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#userCode').siblings('.tip').html('法人身份证不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,"").length!=18||numLetter.test(jQuery('#userCode').val().replace(/(^\s*)|(\s*$)/g,""))==false){
			jQuery('#userCode').siblings('.tip').html('身份证输入错误！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#companyAddress').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#userCode').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#userCode').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#companyAddress').siblings('.tip').html('公司地址不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#business').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#companyAddress').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#companyAddress').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#business').siblings('.tip').html('公司经营范围不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#business').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#business').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#phoneNum').siblings('.tip').html('联系电话不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"").length<8||jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,"").length>12||phonenum.test(jQuery('#phoneNum').val().replace(/(^\s*)|(\s*$)/g,""))==false){
			jQuery('#phoneNum').siblings('.tip').html('联系电话输入错误！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#email').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#phoneNum').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#phoneNum').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#email').siblings('.tip').html('电子邮箱不能为空！').removeClass('hiddenrz');
			return false;
		}else if (email.test(jQuery('#email').val().replace(/(^\s*)|(\s*$)/g,""))==false){
			jQuery('#email').siblings('.tip').html('电子邮箱输入错误！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#companyDate').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#email').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#email').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#companyDate').siblings('.tip').html('公司成立日期不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#companyLicence').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#companyDate').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#companyDate').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#companyLicence').siblings('.tip').html('营业执照号码不能为空！').removeClass('hiddenrz');
			return false;
		}else if (companyNum.test(jQuery('#companyLicence').val().replace(/(^\s*)|(\s*$)/g,""))==false){
			jQuery('#companyLicence').siblings('.tip').html('营业执照编号输入错误！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#companyIC').val().replace(/(^\s*)|(\s*$)/g,"")==''){
			if(jQuery('#companyLicence').siblings('.tip').hasClass('hiddenrz')==false){
				jQuery('#companyLicence').siblings('.tip').addClass('hiddenrz');
			}
			jQuery('#companyIC').siblings('.tip').html('组织机构代码不能为空！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('.rongzi.step1').addClass('hide');
		  	jQuery('.rongzi.step2').removeClass('hide');
		}
	})
	
	inpBlurNoEmpty('#rongziMoney','融资金额不能为空！');
	inpBlurNoEmpty('#rongziTime','融资期限不能为空！');
	inpBlurNoEmpty('#rongziUse','融资用途不能为空！');
	jQuery('.rongzi.step2 .nextStep').click(function(){
		if (jQuery('#rongziMoney').val().replace(/(^\s*)|(\s*$)/g,"")=='') {
			jQuery('#rongziMoney').siblings('.tip').html('融资金额不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#rongziTime').val().replace(/(^\s*)|(\s*$)/g,"")=='') {
			jQuery('#rongziTime').siblings('.tip').html('融资期限不能为空！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#APYstart').val().replace(/(^\s*)|(\s*$)/g,"")==''||jQuery('#APYend').val().replace(/(^\s*)|(\s*$)/g,"")=='') {
			jQuery('#APY').siblings('.tip').html('年化利率不能为空！').removeClass('hiddenrz');
			return false;
		}else if (parseInt(jQuery('#APYstart').val().replace(/(^\s*)|(\s*$)/g,""))>parseInt(jQuery('#APYend').val().replace(/(^\s*)|(\s*$)/g,""))) {
			jQuery('#APY').siblings('.tip').html('年化利率区间输入有误！').removeClass('hiddenrz');
			return false;
		}else if (jQuery('#rongziUse').val().replace(/(^\s*)|(\s*$)/g,"")=='') {
			jQuery('#rongziUse').siblings('.tip').html('融资用途不能为空！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('.rongzi.step2').addClass('hide');
		  	jQuery('.rongzi.step3').removeClass('hide');
		}
	})
	inpBlurNoEmpty('#assureInf','担保情况介绍不为空！');
	
	jQuery('.rongzi.step3 .nextStep').click(function(){
		if (jQuery('#assureInf').val().replace(/(^\s*)|(\s*$)/g,"")=='') {
			jQuery('#assureInf').siblings('.tip').html('担保情况介绍不为空！').removeClass('hiddenrz');
			return false;
		}else{
			jQuery('.rongzi.step3').addClass('hide');
		  	jQuery('.rongzi.step4').removeClass('hide');
		}
	})
})

function inpBlurNoEmpty(idName,text){
	jQuery(idName).blur(function(){
		if(jQuery(idName).val().replace(/(^\s*)|(\s*$)/g,"")==''){
				jQuery(idName).siblings('.tip').html(text).removeClass('hiddenrz');
				return false;
			}else{
			jQuery(idName).siblings('.tip').html(text).addClass('hiddenrz');
		}
	})
}
