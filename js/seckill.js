isVip();
//商品详情
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){	
	//console.log(datas);
	var obj = datas.result.item_info[0].data;
	$('.specific_cost').html('¥'+obj.seckill_price);
	$('.user_point').html(obj.seckill_price);
	//倒计时
	var endTime = obj.seckill_endtime;
	setInterval(function(){ShowCountDown(endTime,'caculator');}, interval); 
	//选择规格
	//显示价格
	$.post(config.isVip,{'uid':uid?uid:0},function(datas){
		if(datas.result.length){
			$('.real_price').html('会员价 ¥'+obj.real_price)
		}else{
			$('.real_price').html('非会员价 ¥'+obj.public_price)
		}
	})
	$('.specific_info .price').html('¥'+obj.seckill_price);
	$('.det_pic').css('background-image','url('+obj.title_pics[0]+')');
	$('.storage').html('库存 '+obj.storage+'件');
	if(obj.spec_name1==undefined&&obj.spec_name2==undefined&&obj.spec_name3==undefined){
		$('.type_det_box').hide();
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			$('.sure').off('tap').on('tap',function(){
				if(uid){
					if(index =='0'){	
						//console.log(itemID)
						var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()};
						$.post(config.shoppingCart,cartData,function(data){
							window.localStorage.setItem('jump_btn','0');
							$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
							$('.mask').fadeOut(1000);
							var msg = '添加成功~';
							if(data.error_code!==0){
								msg = data.error_msg;
							}
							showTips(msg);
						})				
					}else if(index =='1'){
						var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()};
						$.post(config.itemBilling,cartData,function(data){
							//console.log(data)
							if(data.error_code==0){
								var goodsInfo,
									goodsBox = [],
									obj = data.result.order;
								for(var i=0;i<obj.length;i++){
									var obj2 = obj[i].data;
									goodsInfo = {};
									goodsBox.push(goodsInfo);
									goodsBox[i].goods_name = obj2.name;
									var s1 = obj2.spec1?obj2.spec1:'';
									var s2 = obj2.spec2?obj2.spec2:'';
									var s3 = obj2.spec3?obj2.spec3:'';
									goodsBox[i].spec_str = s1+s2+s3;
									goodsBox[i].goods_prcie = obj2.real_price;
									goodsBox[i].goods_pic = [obj2.title_pics[0]];
									goodsBox[i].goods_count = obj2.total_count;
									goodsBox[i].goods_id = data.result.order[i].id;
									goodsBox[i].goods_desc = obj[i].data.sub_name;

								}
								//console.log(goodsBox)
								goodsBox = JSON.stringify(goodsBox);
								window.localStorage.setItem('total_price',data.result.user_order[0].data.total_price);
								window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
								window.localStorage.setItem('item_total_price',data.result.user_order[0].data.item_total_price);
								window.localStorage.setItem('delivery_type',data.result.user_order[0].data.post_type);
								window.localStorage.setItem('ship_fee',data.result.user_order[0].data.ship_fee);
								window.localStorage.setItem('preserveId',data.result.user_order[0].data.is_prestore);

								window.localStorage.setItem('goodsBox',goodsBox);
								window.localStorage.setItem('identity',data.result.user_order[0].data.id_no);
								window.localStorage.setItem('jump_btn','1');
								window.localStorage.setItem('counts_num','0');
								window.location.href="firm_order.html";
							}else{
								$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
								$('.mask').fadeOut(1000);
								showTips(data.error_msg);
							}
						})
						
					}
				}else{
					window.location.href="register.html"
				}
			})
		})	
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
			$('.type_det').eq(0).find('.specific_type_info').html('<li class="btn">'+obj.spec1+'</li>');
		}
		if(obj.spec2!==undefined){
			$('.type_det').eq(1).find('.specific_type_info').html('<li class="btn">'+obj.spec2+'</li>');
		}
		if(obj.spec3!==undefined){
			$('.type_det').eq(2).find('.specific_type_info').html('<li class="btn">'+obj.spec3+'</li>');
		}
		$('.specific_type_info li:not(.disabled)').on('tap',function(){
			$(this).addClass('active').siblings().removeClass('active');
		})
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			//console.log(index)
			$('.sure').off('tap').on('tap',function(){
				if(uid){
					//购物车
					if(index =='0'){	
						if($('.type_det li.active').length<$('.type_det').length){
							$('.storage_tip').css({'opacity':1}).html('请选择规格');
						}else{
							$('.storage_tip').css({'opacity':0});
							var spec1 = $('.type_det').eq(0).find('li.active').html()?$('.type_det').eq(0).find('li.active').html():'';
							var spec2 = $('.type_det').eq(1).find('li.active').html()?$('.type_det').eq(1).find('li.active').html():'';
							var spec3 = $('.type_det').eq(2).find('li.active').html()?$('.type_det').eq(2).find('li.active').html():'';
							$.post(config.itemSpecFind,{'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3},function(data){
								//console.log(data);
								if(data.result.length==0){
									$('.storage_tip').css({'opacity':1}).html('库存不足');
								}else{
									$('.storage_tip').css({'opacity':0});
									var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3,'num':$('.add_or_substract .specific_num').html()};
									$.post(config.shoppingCart,cartData,function(data){
										window.localStorage.setItem('jump_btn','0');
										$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
										$('.mask').fadeOut(1000);
										var msg = '添加成功~';
										if(data.error_code!==0){
											msg = data.error_msg;
										}
										showTips(msg);
									})
								}
							})
						}
					//立即购买	
					}else if(index =='1'){
						if($('.type_det li.active').length<$('.type_det').length){
							$('.storage_tip').css({'opacity':1}).html('请选择规格');
						}else{
							var spec1 = $('.type_det').eq(0).find('li.active').html()?$('.type_det').eq(0).find('li.active').html():'';
							var spec2 = $('.type_det').eq(1).find('li.active').html()?$('.type_det').eq(1).find('li.active').html():'';
							var spec3 = $('.type_det').eq(2).find('li.active').html()?$('.type_det').eq(2).find('li.active').html():'';
							$.post(config.itemSpecFind,{'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3},function(data){
								//console.log(data);
								if(data.result.length==0){
									$('.storage_tip').css({'opacity':1}).html('库存不足');
								}else{
									$('.storage_tip').css({'opacity':0});					
									var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3,'num':$('.add_or_substract .specific_num').html()};
									$.post(config.itemBilling,cartData,function(data){
										//console.log(data);
										if(data.error_code==0){
											var goodsInfo,
												goodsBox = [],
												obj = data.result.order;
											for(var i=0;i<obj.length;i++){
												var obj2 = obj[i].data;
												goodsInfo = {};
												goodsBox.push(goodsInfo);
												goodsBox[i].goods_name = obj2.name;
												var s1 = obj2.spec1?obj2.spec1:'';
												var s2 = obj2.spec2?obj2.spec2:'';
												var s3 = obj2.spec3?obj2.spec3:'';
												goodsBox[i].spec_str = s1+s2+s3;											
												goodsBox[i].goods_prcie = obj2.real_price;											
												goodsBox[i].goods_pic = [obj2.title_pics[0]];
												goodsBox[i].goods_count = obj2.total_count;
												goodsBox[i].goods_id = data.result.order[i].id;
												goodsBox[i].goods_desc = obj[i].data.sub_name;
											}
											//console.log(goodsBox)
											goodsBox = JSON.stringify(goodsBox);
											window.localStorage.setItem('total_price',data.result.user_order[0].data.total_price);
											window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
											window.localStorage.setItem('item_total_price',data.result.user_order[0].data.item_total_price);
											window.localStorage.setItem('delivery_type',data.result.user_order[0].data.post_type);
											window.localStorage.setItem('ship_fee',data.result.user_order[0].data.ship_fee);
											window.localStorage.setItem('preserveId',data.result.user_order[0].data.is_prestore);
											window.localStorage.setItem('goodsBox',goodsBox);
											window.localStorage.setItem('identity',data.result.user_order[0].data.id_no);
											window.localStorage.setItem('jump_btn','1');
											window.localStorage.setItem('counts_num','0');
											window.location.href="firm_order.html";
										}else{
											$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
											$('.mask').fadeOut(1000);
											showTips(data.error_msg);
										}
									})
								}
							})
						}
					}
				}else{
					window.location.href="register.html"
				}
			})
			
		})
	}
	//选项卡
	$('.introduction').append(obj.detail_desc);
	$('.parameters').html(obj.item_params);
	$('.package_service').html(obj.item_service);
})