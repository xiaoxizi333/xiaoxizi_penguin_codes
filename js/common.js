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

// add photos

 //限制添加
var fileIndex;

for(var i=0;i<$('.user_comment').length;i++){
	$('.fileElem').eq(i).attr('data_index',i);
}
$('.fileElem').on('change',function(){
	fileIndex = $(this).attr('data_index');
	handleFiles(this);	
})

function handleFiles(obj) {
    var files = obj.files,
    img = new Image();
    try{
    	img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
    }catch(err){}
    
    img.width = '5rem';
    img.height = '5rem';
    img.className = 'comment_photos';

	var imgObj = $('<div class="pic_box"><div class="cross_pic"></div></div>').append(img);
	$('.fileList').eq(fileIndex).append(imgObj);
	if($('.fileList').eq(fileIndex).find('.pic_box').length>=5){
		$('.filebox').eq(fileIndex).hide();
	}
	//点击x取消图片
	for(var i=0;i<$('.pic_box').length;i++){
		$('.pic_box').eq(i).attr('data_index',i);
	}
	$('.cross_pic').off('tap.removePic').on('tap.removePic',function(){
		var index = $(this).parent('.pic_box').attr('data_index');
		$('.pic_box').eq(index).remove();
		for(var i=0;i<$('.pic_box').length;i++){
    		$('.pic_box').eq(i).attr('data_index',i);
    	}
    	
	})

    
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
cc.innerHTML = day1+"天"+' '+hour+":"+minute+":"+second; 
} 
//跳转购物车
$('.shopping_icon').off('tap').on('tap',function(){
	$.post(config.shoppingCartShow,{'order_type':0,'uid':1370724016130198},function(datas){
		window.localStorage.setItem('jump_btn','0');
		window.location.href="firm_order.html";
	})
})

function addCart(passData){

	$.post(config.shoppingCart,passData,function(data){
		//console.log(data);
	})	

}
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
	}

}