var uid = localStorage.getItem("uid");
//var uid = 1260826557228331;
//var uid = 1434704852094477;
//var uid = 1265194169869133;
var openid = localStorage.getItem("openid");
//var openid = 'ogePAv-X0KgmRDl4_jlLLy69T6rY';
(function(doc, window)
{
	// 设定rem
	var docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function()
	{
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = (16 * (clientWidth / 375)) > 40 ? 40 + "px" : (16 * (clientWidth / 375)) + 'px';
	}, anime = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(e)
	{
		return setTimeout(e, 16.67);
	};
	if (!doc.addEventListener) return;
	window.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
/**
 * Created by acmen on 2017/4/9.
 */
var util = {
    api_host:"http://api.qietuan.org",
    get: function(url, callback){
        $.get(url, function (data) {
            callback(data);
        });
    },
    post: function(url, post_data, callback){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: util.api_host + url,
            data: JSON.stringify(post_data),  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',   //WebService 会返回Json类型
            success: function(data) {     //回调函数，result，返回值
                callback(data);
            },
            fail: function (data) {
                alert("系统错误");
            }
        });
    }
};
// header_nav_bar
var isShow = true;
$('.nav-bar-icon').on('click',function(){
	if(isShow){
		$('.choice_bar').slideDown(500);
		isShow = false;
	}else{
		$('.choice_bar').slideUp(500);
		isShow = true;
	}
})
function driOrPriJump(datas){
	var obj = datas.result;
	for(var i=0;i<obj.length;i++){
		var specId = obj[i].data.good_item_spec_id?obj[i].data.good_item_spec_id:0;
		var saleStartTime = obj[i].data.sales_start_time;
		var secStartTime = obj[i].data.seckill_startime;
		var secEndTime = obj[i].data.seckill_endtime;
		var isSeckill = obj[i].data.is_seckill;
		var corePic;
		if(obj[i].data.cover_pic){
			corePic = obj[i].data.cover_pic;
		}else{
			corePic = obj[i].data.title_pics[0];
		}
		var html = '<div data_num="'+i+'" spec_id="'+specId+'" sales_start_time="'+saleStartTime+'" seckill_startime="'+secStartTime+'" seckill_endtime="'+secEndTime+'" is_seckill="'+isSeckill+'" class="detail_pic" data_id="'+obj[i].id+'"><img src="'+corePic+'" class="details"></div>';
		$('.details_info').append(html);
	}
	$('.detail_pic').off('click').on('click',function(){		
		var itemID = $(this).attr('data_id');
		var goodsIndex = $(this).index();
		var specId = $(this).attr('spec_id');
		var saleStartTime = $(this).attr('sales_start_time')==undefined?'':$(this).attr('sales_start_time')*1;
		var secStartTime = $(this).attr('seckill_startime')==undefined?'':$(this).attr('seckill_startime')*1;
		var secEndTime = $(this).attr('seckill_endtime')==undefined?'':$(this).attr('seckill_endtime')*1;
		var isSeckill = $(this).attr('is_seckill')==undefined?'':$(this).attr('is_seckill')*1;
		var nowTime = Date.parse(new Date())*1;
		if(saleStartTime!==''||isSeckill!==''){
			if(saleStartTime>0){
    			if(saleStartTime-nowTime>0){
    				window.location.href="pre_sale.html?itemID="+itemID+"&specId="+specId;
    			}else{
    				window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
    			}
    		//跳转正常
    		}else if(saleStartTime<0){
    			window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
    		}
    		//跳转 0:正常详情 1:秒杀详情
			if(isSeckill===0){
				window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
			}else if(isSeckill===1){
				if(nowTime>secStartTime&&nowTime<secEndTime){
					window.location.href="seckill.html?itemID="+itemID+"&specId="+specId;
				}else{
					window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
				}
				
			}
		}else{
			window.location.href="product_details.html";
		}
	})
}
//filter
function filterGoods(pageNm,drinkOrPrime){
	passData = {'drink_or_prime':drinkOrPrime,'page':pageNm};
	$('.filter_tab li').off('tap').on('tap',function(){
		pageNm = 1;
		var whichCondition;
		$('.details_info').empty();
		whichCondition = $(this).index();
		if(whichCondition==0){
			window.localStorage.setItem('filterId',0);
			passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.sales_count":"desc"},'page':pageNm};
		}else if(whichCondition==1){
			window.localStorage.setItem('filterId',1);
			passData = {'drink_or_prime':drinkOrPrime,'tag_id_array':[1443230295066968],'page':pageNm};
		}else if(whichCondition==2){
			window.localStorage.setItem('filterId',2);
			passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.published_at":"desc"},'page':pageNm};
		}
		getdata(passData);
	})
	filterId = window.localStorage.getItem('filterId');
	if(filterId==0){
		passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.sales_count":"desc"},'page':pageNm};
	}else if(filterId==1){
		passData = {'drink_or_prime':drinkOrPrime,'tag_id_array':[1443230295066968],'page':pageNm};
	}else if(filterId==2){
		passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.published_at":"desc"},'page':pageNm};
	}else if(filterId==3){
		passData = {'drink_or_prime':drinkOrPrime,'page':pageNm};
	}
	getdata(passData);
}
//分页
function getdata(passData){
	$.ajax(
   {    
		type:"POST",
	    url:config.primeDrinkList,
	    dataType:'json',
	 	contentType:'application/json',
	    data:JSON.stringify(passData),
	    beforeSend:function(){
	      	$('.spinner').show();
	    },
	    success:function(datas){
			console.log(datas);
			driOrPriJump(datas);
		},
		complete:function(){$('.spinner').hide()},
	})
}
//截取url参数
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
//去掉字符串里所有空格
function Trim(str,is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,",");
    if(is_global.toLowerCase()=="g")
    {
        result = result.replace(/\s/g,",");
     }
    return result;
}

