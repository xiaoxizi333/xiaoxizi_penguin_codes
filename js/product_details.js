//banner
var itemID = window.localStorage.getItem('itemID');
var itemSpecId = window.localStorage.getItem('itemSpecId');
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	//console.log(datas);

	var obj = datas.result.item_info[0].data.title_pics;
	var bannerBox = '';
	//添加视频：0 商品介绍区 1 商品幻灯区
	var videoType = datas.result.item_info[0].data.video_type;
	var videoUrl = datas.result.item_info[0].data.video_url;
	if(videoUrl!==undefined){
		var addVideo = '<video width="100%" poster="'+obj[0]+'" controls>'+
						  '<source src="'+videoUrl+'">'+
						  '您的浏览器不支持 HTML5 video 标签。'+
						'</video>';
		if(videoType==0){
			$('.introduction').prepend(addVideo);
		}else if(videoType==1){
			bannerBox += addVideo;
		}
	}
	for(var i=0;i<obj.length;i++){
		bannerBox += ' <div class="swiper-slide"><img src="'+obj[i]+'" alt="" style="width: 100%;height:14.375rem"></div>';
	}
	$('.banner2_box').html(bannerBox);
	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		autoplay: 3000,//可选选项，自动滑动
		autoplayDisableOnInteraction:false,//使滑动效果不停止
		runCallbacksOnInit : false,	

	});
})

//share
$('.share').on('tap',function(){
	$('.share_mask').fadeIn();
	$('.share_arrow').css({'transform':'rotateX(0deg)','transition':'1s'})
})
$('.share_mask').on('tap',function(){
	$('.share_mask').fadeOut();
	$('.share_arrow').css({'transform':'rotateX(180deg)'})
})

//tab
$('.tab_header li').on('tap',function(){
	var index = $(this).index();
	$('.tab_header li').removeClass('active');
	$(this).addClass('active');
	$('.deal_details div').removeClass('active');
	$('.deal_details div').eq(index).addClass('active');
})
//comment
$('.comment_nav li').on('tap',function(){
	$('.comment_nav li').removeClass('active');
	$(this).addClass('active');
})

var num = parseInt($('.specific_num').html());
//弹窗 加减数量
$('.add_or_substract a').on('tap',function(){
	$('.add_or_substract a').removeClass('active');
	var index = $(this).index();	
	//console.log(num);		
	if(index==0){	
		if(num <= 1){
			$('.specific_num').html(1);	
		}else{
			$('.specific_num').html(--num);	
		}
	}else if(index==2){
		$('.specific_num').html(++num);
	}
	$(this).addClass('active');
})

//蒙版
$('.buy,.shopping_cart,.default_style').on('tap',function(){
	$('.mask').fadeIn();
	$('.choose_item_type').css({'transition': '1s','transform':'translateY(0)'});
	
})
$('.hide_icon').on('tap',function(){
	$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
	$('.mask').fadeOut(1000);
})

//购物车提示
function showTip(){
	$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
	$('.mask').fadeOut(1000);
	$('.add_cart').show();
	setTimeout(function(){
		$('.add_cart').hide();
	},3000);	
}

