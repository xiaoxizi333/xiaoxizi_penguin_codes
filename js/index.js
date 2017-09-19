//分类详情
$.post(config.classify,{'is_add_best_ares':0,'limit':6},function(data){
	//console.log(data);
	var obj = data.result;
	var typeTab = '<ul class="list-unstyled list-inline">'+
						'<li class="clearfix"><a href="all-products-classify.html" style="background-image: url(img/home_classify_1.png)">'+obj[0].data.class_name+'</a></li><li class="clearfix">'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_2.png)">'+obj[1].data.class_name+'</a></li><li class="clearfix">'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_3.png)">'+obj[2].data.class_name+'</a></li><li class="clearfix">'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_4.png)">'+obj[3].data.class_name+'</a></li><li class="clearfix">'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_5.png)">'+obj[4].data.class_name+'</a></li><li class="clearfix">'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_6.png)">'+obj[5].data.class_name+'</a></li class="clearfix">'+
					'</ul>';
	$('.type_tab').html(typeTab);
	$('.type_tab ul li').on('tap',function(){
		var index = $(this).index();
		window.localStorage.setItem('tabId',obj[index].id);
		window.localStorage.setItem('tabOrList','0');
	})
})
//banner
$.post(config.commonBanner,{'class_type':'index'},function(data){
	//console.log(data);
	var obj = data.result[0].data.show_pic_arr;
	var picUrl = data.result[0].data.jump_urls;
	var bannerBox = '';
	if(obj!==undefined){
		if(picUrl&&picUrl.length>0){	
			for(var i=0;i<obj.length;i++){
				bannerBox += ' <div class="swiper-slide"><img src="'+obj[i]+'" class="pic_for_banner" item_id="'+picUrl[i].item_id+'" item_spec_id="'+picUrl[i].item_spec_id+'"  style="width: 100%;height:14.25rem"></div>';			
			}
		}
		$('.banner2_box').html(bannerBox);
		jumpToGoods($('.pic_for_banner'));		
	}
	var mySwiper = new Swiper('.banner_contain .swiper-container', {
		pagination : '.page_box',
		autoplay: 3000,//可选选项，自动滑动
		autoplayDisableOnInteraction:false//使滑动效果不停止
	});
})
//搜索
$('#search').on('keydown',function(e){
	if(e.keyCode ==13){
		window.localStorage.setItem('search_item_name',$(this).val());
		window.location.href="all-products.html";
	}
})
$('.vip_order').on('tap',function(){
	window.localStorage.setItem('tabId',1308254907990793);
})
//商品模块化
$.post(config.indexModuleList,function(datas){
	//console.log(datas);
	var obj = datas.result;
	var listIndex = 0;
	var seckillIndex = 0;
	for(var i=0;i<obj.length;i++){
		var moduleType = obj[i].data.no_identifier;
		//console.log(moduleType)
		if(moduleType=='TLGG'){
			var bannerType = obj[i].data.banner_type;
			var jumpUrl = obj[i].data.jump_urls;
			var advertisementObj = obj[i].data.banner_urls;
			var pic_url,
				pic;
			if(advertisementObj!==undefined){
				if(jumpUrl&&jumpUrl.length>0){
					switch(bannerType){
						case 1:
							pic = '<div class="sorts clearfix sort1"><a><img src="'+advertisementObj[0]+'" class="pic_for_banner" item_id="'+jumpUrl[0].item_id+'" item_spec_id="'+jumpUrl[0].item_spec_id+'" /></a></div>';
							break;
						case 2:
							pic = '<div class="sorts clearfix sort2">'+
									'<a class="pull-left"><img src="'+advertisementObj[0]+'" class="pic_for_banner" item_id="'+jumpUrl[0].item_id+'" item_spec_id="'+jumpUrl[0].item_spec_id+'" /></a>'+
									'<a class="pull-right"><img src="'+advertisementObj[1]+'" class="pic_for_banner" item_id="'+jumpUrl[1].item_id+'" item_spec_id="'+jumpUrl[1].item_spec_id+'" /></a>'+
								'</div>';
							break;
						case 3:
							pic = '<div class="sorts clearfix sort3">'+
									'<a class="pull-left" style="width:55.3%;"><img src="'+advertisementObj[0]+'" class="pic_for_banner" item_id="'+jumpUrl[0].item_id+'" item_spec_id="'+jumpUrl[0].item_spec_id+'" /></a>'+
									'<a class="pull-right" style="width:44.3%;margin-bottom:1px"><img src="'+advertisementObj[1]+'" class="pic_for_banner" item_id="'+jumpUrl[1].item_id+'" item_spec_id="'+jumpUrl[1].item_spec_id+'" /></a>'+
									'<a class="pull-right" style="width:44.3%;"><img src="'+advertisementObj[2]+'" class="pic_for_banner" item_id="'+jumpUrl[2].item_id+'" item_spec_id="'+jumpUrl[2].item_spec_id+'" /></a>'+
								'</div>';
							break;
						case 4:
							pic = '<div class="sorts clearfix sort4">'+
									'<a class="pull-right" style="width:55.3%;"><img src="'+advertisementObj[2]+'" class="pic_for_banner" item_id="'+jumpUrl[2].item_id+'" item_spec_id="'+jumpUrl[2].item_spec_id+'" /></a>'+
									'<a class="pull-left" style="width:44.3%;margin-bottom:1px"><img src="'+advertisementObj[0]+'" class="pic_for_banner" item_id="'+jumpUrl[0].item_id+'" item_spec_id="'+jumpUrl[0].item_spec_id+'"  /></a>'+
									'<a class="pull-left" style="width:44.3%;"><img src="'+advertisementObj[1]+'" class="pic_for_banner" item_id="'+jumpUrl[1].item_id+'" item_spec_id="'+jumpUrl[1].item_spec_id+'" /></a>'+
								'</div>';
							break;
					}
				}
				$('.module_box').append(pic);
				jumpToGoods($('.pic_for_banner'));				
			}
		}else if(moduleType=='SPLB'){
			$.ajax({ 
		        type: "post", 
			    url: config.homeModule, 
			    data:{'module_index_id':obj[i].id},
			    cache:false, 
			    async:false, 
			    success: function(datas){ 
			    	$('.module_box').append($('<div class="goods_list goods_list'+listIndex+'"><div class="swiper-container"> <div class="swiper-wrapper"></div></div></div>'));
					//console.log(datas)				
					var obj = datas.result.module;
					var SHtml = ''; 
					for(var i=0;i<obj.length;i++){		            
						SHtml = '<div class="swiper-slide"><img src="'+obj[i].goods_item_pic+'" data_id="'+obj[i].goods_item_id+'" spec_id="'+obj[i].goods_item_spec_id+'"></div>';
						$('.goods_list .swiper-wrapper').eq(listIndex).append(SHtml);		
					}
					//item_list_pic 
					new Swiper('.goods_list .swiper-container',{
				        slidesPerView: 'auto',
				        spaceBetween: 5,
				        observer:true
				    });
					listIndex++;
				    $('.goods_list .swiper-slide img').on('click',function(){
				    	var itemID = $(this).attr('data_id');
				    	var itemSpecId = $(this).attr('spec_id')?$(this).attr('spec_id'):0;
				    	window.localStorage.setItem('itemID',itemID);
				    	window.localStorage.setItem('itemSpecId',itemSpecId);
				    	$.post(config.goodsLsitJump,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
				    		//console.log(datas);
				    		var saleStartTime = datas.result[0].data.sales_start_time;
				    		var nowTime = Date.parse(new Date());
				    		//console.log(saleStartTime)
				    		//console.log(nowTime)
				    		//跳转预售
				    		if(saleStartTime>0){
				    			if(saleStartTime-nowTime>0){
				    				window.location.href="pre_sale.html?itemID="+itemID+"&specId="+itemSpecId;
				    			}else{
				    				window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
				    			}
				    		//跳转正常
				    		}else if(saleStartTime<=0){
				    			window.location.href="product_details.html?itemID="+itemID+"&specId="+itemSpecId;
				    		}
				    	})
				    })
			    } 
			});					
		}else if(moduleType=='MSLB'){
			//seckill	
			$.ajax({ 
		        type: "post", 
			    url: config.seckill, 
			    data:{'module_index_id':obj[i].id},
			    cache:false, 
			    async:false, 
			    success:function(datas){
			    	//console.log(datas);
			    	if(datas.error_code==0){
						$('.module_box').append($('<div class="seckill"><div class="seckill_time clearfix"><span class="pull-left">限时抢购 <span style="font-family: "PingFangSC-Light";"><em>Wine Seckill</em></span></span><span class="pull-right">还剩 <span id="caculate_time'+seckillIndex+'"></span> 分钟</span></div><div class="swiper-container"><div class="swiper-wrapper"></div></div><div class="seckill_mask"><img src="img/seckill_mask.png"></div></div>'));
						var obj = datas.result.list[0].item_list;
						var seckillPic = '';
						var endTime = datas.result.list[0].seckill_end_time;
						for(var i=0;i<obj.length;i++){
							seckillPic = '<div class="swiper-slide"><img src="'+obj[i].good_item_pic+'" style="width:100%" data_id="'+obj[i].good_item_id+'" spec_id="'+obj[i].good_item_spec_id+'"></div>';
							$('.seckill .swiper-wrapper').eq(seckillIndex).append(seckillPic);
						}
						ShowCountDown(endTime,'caculate_time'+seckillIndex+'');
						for(var k=0;k<$('.seckill').length;k++){
							setInterval(function(){ShowCountDown(endTime,'caculate_time'+(k-1)+'');},interval)
						}
						seckillIndex++;
					    new Swiper('.seckill .swiper-container', {
							pagination : '.swiper-pagination',
							autoplay: 3000,//可选选项，自动滑动
							autoplayDisableOnInteraction:false,//使滑动效果不停止
							observer:true,
							observeParents:true
						});
						$('.seckill .swiper-slide img').on('click',function(){
							var itemID = $(this).attr('data_id');
							var specId = $(this).attr('spec_id')?$(this).attr('spec_id'):0;
							window.localStorage.setItem('itemID',itemID);
					    	window.localStorage.setItem('itemSpecId',specId);
							$.post(config.goodsLsitJump,{'item_id':itemID,'item_spec_id':specId},function(datas){
								//console.log(datas);
								var nowTime = Date.parse(new Date());
								var secStartTime = datas.result[0].data.seckill_startime;
								var secEndTime = datas.result[0].data.seckill_endtime;
								var isSeckill = datas.result[0].data.is_seckill;
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
							})
						})
			    	}
									
			    }	
			})	
		}else if(moduleType=='TLWZ'){
			var tObj = obj[i].data.banner_title;
			var title = tObj.title;
			var WZId = tObj.item_class*1;
		 	var jumpType = tObj.type;
		 	var customUrl = tObj.custom_url;
			var html = '<div class="tlwz" type="'+jumpType+'" id="'+WZId+'" customUrl="'+customUrl+'"><div class="clearfix"><div class="pull-left" style="width:18%"><span class="logo">醉鹅娘</span></div><div class="pull-left" style="width:80%"><span style="padding: 0.26rem 0.26rem;display:inline-block">'+title+'</span></div></div></div>';
		 	//console.log(jumpType)
			$('.module_box').append(html);
			jump('.tlwz');			
			
		}else if(moduleType=='ZDYTW'){
			var tObj = obj[i].data.banner_title;
			var picture = tObj.pic;
			var WZId = tObj.item_class*1;
		 	var jumpType = tObj.type;
		 	var customUrl = tObj.custom_url; 
		 	var itemID = tObj.itemid;
		 	var item_spec_id = 0;
		 	$.ajax({ 
		        type: "post", 
			    url: config.skuno, 
			    data:{'item_id':itemID},
			    cache:false, 
			    async:false, 
			    success: function(d){
			    	if(picture!=''){
				 		var html = '<div class="zdytw" item_id="'+d.result[0].id+'" item_spec_id="'+item_spec_id+'" style="width:100%" type="'+jumpType+'" id="'+WZId+'" customUrl="'+customUrl+'"><img style="width:100%" src="'+picture+'"></div>';
				 		$('.module_box').append(html);
				 	}			
						jump('.zdytw');
				    }
			})	
		}
	}	
})
//coupon
$.post(config.indexCoupon,{},function(datas){
	//console.log(datas);
	var obj = datas.result;
	var coupon = '';
	var bgPic;
	for(var i=0;i<obj.length;i++){
		var objTxt = obj[i].data;
		//1.固定金额 3.折扣 13.满减
		var chooseBg = objTxt.coupon_value_type_array[0];
		var discount,couponName;
		if(chooseBg==1){
			bgPic = 'background-image: url(img/home_coupon_bg_1.png)';
			discount = '<span class="money_mark">¥</span>'+objTxt.coupon_value;
			couponName = objTxt.name;
		}else if(chooseBg==3){
			bgPic = 'background-image: url(img/home_coupon_bg_2.png)';
			discount = objTxt.coupon_discount/10+' 折';
			couponName = objTxt.name;
		}else if(chooseBg==13){
			bgPic = 'background-image: url(img/home_coupon_bg_3.png)';
			discount = '<span class="money_mark">¥</span>'+objTxt.coupon_value;
			couponName = '满'+objTxt.full_sub_value+'减'+objTxt.coupon_value;
		}
		coupon += '<div class="swiper-slide" data_id="'+obj[i].id+'">'+
						'<a href="javascript:;" style="'+bgPic+'">'+
							'<div class="text-center">'+couponName+'</div>'+
							'<div class="coupon_price text-center">'+discount+'</div>'+
						'</a>'+
					'</div>';
	}
	$('.coupon .swiper-wrapper').html(coupon);
	//优惠券滑动
	var couponSwiper = new Swiper('.coupon .swiper-container', {
	    slidesPerView: 'auto',
	});
	$('.coupon .swiper-slide').on('click',function(){
		if(uid){
			var dataId = $(this).attr('data_id');
			$.post(config.oneCouponTake,{'uid':uid,'coupon_id':dataId},function(datas){
				if(datas.error_code==0){
					showTips('领取成功~');
				}else{
					showTips(datas.error_msg);
				}
			});
		}else{
			window.location.href="register.html";
		}
	})
})
isOnline($('.customer_service'),'service_normal@2x.png','service_selected@2x.png');
//图文、文字点击跳转
function jump(obj){
	$(obj).on('click',function(){
		var thisId = $(this).attr('id');
		var thisJump = $(this).attr('type');
		var thisJump2 = $(this).attr('customUrl');
		if(thisJump=='0'){
			window.localStorage.setItem('tabId',thisId);
			window.location.href = "all-products-classify.html";
		}else if(thisJump=='1'){
			window.location.href = thisJump2;
		}else if(thisJump=='2'){
			jumpToGoods($('.zdytw'));
		}
	})
}
//返回顶部
$(document).scroll(function(){
	if($(document).scrollTop()>=50){
	  $('.go_top, .customer_service').fadeIn();
	}else{
	  $('.go_top, .customer_service').fadeOut();
	}
})
$('.go_top').click(function(){
	$('body').animate({
	    'scrollTop':0
	},1000)
})