//倒计时
var interval = 1000; 
function ShowCountDown(str,divname) 
{ 
var now = new Date(); 
var endDate = new Date(str); 
var leftTime=endDate.getTime()-now.getTime();
//console.log(str); 
var leftsecond = parseInt(leftTime/1000); 
//var day1=parseInt(leftsecond/(24*60*60*6)); 
var day1=Math.floor(leftsecond/(60*60*24)); 
var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
var cc = document.getElementById(divname); 
hour =(hour<10 ? "0"+hour:hour);
minute =(minute<10 ? "0"+minute:minute);
second =(second<10 ? "0"+second:second);
//console.log(cc);
cc.innerHTML = day1+"天"+' '+hour+":"+minute+":"+second; 
} 

//时间转换器
function switchDate(time,mark){
	var timeStr = new Date(time);
	var y = timeStr.getFullYear();
	var m = timeStr.getMonth()+1;
	var d = timeStr.getDate();
	m = m<10?'0'+m:m;
	d = d<10?'0'+d:d;
	return y+mark+m+mark+d;
}

//跳转购物车
$('.shopping_icon').off('tap').on('tap',function(){
	localStorage.setItem("redirect_url",window.location.href); 
	if(!openid){	
		window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
	}else{
		if(uid){
			$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
				//console.log(datas);
				if(datas.error_code==0){
					if(datas.result.order.length==0){
						showTips('您的购物车还没有商品哦，赶快选购吧～')
					}else{
						window.localStorage.setItem('jump_btn','0');
						window.localStorage.setItem('product_type','goodsInCart');
						window.location.href="firm_order.html";
					}
				}else{
					showTips(datas.error_msg)
				}
			})
		}else{
			window.localStorage.setItem('setIndexNum',1);
			window.location.href="register.html";
		}
	}
})
$('.personal_icon').on('tap',function(){
	localStorage.setItem("redirect_url",window.location.href);
	if(!openid){	 
		window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
	}else{
		if(uid){
			window.location.href="personal.html"
		}else{
			window.localStorage.setItem('setIndexNum',1);
			window.location.href="register.html"
		}
	}
})
//isVip
var isVipNum = 0;
$.ajax({
	url:config.isVip,
	type:'post',
	data:{'uid':uid?uid:0},
	async: false,
	success: function(datas){
		if(datas.result.length){
			isVipNum += 1;
		}else{
			isVipNum += 0;
		}
		window.localStorage.setItem('isVipPrice',isVipNum);
	}
})

