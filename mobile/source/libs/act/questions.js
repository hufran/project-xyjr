/**
 * Created by Gloria on 2016/5/9.
 */
function goNext(obj,direction) {
    var i = $("#index").val()*1;
    var $ul = $("ul");
    var $li = $("ul li");
    var currentRadio = $li.eq(i).find('input:radio:checked');
    if(currentRadio.length == 0 && direction == 1){
     alert("请选择！")
        return;
    }
    $("#index").val(i * 1 + direction);
    $li.eq(i).hide().end().eq(i * 1 + direction).show();
    if (i * 1 + direction == 0) {
        $(".aButtons a").eq(0).html("跳过调查问卷");
        $(obj).removeAttr("onclick").unbind("click");
        $(obj).bind("click", function () {
            $(obj).attr("href","loan/"+$("#loanId").val())
        })
    } else if (i * 1 + direction >= 9) {
        $(obj).removeAttr("onclick").unbind("click");
        $(".aButtons a").eq(1).html("提&nbsp;交");
        $(obj).bind("click", function () {
            //alert("提交ing！");
            submitForm();
        })
    } else {
        if (i * 1 + direction == 1 && direction == 1) {
            $(".aButtons a").eq(0).html("上一步");
            $(".aButtons a").eq(0).removeAttr("onclick").removeAttr("href").unbind("click");
            $(".aButtons a").eq(0).bind("click", function () {
                goNext(this,-1)
            });
        }
        if (i == 9) {
            $(".aButtons a").eq(1).html("下一步");
            //绑定事件
            $(".aButtons a").eq(1).unbind("click").bind("click", function () {
                goNext(this, 1)
            })
        }
    }
}
function igNore(){
    $("#backUrl").click();
}
function submitForm(){
   //? $("#form1").submit();
   // caculateMark();
    var mark1 = formQues.ques1.value;
    var mark2 = formQues.ques2.value;
    var mark3 = formQues.ques3.value;
    var mark4 = formQues.ques4.value;
    var mark5 = formQues.ques5.value;
    var userId = $("#userId").val();
    var investType = "";
    //if(userId == ""){
    //    window.location.href = "/login";;
    //}else{
    //
    //}

    var mark = formQues.ques1.value*1 +formQues.ques2.value*1 +formQues.ques3.value*1 +formQues.ques4.value*1 +formQues.ques5.value*1 +
        formQues.ques6.value*1 +formQues.ques7.value*1 +formQues.ques8.value*1 +formQues.ques9.value*1 +formQues.ques10.value*1;
    if(mark>=10 && mark<=16){
        investType = "（一级）保守型";
    }else if(mark>=17 && mark<=23){
        investType = "（二级）中庸保守型";
    }else if(mark>=24 && mark<=31){
        investType = "（三级）中庸型";
    }else if(mark>=32 && mark<=38){
        investType = "（四级）中庸进取型";
    }else if(mark>=39 && mark<=45){
        investType = "（五级）进取型";
    }
    $.ajax({
        type: "POST",
        url: "/api/v2/users/userQuestion",
        data: "userId="+userId+"&mark="+mark,
        success: function(data){
            //alert(data.status)
            if(data.status == 0){
                //alert("提交成功！");
                $("#questions").hide();
                $("#lastMark").html(investType);
                $("#result").show();
            }else{
                alert(data.msg)
            }
        }
    });
}
function ReEvaluation(){
    $("#formQues")[0].reset();
    $("#questionPage ul li").hide();
    var loanId = $("#loanId").val();
    var aHref = "";
    if(loanId == ""){
        aHref = "loan/client"
    }else{
        aHref = "loan/"+loanId+"/invest";
    }
    $(".aButtons").html('<a href="'+aHref+'" onclick="igNore()">跳过调查问卷</a><a href="javascript:void(0)" onclick="goNext(this,1)">下一步</a><div class="clearBoth"></div>');
    $("#questionPage ul li").eq(0).show();
    $("#result").hide();
    $("#questions").show();
}