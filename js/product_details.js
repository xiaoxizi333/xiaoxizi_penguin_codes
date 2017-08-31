//banner
var itemID = window.localStorage.getItem('itemID')*1;
var itemSpecId = window.localStorage.getItem('itemSpecId')*1;
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	console.log(datas);

	var objPic = datas.result.item_info[0].data.title_pics;
	var bannerBox = '';
	//添加视频：0 商品介绍区 1 商品幻灯区
	var videoType = datas.result.item_info[0].data.video_type;
	var videoUrl = datas.result.item_info[0].data.video_url;
	if(videoUrl!==undefined){
		var addVideo = '<div class="swiper-slide">'+
							'<video width="100%" poster="'+objPic[0]+'" controls>'+
						  		'<source src="'+videoUrl+'">'+
						  		'您的浏览器不支持 HTML5 video 标签。'+
							'</video>'+
						'</div>';
		if(videoType==0){
			$('.introduction').prepend(addVideo);
		}else if(videoType==1){
			bannerBox += addVideo;
		}
	}
	for(var i=0;i<objPic.length;i++){
		bannerBox += ' <div class="swiper-slide"><img src="'+objPic[i]+'" alt="" style="width: 100%;height:14.375rem"></div>';
	}
	$('.banner2_box').html(bannerBox);
	var mySwiper = new Swiper('.swiper-container-1', {
		pagination : '.swiper-pagination',
		//autoplay: 3000,//可选选项，自动滑动
		//autoplayDisableOnInteraction:false,//使滑动效果不停止
		//runCallbacksOnInit : false,	
		observer:true,
		observeParents:true,
	});

	//产品详情添加
	var obj = datas.result.item_info[0].data;
	$('.product_name').html(obj.name);
	var salePoints = obj.sales_points;
	for(var i=0;i<salePoints.length;i++){
		$('.det').append(salePoints[i]);
	}
	$('.sale_counts').html(obj.sales_count);

	//默认选择
	if(obj.spec1==undefined&&obj.spec2==undefined&&obj.spec3==undefined){
		$('.default_style').hide();
	}else{
		$('.default_style').show();
		if(obj.spec1!==undefined){
			$('.default_style').append('<span>'+obj.spec1+'</span>'+' ');
		}
		if(obj.spec2!==undefined){
			$('.default_style').append('<span>'+obj.spec2+'</span>'+' ');
		}
		if(obj.spec3!==undefined){
			$('.default_style').append('<span>'+obj.spec3+'</span>');
		}
	}
	
})
//添加评论
function addDatas(comments){
	$('.comment_box').empty();
	$.post(config.itemCommentList,comments,function(datas){
		//console.log(datas);
		var picArr = [],
			obj = datas.result;
		for(var k=0;k<obj.length;k++){
			var detailObj = obj[k].data;
			var commentList = '<div class="comment_content">'+
								'<div class="user_info clearfix">'+
									'<div class="specific_user_info pull-left clearfix">'+
										'<div class="user_photo pull-left"><img src="'+detailObj.comment_user_pic+'" style="width: 2.25rem;height: 2.25rem;border-radius: 50%;margin-right: 0.25rem"></div>'+
										'<div class="user_details pull-left">'+detailObj.comment_user_nickname+'</div>'+
									'</div>'+
									'<div class="date_time pull-right">'+switchDate(datas.result[k].created_at,'-')+'</div>'+
								'</div>'+
								'<div class="comment_article">'+
									'<div class="article">'+detailObj.comment_content+'</div>'+
									'<div class="comment_pic clearfix"></div>'+
								'</div>'+
								'<div class="purchase_time">购买日期：'+switchDate(detailObj.buy_time,'-')+'</div>'+
							'</div>';
			$('.comment_box').append(commentList);
			var picObj = detailObj.comment_pics;
			var picHtml = '';
			for(var j=0;j<picObj.length;j++){
				picHtml += '<img src="'+picObj[j]+'" style="width: 6.25rem;height: 6.25rem;">';
			}
			$('.comment_pic').eq(k).html(picHtml);
		}
		$('.comment_pic img').on('click',function(){
			var picUrl = $(this).attr('src');
			$('.big_pic img').attr('src',picUrl);
			$('.big_pic').fadeIn();
		})
		$(document).on('tap',function(){
			$('.big_pic').fadeOut();
		})
	})
}

//猜你喜欢
$.post(config.guessUouLike,{'location_type':'good_detail'},function(datas){
	//console.log(datas);
	var obj = datas.result.list[0].items_list;
	var guessHtml = '';
	for(var i=0;i<obj.length;i++){
		var dataId = obj[i].good_item_id;
		var specId = obj[i].good_item_spec_id?obj[i].good_item_spec_id:0;
		guessHtml = '<img src="'+obj[i].good_item_pic+'" data_id="'+dataId+'" specId="'+specId+'">';
		$('.love_banner').append(guessHtml);
		$('.love_banner>img').off('click').on('click',function(){
			var itemID = $(this).attr('data_id');
			var goodsIndex = $(this).index();
			var specId = $(this).attr('specId');
			window.localStorage.setItem('itemID',itemID);
			window.localStorage.setItem('itemSpecId',specId);
			var saleStartTime = obj[goodsIndex].item[0].sales_start_time;
			var secStartTime = obj[goodsIndex].item[0].seckill_startime;
			var secEndTime = obj[goodsIndex].item[0].seckill_endtime;
			var isSeckill = obj[goodsIndex].item[0].is_seckill;
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
	}
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


