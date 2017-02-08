console.log(CC.user.id);
var tag = 0;
var timer1 = "";
var animal = true;
var num = "";
var count=0;
var prizeList = [];
var userId = CC.user.id;
$(document).ready(function(){
    //加载列表，加载可以抽奖次数，页面数据初始化
    initPage();
    setInterval('AutoScroll(".scroll")',3000)
})
//初始化页面的数据
function initPage(){
//抽奖列表和次数
        $.ajax({
            url: "http://10.4.33.251/show/rest/userLottery/showLottery/"+userId,
            cache: false,
            success: function(d){
                if(d.status == 0){
                    count = d.data.count;
                    prizeList = d.data.userLotteryList;
                    initDatas(count,prizeList);
                }
            }
        });
}
//开始抽奖
function start(){
    if(count <= 0){
        alert("抽奖次数已用完！");
    }
    if(animal && count>0){
        var activeIndex = $(".active").attr("id");
        if(activeIndex == undefined){
            tag = -1;
        }else{
            //获取最后一位
            tag = activeIndex.substr(activeIndex.length-1,1);
        }
        //循环开始
        timer1 = setInterval("changeStyle()",100);
        //请求后台获奖情况
        $.ajax({
            url: "http://10.4.33.251/show/rest/userLottery/draw/"+userId,
            cache: false,
            success: function(d){
                if(d.status == 0){
                //console.log(d.data)
                    num = d.data.prize;
                    count = d.data.count;
                    prizeList = d.data.userLotteryList;
                    setTimeout("zanting("+num+")",3000);
                }
            }
        });
    }else{
        //正在抽奖，不做处理
    }
}
//等待ajax返回数据，确定了哪个是中奖号码，再暂停
//num是中奖的id，切换timer2，速度降低，最后到num那个提示中奖号码,自动停止
function zanting(num){
    clearInterval(timer1);
    var activeIndex = $(".active").attr("id");
    tag = activeIndex.substr(activeIndex.length-1,1)*1;
    var tmp = tag;
    //固定次数测循环
    var timesRun = 0;
    var interval = setInterval(function(){
        timesRun += 1;
        console.log(timesRun+"---"+(num+8-tmp));
        if(timesRun == num+8-tmp){
            clearInterval(interval);
            animal = true;
            var priseName  = $("#prise-"+num).html();
            setTimeout("alert('恭喜您抽中"+priseName+"')",600);
        }
        console.log(tag);
        $("ul.abc li").removeClass("active");
        tag = tag*1+1;
        if(tag >= 8){
            tag = 0
        }
        $("#prise-"+tag).addClass("active");
    }, 500);
//修改可抽奖次数,充值中奖列表，并设置抽奖按钮是否可用
    initDatas(count,prizeList);

}
//初始化以及抽奖完成数据相关更新
function initDatas(times,list){
    //times === d.data.count
    //list === d.data.userLotteryList;
    $("#prizeTimes").html(times);
    var $li = "";
    var tmpName = "";
    for(var i = 0;i<list.length;i++){
        tmpName = list[i].prize;
        $li += '<li><div>'+list[i].mobile+ '</div><div>'+list[i].time+'</div><div>抽到'+$("#prise-"+tmpName).html()+'</div></li>';
    }
    $(".scroll").html($li);
}
//抽奖动作循环执行的方法
function changeStyle(){
    animal = false;
    $("ul.abc li").removeClass("active");
    tag = tag*1+1;
    if(tag >= 8){
        tag = 0
    }
    $("#prise-"+tag).addClass("active");
}
//公告简单滚动
function AutoScroll(obj){
    $(obj).animate({
        marginTop:(parseInt($(obj).css("marginTop"))-30)+"px"
    },1000,function(){
        $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
    });
}
//0-7的随机数获取，临时测试用
function randomM(){
    return Math.floor(Math.random()*8);
}