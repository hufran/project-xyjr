jQuery(function(){
    jQuery('.nav div').click(function(){
        var clickName=jQuery(this).attr('class').substring(3,8) ;
        jQuery(this).addClass('active').siblings().removeClass('active');
        jQuery('.rongzi.'+clickName).removeClass('hide').siblings().addClass('hide');
    })

    jQuery('.falseBtn').click(function(){
        jQuery('.falseInf').removeClass('hide');
        jQuery('.closeBtn').click(function(){
            jQuery('.falseInf').addClass('hide');
        })
        jQuery('.bohuiCauseBtn').click(function(){
            if (jQuery('.falseText').val()==false) {
                alert('驳回原因不能为空');
            };
        })
    })

})