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
var limit = 0,
fileIndex;

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

	if(limit>=5){
    	alert('已超出数量');
    }else{
    	limit++;
    	var imgObj = $('<div class="pic_box"><div class="cross_pic"></div></div>').append(img);
		$('.fileList').eq(fileIndex).append(imgObj);

		//点击x取消图片
    	for(var i=0;i<$('.pic_box').length;i++){
    		$('.pic_box').eq(i).attr('data_index',i);
    	}
    	$('.cross_pic').off('tap').on('tap',function(){
    		var index = $(this).parent('.pic_box').attr('data_index');
    		$('.pic_box').eq(index).remove();
    		for(var i=0;i<$('.pic_box').length;i++){
	    		$('.pic_box').eq(i).attr('data_index',i);
	    	}
    		limit--;
    	})
    }
    
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


