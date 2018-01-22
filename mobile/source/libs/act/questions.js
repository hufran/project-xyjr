/**
 * Created by Gloria on 2016/5/9.
 */
function goNext(obj,direction,loanDemand) {
    window.scrollTo(0,0);
    var i = $("#index").val()*1;
    var $ul = $("ul");
    var $li = $("ul li");
    var currentRadio = $li.eq(i).find('input:radio:checked');
    var sourcePage = location.href.indexOf("comeIn");

    if(currentRadio.length == 0 && direction == 1){
     alert("请选择！")
        return;
    }
    $("#index").val(i * 1 + direction);
    $li.eq(i).hide().end().eq(i * 1 + direction).show();
    if (i * 1 + direction == 0) {
        //返回到第一题
        if(loanDemand){
            $(".aButtons a").eq(0).hide();
        }else{
           $(".aButtons a").eq(0).html("跳过调查问卷"); 
        }
        
        $(obj).removeAttr("onclick").unbind("click");
        $(obj).bind("click", function () {
            var subStr = "token";
            var index = location.href.indexOf(subStr);
            if(index!=-1){
                funSurveyResults(3);
            }else{
                if(sourcePage != -1){
                    $(obj).attr("href","dashboard");
                }else{
                    $(obj).attr("href","loan/"+$("#loanId").val()+"/invest");
                }
            }
        })

    } else if (i * 1 + direction >= 9) {
        //最后一道题提交
        if(loanDemand){
            $(".aButtons a").eq(0).show();
        }
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
        //正常流程的上一步和下一步的转换
        if(loanDemand){
            $(".aButtons a").eq(0).show();
        }
        if (i * 1 + direction == 1 && direction == 1) {
            $(".aButtons a").eq(0).html("上一步");
            $(".aButtons a").eq(0).removeAttr("onclick").removeAttr("href").unbind("click");
            $(".aButtons a").eq(0).bind("click", function () {
                console.log("index:",i);
                if(i==0&&loanDemand){
                    goNext(this,-1,true)
                }else{
                    goNext(this,-1)
                }
                
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
        investType = "（二级）稳健型";
    }else if(mark>=24 && mark<=31){
        investType = "（三级）平衡型";
    }else if(mark>=32 && mark<=38){
        investType = "（四级）积极型";
    }else if(mark>=39 && mark<=45){
        investType = "（五级）激进型";
    }
    var subStr = "token";
    var index = location.href.indexOf(subStr);
    if(index==-1){
        var  tokenV = getCookie('ccat');
    }else{
        var tokenV = $("#isClientValue").val();
    };
    $.ajax({
        type: "POST",
        url: "/api/v2/users/userQuestion",
        data:{
            userId:userId,
            mark:mark,
            token:tokenV
        },
        success: function(data){
            if(data.status == 0){
                if(index!=-1){
                    //客户端需要监听到事件关闭页面
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
                //提交分数没有成功也要告知关闭页面
                alert(data.msg);
                if(index!=-1){
                    funSurveyResults(2)
                }
            }
        }
    });
}
//获取分数依据显示状态页面还是做题页面
function getMark(userId){
    //走这条线路的是个人中心的入口，或者是客户端入口的，在url中包含uid的
    var oldMark = "";
    var subStr = "token";
    var index = location.href.indexOf(subStr);
    var investType="";
    $.ajax({
        type: "POST",
        url: "/api/v2/users/userQuestion/getMark/"+userId,
        async:false,
        success: function(res){
            if(res.status == 0){
                if(res.data == null){
                    //用户不存在
                    alert(res.msg);
                }else if(res.data.point == null){
                    //用户存在没做过题目，没有分数
                }else{
                    //有分数
                    oldMark =res.data.point;
                    if(oldMark>=10 && oldMark<=16){
                        investType = "（一级）保守型";
                    }else if(oldMark>=17 && oldMark<=23){
                        investType = "（二级）稳健型";
                    }else if(oldMark>=24 && oldMark<=31){
                        investType = "（三级）平衡型";
                    }else if(oldMark>=32 && oldMark<=38){
                        investType = "（四级）积极型";
                    }else if(oldMark>=39 && oldMark<=45){
                        investType = "（五级）激进型";
                    }
                    //设置页面展示状态显示分数评估
                    if(index!=-1){
                        //客户端需要监听到事件关闭页面
                        $("#questions").hide();
                        $("#lastMark").html(investType);
                        $("#result").show();
                        $("#mark").val(oldMark);
                        funSurveyResults(4);
                    }else{
                        //h5端
                        $("#questions").hide();
                        $("#lastMark").html(investType);
                        $("#result").show();
                        $("#mark").val(oldMark);
                    }
                }
            }else{
                alert(res.msg);
                if(index!=-1){
                    funSurveyResults(2)
                }
            }
        }
    })
}
function ReEvaluation(loanDemand){
    $("#goHistory").val(1);
    var sourcePage = location.href.indexOf("comeIn");
    $("#formQues")[0].reset();
    $("#questionPage ul li").hide();
    var loanId = $("#loanId").val();
    $("#index").val("0");
    var aHref = "";
    if(sourcePage != -1){
        aHref = "dashboard"
    }else{
        if(loanId == ""){
            aHref = "loan/client"
        }else{
            aHref = "loan/"+loanId+"/invest";
        }
    }
    //提交过，充值跳过调查问卷，下一步，显示第一道题目，隐藏结果页面
    if(loanDemand){
        $(".aButtons").html('<a href="'+aHref+'" style="display:none;" onclick="igNore(3)">跳过调查问卷</a><a href="javascript:void(0)" onclick="goNext(this,1,true)">下一步</a><div class="clearBoth"></div>');
    }else{
        $(".aButtons").html('<a href="'+aHref+'" onclick="igNore(3)">跳过调查问卷</a><a href="javascript:void(0)" onclick="goNext(this,1,true)">下一步</a><div class="clearBoth"></div>');
    }
    $("#questionPage ul li").eq(0).show();
    $("#result").hide();
    $("#questions").show();
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function goBack(){
    var sourcePage = location.href.indexOf("comeIn");
    if($("#goHistory").val() == 1){
        $("#result").show();
        $("#questions").hide();
        $("#goHistory").val(0);
    }else{
        if(sourcePage != -1){
            window.location.href = "dashboard";
        }else {
            window.location.href = "loan/" + $("#loanId").val();
        }
    }
}
function refreshPage(){
    var subStr = "source";
    var index = location.href.indexOf(subStr);
    if(index!=-1){
        window.location.href = "loan/"+$("#loanId").val();
    }
}
function a(){
   // console.log(2)
    setTimeout("document.getElementById('batchForm').submit()",500)
}
