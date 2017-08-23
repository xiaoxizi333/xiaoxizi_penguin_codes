
//分类详情
$.post(config.classify,{'is_add_best_ares':0,'limit':6},function(data){
	//console.log(data);
	var obj = data.result;
	var typeTab = '<ul class="list-unstyled list-inline">'+
						'<li><a href="all-products-classify.html" style="background-image: url(img/home_classify_1.png)">'+obj[0].data.class_name+'</a></li><li>'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_2.png)">'+obj[1].data.class_name+'</a></li><li>'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_3.png)">'+obj[2].data.class_name+'</a></li><li>'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_4.png)">'+obj[3].data.class_name+'</a></li><li>'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_5.png)">'+obj[4].data.class_name+'</a></li><li>'+
						'<a href="all-products-classify.html" style="background-image: url(img/home_classify_6.png)">'+obj[5].data.class_name+'</a></li>'+
					'</ul>';
	$('.type_tab').html(typeTab);
	$('.type_tab ul li').on('tap',function(){
		var index = $(this).index();
		window.localStorage.setItem('tabId',obj[index].id);
	})
})

//banner
$.post(config.commonBanner,{'class_type':'index'},function(data){
	//console.log(data);
	var obj = data.result[0].data.show_pic_arr;
	var picUrl = data.result[0].data.jump_urls;
	//console.log(picUrl);
	var bannerBox = '';
	if(obj!==undefined){
		if(picUrl==undefined){
			for(var i=0;i<obj.length;i++){
				bannerBox += ' <div class="swiper-slide"><img src="'+obj[i]+'" alt="" style="width: 100%;height:14.25rem"></div>';
			}
	
		}else{
			for(var i=0;i<obj.length;i++){
				if(picUrl[i]==""||picUrl[i]==undefined){
					bannerBox += ' <div class="swiper-slide"><a><img src="'+obj[i]+'" alt="" style="width: 100%;height:14.25rem"></a></div>';
				}else{
					bannerBox += ' <div class="swiper-slide"><a href="'+picUrl[i]+'"><img src="'+obj[i]+'" alt="" style="width: 100%;height:14.25rem"></a></div>';
				}
				
			}
		}
		
		
	}
	$('.banner2_box').html(bannerBox);
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

//商品模块化
//获取数组顺序：上下左右
//通栏广告-->获取banner_type
//通栏类型 1.大通栏 2.双拼通栏3.组合通栏(左边大图)4.组合通栏(右边大图)\
//商品列表：获取module_id
$.post(config.indexModuleList,function(datas){
	//console.log(datas);
	var obj = datas.result;
	var pic = '';
	for(var i=0;i<obj.length;i++){
		var moduleType = obj[i].data.no_identifier;
		//console.log(moduleType)
		if(moduleType=='TLGG'){
			$('<div class="pic_module clearfix"></div>').appendTo($('.pic_module_box'));
			var bannerType = obj[i].data.banner_type;
			var jumpUrl = obj[i].data.jump_urls;
			var advertisementObj = obj[i].data.banner_urls;
			for(var j=0;j<advertisementObj.length;j++){
				var pic_url;
				if(bannerType==1){
					pic_url = 'sort1';
				}else if(bannerType==2){
					pic_url = 'sort2';
				}else if(bannerType==3){
					pic_url = 'sort3';
				}else if(bannerType==4){
					pic_url = 'sort4';
				}
				if(advertisementObj!==undefined){
					if(jumpUrl==undefined){
						pic += '<div class="sorts '+pic_url+'"><img src="'+advertisementObj[j]+'"></div>';
					}else{
						if(jumpUrl[j]!==undefined&&jumpUrl[j]!==""){
							pic += '<div class="sorts '+pic_url+'"><a href="'+jumpUrl[j]+'"><img src="'+advertisementObj[j]+'"></a></div>';
						}else{
							pic += '<div class="sorts '+pic_url+'"><a><img src="'+advertisementObj[j]+'"></a></div>';
						}
						
					}
				}
				

			}
			for(var j=0;j<$('.pic_module').length;j++){
				$('.pic_module').eq(j).html(pic);
			}			

		}
		if(moduleType=='SPLB'){
			//console.log(obj[i].id)
			$('<div class="goods_list"><div class="swiper-container"> <div class="swiper-wrapper"></div></div></div>').appendTo($('.goods_list_box'));
			$.post(config.homeModule,{'module_index_id':obj[i].id},function(datas){
				//console.log(datas)
				var obj = datas.result.module;
				var SHtml = '';
 
				for(var i=0;i<obj.length;i++){
		            
					SHtml += '<div class="swiper-slide"><img src="'+obj[i].goods_item_pic+'" data_id="'+obj[i].goods_item_id+'" spec_id="'+obj[i].goods_item_spec_id+'"></div>';
							
				}
				for(var j=0;j<$('.goods_list').length;j++){
					$('.goods_list .swiper-wrapper').eq(j).html(SHtml);	
				}
				
				//item_list_pic 
				var swiper2 = new Swiper('.goods_list .swiper-container', {
			        slidesPerView: 'auto',
			        paginationClickable: true,
			        spaceBetween: 5
			    });

			    $('.goods_list .swiper-slide img').on('click',function(){
			    	var itemID = $(this).attr('data_id');
			    	var itemSpecId = $(this).attr('spec_id');
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
			    				window.location.href="pre_sale.html";
			    			}else{
			    				window.location.href="product_details.html";
			    			}
			    		//跳转正常
			    		}else if(saleStartTime<0){
			    			window.location.href="product_details.html";
			    		}
			    	})
			    })
			})
		}
		if(moduleType=='MSLB'){
			//seckill
			//console.log(obj[i].id)
			$('<div class="seckill"><div class="seckill_time clearfix"><span class="pull-left">限时抢购 <span style="font-family: "PingFangSC-Light";"><em>Wine Seckill</em></span></span><span class="pull-right">还剩 <span id="caculate_time"></span> 分钟</span></div><div class="swiper-container"><div class="swiper-wrapper"></div></div></div>').appendTo($('.seckill_box'));
			$.post(config.seckill,{'module_index_id':obj[i].id},function(datas){

				//console.log(datas);
				var obj = datas.result.list[0].item_list;

				var seckillPic = '';
				var endTime = datas.result.list[0].seckill_endtime;
				for(var i=0;i<obj.length;i++){
					seckillPic += '<div class="swiper-slide"><img src="'+obj[i].good_item_pic+'" style="width:100%" data_id="'+obj[i].good_item_id+'" spec_id="'+obj[i].good_item_spec_id+'"></div>';
					
				}
				//console.log(endTime);
				for(var j=0;j<$('.seckill').length;j++){
					$('.seckill .swiper-wrapper').eq(j).html(seckillPic);
				}
				
				setInterval(function(){ShowCountDown(endTime,'caculate_time');}, interval); 

			    var swiper3 = new Swiper('.seckill .swiper-container', {
					pagination : '.swiper-pagination',
					effect : 'fade',
					autoplay: 3000,//可选选项，自动滑动
					autoplayDisableOnInteraction:false,//使滑动效果不停止
				});
				$('.seckill .swiper-slide img').on('click',function(){
					var itemID = $(this).attr('data_id');
					var specId = $(this).attr('spec_id');
					window.localStorage.setItem('itemID',itemID);
			    	window.localStorage.setItem('itemSpecId',specId);
					$.post(config.goodsLsitJump,{'item_id':itemID,'item_spec_id':specId},function(datas){
						console.log(datas);
						var nowTime = Date.parse(new Date());
						var secStartTime = datas.result[0].data.seckill_startime;
						var secEndTime = datas.result[0].data.seckill_endtime;
						var isSeckill = datas.result[0].data.is_seckill;

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
					})
				})
				
			})
		}
	}
	
})


//coupon
$.post(config.indexCoupon,{},function(datas){
	console.log(datas);
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
	$('.coupon .swiper-slide').on('tap',function(){
		var dataId = $(this).attr('data_id');
		$.post(config.oneCouponTake,{'uid':1370724016130198,'coupon_id':dataId},function(datas){
			if(datas.error_code==0){
				showTips('领取成功~');
			}else{
				showTips(datas.error_msg);
			}
		});
	})
})

//返回顶部
$(document).scroll(function(){
	if($(document).scrollTop()>=50){
	  $('.go_top').css({'opacity':1,'transition':'1s'});
	}else{
	  $('.go_top').css({'opacity':0,'transition':'1s'});
	}
})
$('.go_top').click(function(){
	$('body').animate({
	    'scrollTop':0
	},1000)
})





