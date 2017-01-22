//var wxChatUrl = "http://10.4.33.251/xyjrpc";
var wxChatUrl = "http://www.718bank.com/xyjrpc";
function GetRequest(item) {
	var indexq = window.location.href.indexOf("?");
	if(indexq!=-1){
		var url = window.location.href.substr(indexq);
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest[item];
	}else{
		return "";
	}
}



function selectTab(index,obj,id){
	jQuery("ul.tabs li").removeClass("active").eq(index).addClass("active");
	jQuery("#tabContent section").removeClass("show").eq(index).addClass("show");
	loadCoupon(index,id);
}
function loadCoupon(index,id){
	var type = "";	
	if(index == 0){
		type ="REBATE";
	}
	if(index == 1){
		type ="PRINCIPAL";
	}
	if(index == 2){
		type="INTEREST";
	}
	$.ajax({
	   type: "POST",	
	   url: "/api/v2/rebateCounpon/listUserCouponPlacementByCond/"+id,	
	   data: "type="+type+"&page=0&pageSize=100",	
	   success: function(msg){	
		 getStructs(index,msg);
	   }	
	});
}
//构造结构
function getStructs(index,data){
	var data = data.results;
	var tmp = '';
	if($("#tabContent section").eq(index).html()!=''){
		return;
	}else{
	switch(index)
	{
		case 0:            
		$.each(data,function(n,item){
			if(n == 0){
				tmp += '<div class="hongB"><div class="layout">';
				tmp += '<div class="floatR noUseMoney">'+parseFloat(item.actualAmount).toFixed(2)+'<span> 元</span></div>';
				tmp += '<div class="floatR canUseMoney">'+parseFloat(item.priv).toFixed(2)+'<span> 元</span></div>';
				tmp += '<div class="clearLF"></div></div></div><div class="returnDetail">红包返现金额＝（投资金额＊天数／365）＊0.5%</div>';
			}else{
				tmp += '<div class="money"><div class="titleH"';
				tmp += (item.couponPackage.displayName.length > 4)?'style=" padding-top:0.3rem">':'>';
				tmp += item.couponPackage.displayName+'</div>';
				tmp += '<div class="floatR moneyDetail">';
				tmp += '<div class="floatR setWidth">已用金额 （元）<br><span>'+item.actualAmount.toFixed(2)+'</span></div>'
				tmp += '<div class="floatR setWidth">可用金额 （元）<br><span>'+(item.couponPackage.parValue-item.actualAmount).toFixed(2)+'</span></div>';	
				tmp += '<div class="clearLF useTime">使用时间：'+getStartToEndTime(item.timePlaced,item.timeExpire)+'<span class="floatR">'+getStatus(item.status)+'</span></div>';
				tmp += '</div><div class="clearLF"></div></div>';
			}
		})
		break;
		case 1:
		$.each(data,function(n,item){
			var useStatus = "";
			tmp += '<div class="money"><div class="titleH"';
			tmp += (item.couponPackage.displayName.length > 4)?'style=" padding-top:0.3rem">':'>';
			tmp += item.couponPackage.displayName+'</div>';
			tmp += '<div class="floatR moneyDetail"><div>';
			tmp += '<span class="h3">'+item.couponPackage.parValue+'</span> <span class="h4">元</span><br>最低投资'+item.couponPackage.minimumInvest+'元，起投期限0个月</div>'
			tmp += '<div class="clearLF useTime">使用时间：'+getStartToEndTime(item.timePlaced,item.timeExpire)+'<span class="floatR">'+getStatus(item.status)+'</span></div></div>';
			
			tmp += '<div class="clearLF"></div></div>'	
		})
		  break;
		default:		
		$.each(data,function(n,item){
			tmp += '<div class="money"><div class="titleH"';
			tmp += (item.couponPackage.displayName.length > 4)?'style=" padding-top:0.3rem">':'>';
			tmp += item.couponPackage.displayName+'</div>';
			tmp += '<div class="floatR moneyDetail"><div>';
			tmp += '<span class="h4">加息</span> <span class="h3">'+item.couponPackage.friendlyParValue+'</span><br>最低投资'+item.couponPackage.minimumInvest+'元，起投期限0个月</div>'
			tmp += '<div class="clearLF useTime">使用时间：'+getStartToEndTime(item.timePlaced,item.timeExpire)+'<span class="floatR">'+getStatus(item.status)+'</span></div></div>';
			
			tmp += '<div class="clearLF"></div></div>'
		})
		  break;
	}	
	$("#tabContent section").eq(index).append(tmp);
	}
}
function getStatus(type){
	var status = "";
	switch (type)
	{
		case 'INITIATED':
			status = "初始";
			break;
		case 'ACHIEVE_UP':
			status = "已领完";
			break;
		case 'PLACED':
			status = "可使用";
			break;
		case 'USED':
			status = "已使用";
			break;
		case 'CANCELLED':
			status = "已作废";
			break;
		case 'EXPIRED':
			status = "过期";
			break;
		case 'REDEEMED':
			status = "已兑现";
			break;
		case 'USING':
			status = "使用中";
			break;
		default:
		  status = "异常数据";			
	}
	return status;
}

function getStartToEndTime(startTime,timeExpire) {
	if(timeExpire == null || startTime == null){
		return "无限制";
	}else{
		return format(startTime,'yyyy-MM-dd')+'至'+format(timeExpire,'yyyy-MM-dd');
	}
}      
function getReturnCoupon(id){
	var type = "REBATE";
	$.ajax({
	   type: "POST",
	   url: "/api/v2/rebateCounpon/listUserCouponPlacementByCond/"+id,
	   data: "type="+type+"&page=0&pageSize=100",
	   success: function(msg){
		 getStructs(0,msg);
	   }
	})
}
function format(time, format){ 
		var t = new Date(time); 
		var tf = function(i){return (i < 10 ? '0' : '') + i}; 
		return format.replace(/yyyy|MM|dd|HH/g, function(a){ 
		switch(a){ 
			case 'yyyy': 
			return tf(t.getFullYear()); 
			break; 
			case 'MM': 
			return tf(t.getMonth() + 1); 
			break; 
			case 'mm': 
			return tf(t.getMinutes()); 
			break; 
			case 'dd': 
			return tf(t.getDate()); 
			break; 
		}; 
	}); 
}
//验证手机端的类型
function ismobile(num){
	var u = navigator.userAgent, app = navigator.appVersion;
	if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
		if(window.location.href.indexOf("?mobile")<0){
			try{
				if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
					if(isWeiXin()){
						return '2';
					}else{
						return '1';
					}
				}else{
					return '0';
				}
			}catch(e){}
		}
	}else if( u.indexOf('iPad') > -1){
		if(isWeiXin()){
			return '2';
		}else{
			return '1';
		}
	}else{
		return '0';
	}
};
function isWeiXin(){
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		return true;
	}else{
		return false;
	}
}


//判断token是否过期
function isUsefulToken(userId,token){
	console.log('userId='+userId+'&token='+token);
	$.get("/api/mermaid/users/checkToken?userId="+userId+'&token='+token, function(res){
	    console.log(res);
	    	if (res.status!=0) {
	    		alert('请重新登录');
	    	};
	});
}