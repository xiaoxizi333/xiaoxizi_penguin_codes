//banner
var itemID = window.localStorage.getItem('itemID');
var itemSpecId = window.localStorage.getItem('itemSpecId');
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	//console.log(datas);

	var objPic = datas.result.item_info[0].data.title_pics;
	var bannerBox = '';
	//添加视频：0 商品介绍区 1 商品幻灯区
	var videoType = datas.result.item_info[0].data.video_type;
	var videoUrl = datas.result.item_info[0].data.video_url;
	if(videoUrl!==undefined){
		var addVideo = '<video width="100%" poster="'+objPic[0]+'" controls>'+
						  '<source src="'+videoUrl+'">'+
						  '您的浏览器不支持 HTML5 video 标签。'+
						'</video>';
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
	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		autoplay: 3000,//可选选项，自动滑动
		autoplayDisableOnInteraction:false,//使滑动效果不停止
		runCallbacksOnInit : false,	

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
				var pacPicUrl = '<div class="det_content pull-left">'+
								'<img style="width:100%;height:100%" src="'+package_list[i].maps_group[0].item_info[0].title_pics[0]+'">'+
							'</div>'+
							'<div class="pull-left plus">+</div>'+
							'<div class="det_content pull-left">'+
								'<img style="width:100%;height:100%" src="'+package_list[i].maps_group[1].item_info[0].title_pics[0]+'">'+
							'</div>';
				$('.package_det').eq(i).append(pacPicUrl);
			}

			var packageSwiper = new Swiper('.package-swiper .swiper-container', {
				autoplay: 3000,//可选选项，自动滑动
				autoplayDisableOnInteraction:false//使滑动效果不停止

			});
			$('.package-swiper .swiper-slide').on('click',function(){
				window.location.href="product_package.html";
				window.localStorage.setItem('productNm',obj.name);
				window.localStorage.setItem('groupId',$(this).attr('data_id'));
			})
		}
		

	})

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


