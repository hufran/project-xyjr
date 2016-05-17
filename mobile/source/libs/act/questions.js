/**
 * Created by Gloria on 2016/5/9.
 */
function goNext(obj,direction) {
    window.scrollTo(0,0);
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
            var subStr = "token";
            var index = location.href.indexOf(subStr);
            if(index!=-1){
                funSurveyResults(3);
            }else{
                $(obj).attr("href","loan/"+$("#loanId").val()+"/invest");
            }
        })

    } else if (i * 1 + direction >= 9) {
        $(obj).removeAttr("onclick").unbind("click");
        $(".aButtons a").eq(1).html("提&nbsp;交");
        $(".aButtons a").eq(1).unbind("click").bind("click", function () {
            var currentRadio = $li.eq($("#index").val()).find('input:radio:checked');
            if(currentRadio.length == 0 && direction == 1){
                alert("请选择！")
                return;
            }else{
                submitForm();
            }
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
function igNore(argu){
    var subStr = "token";
    var index = location.href.indexOf(subStr);
    if(index!=-1){
        funSurveyResults(argu);
    }
}
function funSurveyResults(code){
    var priv = null;
    if(code == 1||code == 4){
        var priv = $("#mark").val();
    }
    var substr = "android";
    var index = location.href.indexOf(substr);
    if(index != -1){
        window.AndroidWebView.showCode(code,priv);
    }else{
        showCode(code,priv);
    }
}
function submitForm(){
    var userId = $("#userId").val();
    var investType = "";
    var mark = 0;
    for(var i=0;i<$("ul li input:checked").length;i++){
    mark += parseInt($("ul li input:checked").eq(i).val());
}
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
    var subStr = "token";
    var index = location.href.indexOf(subStr);
    $.ajax({
        type: "POST",
        url: "/api/v2/users/userQuestion",
        data:{
            userId:userId,
            mark:mark
        },
        success: function(data){
            if(data.status == 0){
                if(index!=-1){
                    $("#questions").hide();
                    $("#lastMark").html(investType);
                    $("#result").show();
                    $("#mark").val(mark);
                    funSurveyResults(4);
                }else{
                    $("#questions").hide();
                    $("#lastMark").html(investType);
                    $("#result").show();
                    $("#mark").val(mark);
                }
            }else{
                alert(data.msg);
                if(index!=-1){
                    funSurveyResults(2)
                }
            }
        }
    });
}
function ReEvaluation(){
    $("#formQues")[0].reset();
    $("#questionPage ul li").hide();
    var loanId = $("#loanId").val();
    $("#index").val("0");
    var aHref = "";
    if(loanId == ""){
        aHref = "loan/client"
    }else{
        aHref = "loan/"+loanId+"/invest";
    }
    //提交过
    $(".aButtons").html('<a href="'+aHref+'" onclick="igNore(3)">跳过调查问卷</a><a href="javascript:void(0)" onclick="goNext(this,1)">下一步</a><div class="clearBoth"></div>');
    $("#questionPage ul li").eq(0).show();
    $("#result").hide();
    $("#questions").show();
}
function goBack(){
    window.location.href = "loan/"+$("#loanId").val();
}
function refreshPage(){
    var subStr = "source";
    var index = location.href.indexOf(subStr);
    if(index!=-1){
        window.location.href = "loan/"+$("#loanId").val();
    }
}