//提示3秒消失
function showTips(msg){
	$('.warming').show().html(msg);
	setTimeout(function(){
		$('.warming').hide();
	},3000);	
}
//验证
var validator = {
	//验证电子邮箱 [@字符前可以包含字母、数字、下划线和点号；@字符后可以包含字母、数字、下划线和点号；@字符后至少包含一个点号且点号不能是最后一个字符；最后一个点号后只能是字母或数字]  
	IsEmail: function(input) {
		////邮箱名以数字或字母开头；邮箱名可由字母、数字、点号、减号、下划线组成；邮箱名（@前的字符）长度为3～18个字符；邮箱名不能以点号、减号或下划线结尾；不能出现连续两个或两个以上的点号、减号。  
		//var regex = /^[a-zA-Z0-9]((?<!(\.\.|--))[a-zA-Z0-9\._-]){1,16}[a-zA-Z0-9]@([0-9a-zA-Z][0-9a-zA-Z-]{0,62}\.)+([0-9a-zA-Z][0-9a-zA-Z-]{0,62})\.?|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;  
		var regex = /^([\w-\.]+)@([\w-\.]+)(\.[a-zA-Z0-9]+)$/;
		if(input.match(regex)) {
			return true;
		} else {
			return false;
		}
	},
	//验证电话号码（可以是固定电话号码或手机号码）  
	IsPhoneNumber: function(input) {
		var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$|^(((0\d2|0\d{2})[- ]?)?\d{8}|((0\d3|0\d{3})[- ]?)?\d{7})(-\d{3})?$/;
		if(input.match(regex)) {
			return true;
		} else {
			return false;
		}
	},
	IsIDCard: function(input) {
		input = input.toUpperCase();
		//验证身份证号码格式 [一代身份证号码为15位的数字；二代身份证号码为18位的数字或17位的数字加字母X]  
		if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(input))) {
			return false;
		}
		//验证省份  
		var arrCity = {
			11: '北京',
			12: '天津',
			13: '河北',
			14: '山西',
			15: '内蒙古',
			21: '辽宁',
			22: '吉林',
			23: '黑龙江 ',
			31: '上海',
			32: '江苏',
			33: '浙江',
			34: '安徽',
			35: '福建',
			36: '江西',
			37: '山东',
			41: '河南',
			42: '湖北',
			43: '湖南',
			44: '广东',
			45: '广西',
			46: '海南',
			50: '重庆',
			51: '四川',
			52: '贵州',
			53: '云南',
			54: '西藏',
			61: '陕西',
			62: '甘肃',
			63: '青海',
			64: '宁夏',
			65: '新疆',
			71: '台湾',
			81: '香港',
			82: '澳门',
			91: '国外'
		};
		if(arrCity[parseInt(input.substr(0, 2))] == null) {
			return false;
		}
		//验证出生日期  
		var regBirth, birthSplit, birth;
		var len = input.length;
		if(len == 15) {
			regBirth = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			birthSplit = input.match(regBirth);
			birth = new Date('19' + birthSplit[2] + '/' + birthSplit[3] + '/' + birthSplit[4]);
			if(!(birth.getYear() == Number(birthSplit[2]) && (birth.getMonth() + 1) == Number(birthSplit[3]) && birth.getDate() == Number(birthSplit[4]))) {
				return false;
			}
			return true;
		} else if(len == 18) {
			regBirth = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/i);
			birthSplit = input.match(regBirth);
			birth = new Date(birthSplit[2] + '/' + birthSplit[3] + '/' + birthSplit[4]);
			if(!(birth.getFullYear() == Number(birthSplit[2]) && (birth.getMonth() + 1) == Number(birthSplit[3]) && birth.getDate() == Number(birthSplit[4]))) {
				return false;
			}
			//验证校验码  
			var valnum;
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0,
				i;
			for(i = 0; i < 17; i++) {
				nTemp += input.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if(valnum != input.substr(17, 1)) {
				return false;
			}
			return true;
		}
		return false;
	}

}
//jump
function jumpToGoods(obj){
	obj.on('click',function(){
		var itemID = $(this).attr('item_id');
		var itemSpecId = $(this).attr('item_spec_id');
		$.post(config.goodsLsitJump,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
			console.log(datas);
			var saleStartTime = datas.result[0].data.sales_start_time==undefined?'':datas.result[0].data.sales_start_time*1;
			var nowTime = Date.parse(new Date())*1;
			var secStartTime = datas.result[0].data.seckill_startime==undefined?'':datas.result[0].data.seckill_startime*1;
			var secEndTime = datas.result[0].data.seckill_endtime==undefined?'':datas.result[0].data.seckill_endtime*1;
			var isSeckill = datas.result[0].data.is_seckill==undefined?'':datas.result[0].data.is_seckill*1;
			console.log(isSeckill===0)
			if(saleStartTime!==''||isSeckill!==''){
				if(saleStartTime>0){
	    			if(saleStartTime-nowTime>0){
	    				window.location.href="pre_sale.html?itemID="+itemID+"&specId="+itemSpecId;
	    			}else{
	    				window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
	    			}
	    		//跳转正常
	    		}else if(saleStartTime<0){
	    			window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
	    		}
	    		//跳转 0:正常详情 1:秒杀详情
				if(isSeckill===0){
					window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
				}else if(isSeckill===1){
					if(nowTime>secStartTime&&nowTime<secEndTime){
						window.location.href="seckill.html?itemID="+itemID+"&specId="+itemSpecId;
					}else{
						window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
					}		
				}
			}else{
				window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
			}	
		})
	})
}
//判断客服颜色
function isOnline(obj,url_1,url_2){
	var now = new Date();
	var h = now.getHours();
	if(h>1&&h<7){
		obj.css({'backgroundImage':'url(img/'+url_1+')'});
	}else{
		obj.css({'backgroundImage':'url(img/'+url_2+')'});
	}
}
$('.go_back_icon').on('tap',function(){
	window.history.go(-1);
})
//点击开通买醉卡
$('.set_jump_page').on('click',function(){
	if(uid){
		$.post(config.itemBilling,{'uid':uid,'item_id':1543320665920817},function(datas){
			console.log(datas);
			if(datas.error_code==0){
				window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href = "card_for_year.html";
			}else{
				showTips('您已购买会员卡或个人中心中有未支付的会员卡订单');
			}
		})
	}else{
		window.localStorage.setItem('setIndexNum',2);
		window.location.href = "register.html";
	}
})
