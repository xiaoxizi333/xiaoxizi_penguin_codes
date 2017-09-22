//banner
var itemID = getQueryString('itemID')*1;
var itemSpecId = getQueryString('itemSpecId')*1;
//console.log(itemID)
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	//console.log(datas);
	var objPic = datas.result.item_info[0].data.title_pics;
	var bannerBox = '';
	//添加视频：0 商品介绍区 1 商品幻灯区
	var videoType = datas.result.item_info[0].data.video_type;
	var videoUrl = datas.result.item_info[0].data.video_url;
	if(videoUrl!==undefined&&videoUrl!==""){
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
		if(objPic[i]){
			bannerBox += '<div class="swiper-slide"><img src="'+objPic[i]+'" alt="" style="width: 100%;height:100%"></div>';
		}	
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
	$('.det').append(obj.sub_name);
	$('.sale_counts').html(obj.sales_count);

	//地点
	$('.other_info .address').html(obj.post_area);
	//具体运费
	if(uid){
		$.post(config.itemFreight,{'uid':uid,'item_id':itemID},function(datas){
			//console.log(datas)
			$('.specific_fee').html(datas.result.freight+'元');
		})
	}else{
		$('.specific_fee').html('登录后查看具体运费哦');
	}
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
	//套餐
	var packageData;
	if(datas.result.item_spec_template.length>0){
		packageData = {'item_id':datas.result.item_spec_template[0].data.item_id};
	}else{
		packageData = {'item_id':datas.result.item_info[0].id};
	}
	$.post(config.itemFindItemGroup,packageData,function(datas){
		//console.log(datas);
		var package_list = datas.result.list;
		if(package_list.length==0){
			$('.package').hide();
		}else{
			$('.package').show();
			var pacDetails = '';
			//console.log(package_list);
			for(var i=0;i<package_list.length;i++){
				pacDetails += '<div class="swiper-slide" data_id="'+package_list[i].group_info_id+'">'+
									'<div class="text-center" style="margin-bottom: 1.25rem;">'+package_list[i].group_info_title+'</div>'+
									'<div class="package_det clearfix">'+
									'</div>'+
							  	'</div>';	
			}
			$('.package-swiper .swiper-wrapper').html(pacDetails);
			for(var i=0;i<package_list.length;i++){
				var pacPicUrl = '<div class="det_content pull-left bg" style="background-image:url('+package_list[i].maps_group[0].item_info[0].title_pics[0]+')"></div>'+
							'<div class="pull-left plus">+</div>'+
							'<div class="det_content pull-left bg" style="background-image:url('+package_list[i].maps_group[1].item_info[0].title_pics[0]+')"></div>';
				$('.package_det').eq(i).append(pacPicUrl);
			}

			new Swiper('.package-swiper .swiper-container-2', {
				autoplay: 3000,//可选选项，自动滑动
				autoplayDisableOnInteraction:false,//使滑动效果不停止
				observer:true,
				observeParents:true,

			});
			$('.package-swiper .swiper-slide').on('click',function(){
				window.location.href="product_package.html";
				window.localStorage.setItem('productNm',obj.name);
				window.localStorage.setItem('groupId',$(this).attr('data_id'));
			})
		}
		

	})
	
})
//添加评论
function addDatas(pageNm,comments){
	$.post(config.itemCommentList,comments,function(datas){
		//console.log(datas);
		var picArr = [],
			obj = datas.result;
		for(var k=0;k<obj.length;k++){
			var detailObj = obj[k].data;
			var commentList = '<div class="comment_content">'+
								'<div class="user_info clearfix">'+
									'<div class="specific_user_info pull-left clearfix">'+
										'<div class="user_photo pull-left"><img src="'+detailObj.comment_user_pic+'" style="width: 2.25rem!important;height: 2.25rem;border-radius: 50%;margin-right: 0.25rem"></div>'+
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
				picHtml += '<img src="'+picObj[j]+'" style="width: 6.25rem!important;height: 6.25rem;">';
			}
			$('.comment_pic').eq(k+(1*(pageNm-1))).html(picHtml);
		}
		$('.comment_pic img').on('click',function(){
			var picUrl = $(this).attr('src');
			$('.big_pic img').attr('src',picUrl);
			$('.big_pic').fadeIn();
		})
		$(document).on('tap',function(){
			$('.big_pic').fadeOut();
		})
		$('.load_more').off('click').on('click',function(){
			var totalPage = Math.ceil(datas.total_count/10);
			if(pageNm<totalPage){
				pageNm++;
				comments.page = pageNm;
				addDatas(pageNm,comments);
				//console.log(comments)
				$('.load_more').html('加载更多');
			}else{
				$('.load_more').html('已加载全部');
			}	
		})
	})
}

