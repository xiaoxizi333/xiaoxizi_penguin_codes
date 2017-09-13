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
//设置全局uid
var uid = sessionStorage.getItem("uid");
var openid = sessionStorage.getItem("openid");
console.log(uid);
console.log(openid);
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

//filter
function filterGoods(drinkOrPrime){
	$('.filter_tab li').on('tap',function(){
		var whichCondition,
			passData;
		$('.details_info').empty();
		whichCondition = $(this).index();
		if(whichCondition==0){
			passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.sales_count":"desc"}};
		}else if(whichCondition==1){
			passData = {'drink_or_prime':drinkOrPrime,'tag_id_array':[1379545677630329]};
		}else if(whichCondition==2){
			passData = {'drink_or_prime':drinkOrPrime,'sort':{"data.published_at":"desc"}};
		}
		//console.log(passData)
		$.ajax({
	        type: "POST",
	        dataType:'json',
	        contentType:'application/json',
	        url: config.primeDrinkList,
	        data: JSON.stringify(passData), 
	        success: function(datas){
	            console.log(datas);
	            var obj = datas.result;
				var html = '';
				for(var i=0;i<obj.length;i++){
					html += '<div data_num="'+i+'" class="detail_pic"><img src="'+obj[i].data.title_pics[0]+'" class="details"></div>';
				}
				$('.details_info').html(html);
	        }
	    });
	})
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
	var m = timeStr.getMonth();
	var d = timeStr.getDate();
	m = m<10?'0'+m:m;
	d = d<10?'0'+d:d;
	return y+mark+m+mark+d;
}

//跳转购物车
$('.shopping_icon').off('tap').on('tap',function(){
	$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
		//console.log(datas);
		if(datas.result.order.length==0){
			alert('您的购物车还没有商品哦，赶快选购吧～')
		}else{
			window.localStorage.setItem('jump_btn','0');
			window.location.href="firm_order.html";
		}
	})
})
//isVip
var isVipPrice;
function isVip(){
	$.post(config.isVip,{'uid':uid?uid:0},function(datas){
		if(datas.result.length){
			isVipPrice = 1;
		}else{
			isVipPrice = 0;
		}
	})	
}

//提示3秒消失
function showTips(msg){
	$('.warming').show().html(msg);
	setTimeout(function(){
		$('.warming').hide();
	},3000);	
}
//分页
function getdata(page,drinkOrPrime){
	$.ajax(
   {    
		type:"POST",
	    url:config.primeDrinkList,
	    data:{'drink_or_prime':drinkOrPrime,'page':page},
	    beforeSend:function(){
	      	$('.spinner').show();
	    },
	    success:function(datas){
			console.log(datas)
			var obj = datas.result;
			for(var i=0;i<obj.length;i++){
				var specId = obj[i].data.good_item_spec_id?obj[i].good_item_spec_id:0;
				var saleStartTime = obj[i].data.sales_start_time;
				var secStartTime = obj[i].data.seckill_startime;
				var secEndTime = obj[i].data.seckill_endtime;
				var isSeckill = obj[i].data.is_seckill;

				var html = '<div data_num="'+i+'" spec_id="'+specId+'" sales_start_time="'+saleStartTime+'" seckill_startime="'+secStartTime+'" seckill_endtime="'+secEndTime+'" is_seckill="'+isSeckill+'" class="detail_pic" data_id="'+obj[i].id+'"><img src="'+obj[i].data.title_pics[0]+'" class="details"></div>';
				$('.details_info').append(html);
			}
			$('.detail_pic').off('click').on('click',function(){		
				var itemID = $(this).attr('data_id');
				var goodsIndex = $(this).index();
				var specId = $(this).attr('spec_id');
				window.localStorage.setItem('itemID',itemID);
				window.localStorage.setItem('itemSpecId',specId);
				var saleStartTime = $(this).attr('sales_start_time');
				var secStartTime = $(this).attr('seckill_startime');
				var secEndTime = $(this).attr('seckill_endtime');
				var isSeckill = $(this).attr('is_seckill');
				var nowTime = Date.parse(new Date());
				console.log(isSeckill)
				if(saleStartTime||isSeckill){
					if(saleStartTime>0){
		    			if(saleStartTime-nowTime>0){
		    				window.location.href="pre_sale.html";
		    			}else{
		    				window.location.href="product_details.html";
		    			}
		    		//跳转正常
		    		}else if(saleStartTime<0){
		    			window.location.href="product_details.html";
		    		}
		    		//跳转 0:正常详情 1:秒杀详情
					if(isSeckill==0){
						window.location.href="product_details.html";
					}else if(isSeckill==1){
						if(nowTime>secStartTime&&nowTime<secEndTime){
							window.location.href="seckill.html";
						}else{
							window.location.href="product_details.html";
						}
						
					}
				}else{
					window.location.href="product_details.html";
				}
			})
			$(window).scroll(function() {
			    if (window.scrollY  >= $(document).height() - $(window).height()) {		
					//console.log(scrollY)
					//console.log(datas.result.total_count/20);
					var totalPage = Math.ceil(datas.total_count/20);
					if(pageNm<totalPage){
						console.log(pageNm)
						pageNm++;
						getdata(pageNm,drinkOrPrime);
					}									
				}
			});
		},
		complete:function(){$('.spinner').hide()},
	})
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




