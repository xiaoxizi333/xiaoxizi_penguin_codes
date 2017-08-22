$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	
	//console.log(datas);

	var obj = datas.result.item_info[0].data;
	$('.product_name').html(obj.name);
	var salePoints = obj.sales_points;
	for(var i=0;i<salePoints.length;i++){
		$('.det').append(salePoints[i]);
	}
	if(datas.result.item_spec_template.length>0){
		$('.specific_cost').html('¥'+obj.real_price);
	}else{
		$('.specific_cost').html('¥'+obj.range_price);
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
		packageData = {'item_id':obj.item_id};
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

	//选择规格
	var itemTemplate = datas.result.item_spec_template;
	var templateTxt = '';

	if(itemTemplate.length==0){
		$('.type_det_box').hide();
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			if(index =='0'){
				$('.sure').off('tap').on('tap',function(){
					var cartData = {'uid':1370724016130198,'item_id':itemID};
					addCart(cartData);
					window.location.href="firm_order.html";
				})
			}else if(index =='1'){
				$('.sure').off('tap').on('tap',function(){
					console.log('buy');
				})
			}
		})	

	}else{
		$('.type_det_box').show();
		for(var i=0;i<itemTemplate.length;i++){
			templateTxt += '<div class="type_det">'+
								'<div class="title_type">'+itemTemplate[i].data.spec_name+'</div>'+
								'<ul class="specific_type_info list-unstyled list-inline"></ul>'+
							'</div>';
		}
		$('.type_det_box').append(templateTxt);
		for(var i=0;i<itemTemplate.length;i++){
			var specTxt = '';
			//console.log(itemTemplate[i]);
			for(var j=0;j<itemTemplate[i].data.spec_array.length;j++){
				specTxt += '<li>'+itemTemplate[i].data.spec_array[j]+'</li>';
			}
			$('.specific_type_info').eq(i).append(specTxt);
			$('.specific_type_info').eq(i).find('li').eq(0).addClass('active');
		}
		$('.specific_type_info li').on('tap',function(){
			$(this).addClass('active').siblings().removeClass('active');
		})
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			console.log(index)
			if(index =='0'){
				$('.sure').off('tap').on('tap',function(){
					var spec1 = $('.specific_type_info').eq(0).find('li.active').html()?$('.specific_type_info').eq(0).find('li.active').html():'';
					var spec2 = $('.specific_type_info').eq(1).find('li.active').html()?$('.specific_type_info').eq(1).find('li.active').html():'';
					var spec3 = $('.specific_type_info').eq(2).find('li.active').html()?$('.specific_type_info').eq(2).find('li.active').html():'';

					$.post(config.itemSpecFind,{'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3},function(data){
						//console.log(data);
						if(data.result.length==0){
							$('.storage_tip').css({'opacity':1});
						}else{
							$('.storage_tip').css({'opacity':0});
					
							var spec1_data,spec2_data,spec3_data;
							if($('.specific_type_info').eq(0).find('li.active').html()){
								spec1_data = $('.specific_type_info').eq(0).find('li.active').html();
							}
							if($('.specific_type_info').eq(1).find('li.active').html()){
								spec2_data = $('.specific_type_info').eq(1).find('li.active').html();
							}
							if($('.specific_type_info').eq(2).find('li.active').html()){
								spec3_data = $('.specific_type_info').eq(2).find('li.active').html();
							}

							var cartData = {'uid':1370724016130198,'item_id':itemID,'spec1':spec1_data,'spec2':spec2_data,'spec3':spec3_data,'num':$('.add_or_substract .specific_num').html()};
							addCart(cartData);

							window.location.href="firm_order.html";
							
						}
					})
				})
			}else if(index =='1'){
				$('.sure').off('tap').on('tap',function(){
					console.log('buy');
				})
			}
			
		})
			
		

	}
})

//添加购物车
function addCart(passData){

	$.post(config.shoppingCart,passData,function(data){
		console.log(data);
	})	

}
//保护用户名
$('.tab_header li').on('tap',function(){
	//console.log($('.username'))
	for(var i=0;i<$('.username').length;i++){
		var str = $('.username').eq(i).html();
		var str1 = str.substr(0,1);
		var str3 = str.slice(2);
		$('.username').eq(i).html(str1+'*'+str3)
	}
})