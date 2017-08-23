//商品详情
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	
	console.log(datas);

	var obj = datas.result.item_info[0].data;
	$('.product_name').html(obj.name);
	var salePoints = obj.sales_points;
	for(var i=0;i<salePoints.length;i++){
		$('.det').append(salePoints[i]);
	}

	$('.specific_cost').html('¥'+obj.seckill_price);
	$('.real_price').html('¥'+obj.real_price)

	$('.sale_counts').html(obj.sales_count);
	$('.user_point').html(obj.seckill_price);

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
	//倒计时
	var endTime = obj.seckill_endtime;
	setInterval(function(){ShowCountDown(endTime,'caculator');}, interval); 
	

	//选择规格
	if(obj.spec_name1==undefined&&obj.spec_name2==undefined&&obj.spec_name3==undefined){
		$('.type_det_box').hide();
	}else{
		$('.type_det_box').show();
		var itemTemplate = datas.result.item_spec_template;
		var templateTxt = '';
		for(var i=0;i<itemTemplate.length;i++){
			templateTxt += '<div class="type_det">'+
								'<div class="title_type">'+itemTemplate[i].data.spec_name+'</div>'+
								'<ul class="specific_type_info list-unstyled list-inline"></ul>'+
							'</div>';
		}
		$('.type_det_box').append(templateTxt);
		if(obj.spec1!==undefined){
			$('.specific_type_info').eq(0).html('<li>'+obj.spec1+'</li>');
		}
		if(obj.spec2!==undefined){
			$('.specific_type_info').eq(1).html('<li>'+obj.spec2+'</li>');
		}
		if(obj.spec3!==undefined){
			$('.specific_type_info').eq(2).html('<li>'+obj.spec3+'</li>');
		}
	}
	

	//套餐
	var packageData;
	if(datas.result.item_spec_template.length>0){
		packageData = {'item_id':datas.result.item_spec_template[0].data.item_id};
	}else{
		packageData = {'item_id':datas.result.item_info[0].id};
	}
	//console.log(packageData);
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

	//选项卡
	$('.introduction').append(obj.detail_desc);
	$('.parameters').html(obj.item_params);
	$('.package_service').html(obj.item_service);
})