//猜你喜欢
$.post(config.guessUouLike,{'location_type':'good_detail'},function(datas){
	//console.log(datas);
	if(datas.result.list.length&&datas.result.list[0].items_list.length){
		$('.guess').show();
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
				var saleStartTime = obj[goodsIndex].item[0].sales_start_time;
				var secStartTime = obj[goodsIndex].item[0].seckill_startime;
				var secEndTime = obj[goodsIndex].item[0].seckill_endtime;
				var isSeckill = obj[goodsIndex].item[0].is_seckill;
				var nowTime = Date.parse(new Date());
				//console.log(isSeckill)
				if(saleStartTime||isSeckill){
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
					if(isSeckill==0){
						window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
					}else if(isSeckill==1){
						if(nowTime>secStartTime&&nowTime<secEndTime){
							window.location.href="seckill.html?itemID="+itemID+"&specId="+specId;
						}else{
							window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
						}					
					}
				}else{
					window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
				}					
			})
		}
	}else{
		$('.guess').hide();
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
function shareToFriends(title,desc,link,imgUrl){
	$.post(config.wxShare,{'url':location.href.split('#')[0]},function(data){
		wx.config({
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'wx21df74ead4dca012', // 必填，公众号的唯一标识
		    timestamp: data.result.timestamp, // 必填，生成签名的时间戳
		    nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
		    signature: data.result.signature,// 必填，签名，见附录1
		    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	});
	wx.ready(
		function(){
			wx.onMenuShareTimeline({
			    title: title, // 分享标题
			    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: imgUrl, // 分享图标
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			       	showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareAppMessage({
			    title: title, // 分享标题
			    desc: desc, // 分享描述
			    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: imgUrl, // 分享图标
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareQQ({
			    title: title, // 分享标题
			    desc: desc, // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgUrl, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			       showTips('分享取消！');
			    }
			});
			wx.onMenuShareWeibo({
			    title: title, // 分享标题
			    desc: desc, // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgUrl, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareQZone({
			    title: title, // 分享标题
			    desc: desc, // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgUrl, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			    	showTips('分享取消！');
			        // 用户取消分享后执行的回调函数
			    }
			});
		}
	);
	wx.error(function(){

	});
}
//固定tab_header
$(window).scroll(function(){
	var height_1 = $('.goods_det').height()+$('.swiper-container').height()+$('.header').height()+$('.package').height();
	var height_2 = $('.deal_details').height();
	if (window.scrollY >= height_1&& window.scrollY < height_2+height_1) {	
		$('.tab_header').css({position:'fixed',left:0,top:'3.125rem',zIndex: 100001});
		$('body').css({paddingTop:'6.25rem'});
	}else{
		$('.tab_header').css({position:'static'});
		$('body').css({paddingTop:'3.125rem'});
	}
})
//tab
$('.tab_header li').on('click',function(){
	var index = $(this).index();
	$('.tab_header li').removeClass('active');
	$(this).addClass('active');
	$('.deal_details > div').removeClass('active');
	$('.deal_details > div').eq(index).addClass('active');
})
function makeDeal(page){
	//成交量
	$.post(config.itemDetail,{'item_id':itemID,'limit':10,'page':page},function(datas){
		//console.log(datas);
		var dealInfo = datas.result;
		if(dealInfo.length){
			$('.load_more_deal').show();
			$('.load_more_deal').html('加载更多');
			var dealHtml = '';
			for(var i=0;i<dealInfo.length;i++){
				var userInfo = dealInfo[i].user_info;
				dealHtml += '<li class="clearfix">'+
							'<span class="username pull-left" style="width: 30%">'+protectUserName(userInfo.user_data.real_name)+'</span>'+
							'<span class="deal_time pull-left text-center" style="width: 50%">'+switchDate2(dealInfo[i].created_at)+'</span>'+
							'<span class="deal_num pull-left text-center" style="width: 20%">'+dealInfo[i].data.total_count+'</span>'+
						'</li>';
			}
			$('.deal_specific_info').html(dealHtml);
			$('.load_more_deal').on('click',function(){
				var totalPage = Math.ceil(datas.total_count/10);
				if(page<totalPage){
					page++;
					makeDeal(page);
					$('.load_more_deal').html('加载更多');
				}else{
					$('.load_more_deal').html('已加载全部');
				}	
			})
		}else{
			$('.deal_specific_info').html('<div class="no_details no_deals">暂无交易～</div>');
			$('.load_more_deal').hide();
		}	
	})
}
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
isOnline($('.communicate'),'customer_sevices_1.png','cusomer_sevices.png');
//banner广告体系
$.post(config.hardAd,{'location_type':'good_detail_banner'},function(datas){
	console.log(datas);
	if(datas.result.length&&datas.result[0].data.ad_content){
		var ItemId = datas.result[0].data.jump_url[0].item_id;
		var specId = datas.result[0].data.jump_url[0].item_spec_id;
		$('.vip_banner').html('<img class="advertisement_banner" item_id="'+ItemId+'" item_spec_id="'+specId+'" src="'+datas.result[0].data.ad_content+'" style="width:100%">');
		jumpToGoods($('.advertisement_banner'));
	}else{
		$('.vip_banner').html('');
	}
})
function switchDate2(time){
	var timeStr = new Date(time);
	var month = timeStr.getMonth()+1;
	var d = timeStr.getDate();
	var h = timeStr.getHours();
	var m = timeStr.getMinutes();
	var s = timeStr.getSeconds();
	month = month<10?'0'+month:month;
	d = d<10?'0'+d:d;
	h = h<10?'0'+h:h;
	m = m<10?'0'+m:m;
	s = s<10?'0'+s:s;
	return month+'-'+d+' '+h+':'+m+':'+s;
}
//保护用户名
function protectUserName(str){
	var str1 = str.substr(0,1);
	var str3 = str.slice(2);
	return str1+'*'+str3;
}

