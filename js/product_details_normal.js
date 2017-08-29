$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	//console.log(datas);

	var obj = datas.result.item_info[0].data;
	//console.log(obj)
	
	if(datas.result.item_spec_template.length>0){
		$('.specific_cost').html('¥'+obj.range_price);
	}else{
		$('.specific_cost').html('¥'+obj.real_price);
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

	//选择规格
	var itemTemplate = datas.result.item_spec_template;
	var templateTxt = '';

	if(itemTemplate.length==0){
		$('.type_det_box').hide();
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			$('.sure').off('tap').on('tap',function(){
				if(index =='0'){		
					var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()*1};
					addCart(cartData);
					$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
					$('.mask').fadeOut(1000);
					showTips('添加成功~');
			
				}else if(index =='1'){
					var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()*1};
					//console.log(cartData)
					$.post(config.itemBilling,cartData,function(data){
						//console.log(data)
						var obj = data.result.order[0].data;
						var obj2 = data.result.order[0].item_info[0].data.sales_points;
						console.log(data)
						var detailDesc = '';
						for(var i=0;i<obj2.length;i++){
							detailDesc += obj2[i];
							
						}
						window.localStorage.setItem('jump_btn','1');
						window.localStorage.setItem('goods_name',obj.name);
						window.localStorage.setItem('goods_desc',detailDesc);
						window.localStorage.setItem('goods_prcie',obj.real_price);
						window.localStorage.setItem('goods_pic',obj.title_pics[0]);
						window.localStorage.setItem('goods_count',obj.total_count);
						window.localStorage.setItem('goods_id',data.result.order[0].id);
						window.localStorage.setItem('goods_coupon',data.result.shopping_cart[0].data.coupon_avaliable_msg);
						window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
						window.location.href="firm_order.html"
					})
					
				}
			})
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
			//console.log(index)
			$('.sure').off('tap').on('tap',function(){
				//购物车
				if(index =='0'){	
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

							var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1_data,'spec2':spec2_data,'spec3':spec3_data,'num':$('.add_or_substract .specific_num').html()*1};
							addCart(cartData);
							$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
							$('.mask').fadeOut(1000);
							showTips('添加成功~');
						}
					})
				//立即购买	
				}else if(index =='1'){
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

							var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1_data,'spec2':spec2_data,'spec3':spec3_data,'num':$('.add_or_substract .specific_num').html()*1};
							$.post(config.itemBilling,cartData,function(data){
								var obj = data.result.order[0].data;
								var obj2 = data.result.order[0].item_info[0].data.sales_points;
								console.log(data)
								var detailDesc = '';
								for(var i=0;i<obj2.length;i++){
									detailDesc += obj2[i];
									
								}

								window.localStorage.setItem('jump_btn','1');
								window.localStorage.setItem('goods_name',obj.name);
								window.localStorage.setItem('goods_desc',detailDesc);
								window.localStorage.setItem('goods_prcie',obj.real_price);
								window.localStorage.setItem('goods_pic',obj.title_pics[0]);
								window.localStorage.setItem('goods_count',obj.total_count);
								window.localStorage.setItem('goods_id',data.result.order[0].id);
								window.localStorage.setItem('goods_coupon',data.result.shopping_cart[0].data.coupon_avaliable_msg);
								window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
								window.location.href="firm_order.html"
							})
						}
					})
				}
			})
			
		})

	}
	//评论tab条数
	var commentId,commentLevel,isPic,comments;
	if(datas.result.item_spec_template.length>0){
		commentId = datas.result.item_spec_template[0].data.item_id;
	}else{
		commentId = datas.result.item_info[0].id;
	}
	$.post(config.commentCount,{'item_id':commentId},function(datas){
		console.log(datas);
		var obj = datas.result;
		var good = obj.good_comment_count;
		var normal = obj.normal_comment_count;
		var bad = obj.bad_comment_count;
		var totalCount = good+normal+bad;
		$('.comment_nav li .comment_num').eq(0).html(totalCount);
		$('.comment_nav li .comment_num').eq(1).html(good);
		$('.comment_nav li .comment_num').eq(2).html(normal);
		$('.comment_nav li .comment_num').eq(3).html(bad);
		$('.comment_nav li .comment_num').eq(4).html(obj.pic_comment_count);
		if(totalCount==0){
			$('.no_comment').show();
		}else{
			$('.no_comment').hide();
		}
	})
	//评论列表
	//console.log(commentId);
	comments = {'item_id':commentId};
	addDatas(comments);
	$('.comment_nav li').on('tap',function(){
		var index = $(this).index();
		switch(index){
			case 0:
				comments = {'item_id':commentId};
				break;
			case 1:
				comments = {'item_id':commentId,'comment_level':0};
				break;
			case 2:
				comments = {'item_id':commentId,'comment_level':1};
				break;
			case 3:
				comments = {'item_id':commentId,'comment_level':2};
				break;
			case 4:
				comments = {'item_id':commentId,'is_pic':1};
				break;
		}
		addDatas(comments);
	})
})

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