if(!openid){
	localStorage.setItem("redirect_url",window.location.href);
	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
}

//地址
$.post(config.addressList,{'uid':uid},function(data){
	var addressObj = data.result;
	//console.log(addressObj);
	for(var i=0;i<addressObj.length;i++){
		if(addressObj[i].data.state==1){
			var defaultHtml = '<div class="address_box">'+
								'<div class="user_info clearfix">'+
									'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+' <span class="default_address">[默认地址]</span></div>'+
									'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
									'<i class="edit" data_num='+i+'></i>'+
								'</div>'+
								'<div class="address_details">'+data.result[i].data.address_detail+'</div>';
							'</div>';
		}
	}
	$('.default_address').html(defaultHtml);
	if(!$('.default_address .address_box').length){
		$('.default_address').html('<a href="edit_address.html" class="text-center edit_2" style="height:5.625rem;line-height:5.625rem;display:block;font-family: PingFangSC-Thin;font-size: 0.875rem;letter-spacing: 0.14px;color: #868191;">请选择默认地址哦～</a>');
	}
	$('.edit, .edit_2').on('tap',function(){
		window.localStorage.setItem('editNum','1');
		window.location.href="edit_address.html";
	})
})
//商品列表
var cartOrBuy =  window.localStorage.getItem('jump_btn');
if(cartOrBuy=='0'){
	$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
		//console.log(datas);
		var obj = datas.result.order;
		window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
		//console.log(datas.result.user_order[0].id)
		//添加身份证号码显示
		var idNum = datas.result.user_order[0].data.id_no;
		$('.fill_id input').val(idNum);
		$('.save_id').on('tap',function(){
			if(validator.IsIDCard($('.fill_id input').val())){
				 $.ajax(
				   {
				      type:"POST",
				      url:config.idNoSave,
				      data:{'user_order_id':datas.result.user_order[0].id,'id_no':$('.fill_id input').val()}, 
				      beforeSend:function(){
				      	$('.spinner_box').show();
				      },
				      success:function(datas){
						if(datas.error_code==0){
							showTips('保存成功～');
						}else{
							showTips(datas.error_msg);
						}
				      },
				      complete:function(){$('.spinner_box').hide()},
				  })
			}else{
				showTips('请输入正确的身份证号码～')
			}		
		})
		var priceForGoods;
		for(var i=0;i<obj.length;i++){
			if(isVipPrice||obj[i].data.is_seckill==1){
				priceForGoods = obj[i].data.real_price;
			}else{
				priceForGoods = obj[i].data.public_price;
			}
			var s1 = obj[i].data.spec1?obj[i].data.spec1:'';
			var s2 = obj[i].data.spec2?obj[i].data.spec2:'';
			var s3 = obj[i].data.spec3?obj[i].data.spec3:'';
			var specStr = s1+s2+s3;
			var list = '<div class="product_info_box" style="position:relative" data_id="'+obj[i].id+'">'+
						'<div class="product_info clearfix">'+
							'<div class="choose_icon"></div>'+
							'<div class="invalid_btn text-center pull-left">无效</div>'+
							'<div class="specific_photo pull-left bg" style="background-image:url('+obj[i].data.title_pics[0]+')"></div>'+
							'<div class="sold_out text-center pull-left">无货<br><hr>Sold out</div>'+
							'<div class="description pull-left" style="width:6rem">'+
								'<div class="product_name shrink_font">'+obj[i].data.name+'</div>'+
								'<div class="spec_info">规格：'+specStr+'</div>'+
								'<div class="some_desc shrink_font"></div>'+ 
							'</div>'+
							'<div class="about_num pull-right text-right">'+
								'<div class="price">¥'+priceForGoods+'</div>'+
									'<div class="change_num clearfix">'+
									'<div class="add_or_substract pull-right" data_num="'+i+'">'+
										'<a class="add_btn" href="javascript:;">-</a>'+
										'<span class="specific_num">'+obj[i].data.total_count+'</span>'+
										'<a class="substract_btn" href="javascript:;">+</a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="behind"><a class="delete-btn text-center">删除</a></div>'+
					'</div>';
			$('.product_detail_info').append(list);	
			if(specStr){
				$('.product_info_box').eq(i).find('.spec_info').show();
			}else{
				$('.product_info_box').eq(i).find('.spec_info').hide();
			}
			//无效
			if(obj[i].data.is_off==1){
				$('.product_info_box').eq(i).find('.invalid_btn').show();
				$('.product_info_box').eq(i).find('.sold_out').show();
				$('.product_info_box').eq(i).find('.add_or_substract').hide();
				$('.product_info_box').eq(i).find('.choose_icon').hide();
			}else{
				$('.product_info_box').eq(i).find('.invalid_btn').hide();
				$('.product_info_box').eq(i).find('.sold_out').hide();
				$('.product_info_box').eq(i).find('.add_or_substract').show();
				$('.product_info_box').eq(i).find('.choose_icon').show();
			}	
		}
		$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
		
		for(var i=0;i<obj.length;i++){
			$('.some_desc').eq(i).html(obj[i].data.sub_name);	
			if(obj[i].data.is_selected==1){
				$('.choose_icon').eq(i).addClass('active');				
			}else if(obj[i].data.is_selected==0){
				$('.choose_icon').eq(i).removeClass('active');
			}
		}
		var userOrderObj = datas.result.user_order[0];
		//鹅蛋与积分
		$('.my_point_content').html(userOrderObj.data.my_point_info);
		$('.spec_egg').html(userOrderObj.data.item_cost_goose_total_count);
		//选择积分
		var isSelectPoint;
		if(userOrderObj.data.is_point_discount==1){
			isSelectPoint = true;
			$('.point_choose').addClass('active');
			var cutA = userOrderObj.data.item_total_price;
			var cutB = userOrderObj.data.ship_fee;
			var cutC = userOrderObj.data.total_price;
			$('.can_cut').html(numeral(userOrderObj.data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
			var sumB = userOrderObj.data.discount_money;
			$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
		}else{
			isSelectPoint = false;
			$('.point_choose').removeClass('active');
			var cutA = userOrderObj.data.ship_fee;
			var cutB = userOrderObj.data.total_price;
			$('.can_cut').html(numeral(userOrderObj.data.item_total_price).add(cutA).subtract(cutB).value());
			$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
		}
		//合计
		$('.can_get_points').html(userOrderObj.data.get_point_count);
		$('.can_get_egg_num').html(userOrderObj.data.get_goose_count);

		$('.point_choose').on('tap',function(){
			var selectPointData = {'user_order_id':window.localStorage.getItem('user_order_id')*1,'uid':uid};
			if(!isSelectPoint){
				$.ajax({
				    type:"POST",
				    url:config.selectUsePoint,
				    data:JSON.stringify(selectPointData),
				    contentType: "application/json",
				    beforeSend:function(){
				    	$('.spinner_box').show();
				    },
				    success:function(datas){
						//console.log(datas);
						$('.point_choose').addClass('active');
						isSelectPoint = true;
						var cutA = datas.result.user_order[0].data.item_total_price;
						var cutB = datas.result.user_order[0].data.ship_fee;
						var cutC = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
				    	var sumB = datas.result.user_order[0].data.discount_money;
				    	$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());

				    },
				    complete:function(){$('.spinner_box').hide()},
				})
			}else{
				$.ajax({
				    type:"POST",
				    url:config.unselectUsePoint,
				    data:JSON.stringify(selectPointData), 
				    contentType: "application/json",
				    beforeSend:function(){
				    	$('.spinner_box').show();
				    },
				    success:function(datas){
						//console.log(datas);
						$('.point_choose').removeClass('active');
						isSelectPoint = false;
						var cutA = datas.result.user_order[0].data.ship_fee;
						var cutB = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
				    	$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());

				    },
				    complete:function(){$('.spinner_box').hide()},
				})
			}
		})
		//选择购物车商品
		$('.choose_icon').on('tap',function(){
			$(this).toggleClass('active');
			var dataId = $(this).parents('.product_info_box').attr('data_id');
			if($(this).hasClass('active')){
				 $.ajax(
				   {
				      type:"POST",
				      url:config.selectOrders,
				      data:{'uid':uid,'order_ids':dataId,'order_type':0}, 
				      beforeSend:function(){
				      	$('.spinner_box').show();
				      },
				      success:function(datas){
				      	//console.log(datas)
						window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
						$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
						if(delivery_type!==''){
							delivery_type = datas.result.user_order[0].data.post_type;
							$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
						}
						//鹅蛋与积分
						$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
						$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
						$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
						$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);
						if(isSelectPoint){
							var cutA = datas.result.user_order[0].data.item_total_price;
							var cutB = datas.result.user_order[0].data.ship_fee;
							var cutC = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
							var sumB = datas.result.user_order[0].data.discount_money;
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
						}else{
							var cutA = datas.result.user_order[0].data.ship_fee;
							var cutB = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
						}
				      },
				      complete:function(){$('.spinner_box').hide()},
				  })
			}else{
				$.ajax(
				   {
				      type:"POST",
				      url:config.unselectOrders,
				      data:{'uid':uid,'order_ids':dataId,'order_type':0}, 
				      beforeSend:function(){
				      	$('.spinner_box').show();
				      },
				      success:function(datas){
						//console.log(datas);
						window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
						$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
						if(delivery_type!==''){
							delivery_type = datas.result.user_order[0].data.post_type;
							$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
						}
						//鹅蛋与积分
						$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
						$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
						$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
						$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);
						if(isSelectPoint){
							var cutA = datas.result.user_order[0].data.item_total_price;
							var cutB = datas.result.user_order[0].data.ship_fee;
							var cutC = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
							var sumB = datas.result.user_order[0].data.discount_money;
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());						
						}else{
							var cutA = datas.result.user_order[0].data.ship_fee;
							var cutB = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
						}
				      },
				      complete:function(){$('.spinner_box').hide()},
				})
			}	
		})
		//delivery
		var delivery_type = datas.result.user_order[0].data.post_type;
		var ship_fee = datas.result.user_order[0].data.ship_fee;
		if(delivery_type===''){
			$('.delivery_type ul li').removeClass('active');
		}else{
			$('.express_price').html('');
			$('.express_price').eq(delivery_type).html('¥'+ship_fee);
			$('.delivery_type ul li').removeClass('active');
			$('.delivery_type ul li').eq(delivery_type).addClass('active');		
		}
		delivery(isSelectPoint);
		//弹窗 加减数量
		$('.add_or_substract a').on('tap',function(){
			var dataId = $(this).parents('.product_info_box').attr('data_id')*1;
			//console.log(dataId)
			var dataNum = $(this).parent().attr('data_num');
			var index = $(this).index();
			if(index==0){	
				//order_type：0 购物车 1 立即购买
				 $.ajax(
			   {
			      type:"POST",
			      url:config.orderSubOne,
			      data:{'uid':uid,'order_id':dataId,'order_type':0}, 
			      beforeSend:function(){
			      	$('.spinner_box').show();
			      },
			      success:function(datas){
					//console.log(datas);
					if(datas.error_code==0){
						$('.specific_num').eq(dataNum).html(datas.result.order[dataNum].data.total_count);	
						$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
						window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
						if(delivery_type!==''){
							delivery_type = datas.result.user_order[0].data.post_type;
							$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
						}
						//鹅蛋与积分
						$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
						$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
						$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
						$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);
						if(isSelectPoint){
							var cutA = datas.result.user_order[0].data.item_total_price;
							var cutB = datas.result.user_order[0].data.ship_fee;
							var cutC = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
							var sumB = datas.result.user_order[0].data.discount_money;
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());						
						}else{
							var cutA = datas.result.user_order[0].data.ship_fee;
							var cutB = datas.result.user_order[0].data.total_price;
							$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
							$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
						}
					}else{
						showTips(datas.error_msg);
					}
			      },
			      complete:function(){$('.spinner_box').hide()},
			  })						
			}else if(index==2){
				 $.ajax(
				   {
				      type:"POST",
				      url:config.orderAddOne,
				      data:{'uid':uid,'order_id':dataId,'order_type':0}, 
				      beforeSend:function(){
				      	$('.spinner_box').show();
				      },
				      success:function(datas){
						//console.log(datas);
						if(datas.error_code==0){
							$('.specific_num').eq(dataNum).html(datas.result.order[dataNum].data.total_count);
							$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
							window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
							if(delivery_type!==''){
								delivery_type = datas.result.user_order[0].data.post_type;
								$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
							}
							//鹅蛋与积分
							$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
							$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
							$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
							$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);
							if(isSelectPoint){
								var cutA = datas.result.user_order[0].data.item_total_price;
								var cutB = datas.result.user_order[0].data.ship_fee;
								var cutC = datas.result.user_order[0].data.total_price;
								$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
								var sumB = datas.result.user_order[0].data.discount_money;
								$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());						
							}else{
								var cutA = datas.result.user_order[0].data.ship_fee;
								var cutB = datas.result.user_order[0].data.total_price;
								$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
								$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
							}
						}else{
							showTips(datas.error_msg);
						}
				      },
				      complete:function(){$('.spinner_box').hide()},
				  })
			}
		})
		deleteGoods();
		var preserveId = datas.result.user_order[0].data.is_prestore;
		if(preserveId==0){
			$('.preserve').removeClass('active');
		}else if(preserveId==1){
			$('.preserve').addClass('active');
		}
		//console.log(preserveId)
		$('.preserve .is_choose_icon').off('tap').on('tap',function(){
			//暂存选择
			var prestoreData;
			var user_order_id = window.localStorage.getItem('user_order_id')*1;
			if(preserveId){
				$('.preserve').removeClass('active');
				prestoreData = {'is_prestore':0,'user_order_id':user_order_id}
				preserveId = 0;
			}else{
				$('.preserve').addClass('active');
				prestoreData = {'is_prestore':1,'user_order_id':user_order_id}
				preserveId = 1;
			}
			 $.ajax(
		   {
		      type:"POST",
		      url:config.isPrestore,
		      data:prestoreData, 
		      beforeSend:function(){
		      	$('.spinner_box').show();
		      },
		      success:function(datas){
				//console.log(datas);
		      },
		      complete:function(){$('.spinner_box').hide()},
		  })
		})
		//优惠券
		$('.total_info li').eq(1).on('click',function(){
			$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
				//window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href="choose_coupon.html";
			})	
		})
		//发票
		$('.proof_box').on('click',function(){
			$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
				//window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href="receipt.html";
			})			
		})
		//console.log(delivery_type)
		//立即购买
		$('.buy_instance').on('tap',function(){
			if(delivery_type===''&&window.localStorage.getItem('cart_delivery_type')===null){
				showTips('请选择邮寄方式哦～')	;
			}else{
				localStorage.removeItem('cart_delivery_type');
				$('.buy_mask').show();
				$.post(config.goToPay,{'uid':uid,'pay_source':'h5','open_id':openid,'comment':$('#userMessage').val()},function(pay){
					//console.log(pay);
					if(pay.error_code==0){
						wx.config({
							// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: pay.result.appId, // 必填，公众号的唯一标识
							timestamp: pay.result.timeStamp, // 必填，生成签名的时间戳
							nonceStr: pay.result.nonceStr, // 必填，生成签名的随机串
							signature: pay.result.sign,// 必填，签名，见附录1
							jsApiList: [
								'checkJsApi',
								'onMenuShareTimeline',
								'onMenuShareAppMessage',
								'onMenuShareQQ',
								'onMenuShareWeibo',
								'onMenuShareQZone',
								'hideMenuItems',
								'showMenuItems',
								'hideAllNonBaseMenuItem',
								'showAllNonBaseMenuItem',
								'translateVoice',
								'startRecord',
								'stopRecord',
								'onVoiceRecordEnd',
								'playVoice',
								'onVoicePlayEnd',
								'pauseVoice',
								'stopVoice',
								'uploadVoice',
								'downloadVoice',
								'chooseImage',
								'previewImage',
								'uploadImage',
								'downloadImage',
								'getNetworkType',
								'openLocation',
								'getLocation',
								'hideOptionMenu',
								'showOptionMenu',
								'closeWindow',
								'scanQRCode',
								'chooseWXPay',
								'openProductSpecificView',
								'addCard',
								'chooseCard',
								'openCard'
							]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});

						// wx.error(function(res){

						//     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
						// });


						function onBridgeReady(pay){
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId":pay.result.appId,     //公众号名称，由商户传入
									"timeStamp":pay.result.timeStamp,         //时间戳，自1970年以来的秒数
									"nonceStr":pay.result.nonceStr, //随机串
									"package":pay.result.package_value,
									"signType":pay.result.signType,         //微信签名方式：
									"paySign":pay.result.paySign //微信签名
								},
								function(res){
									if(res.err_msg == "get_brand_wcpay_request:ok" ) {
										window.location.href="pay_success.html";
									}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
										showTips('支付取消');
										window.location.href="my_order.html";
									}else if(res.err_msg == "get_brand_wcpay_request:fail"){
										showTips('支付失败');
										window.location.href="my_order.html";	
									}

									// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
								}
							);
						}
						if (typeof WeixinJSBridge == "undefined"){
							if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						}else{
							onBridgeReady(pay);
						}
					}else if(pay.error_code==22222){
						$('.lack_eggs_tip').show();
						$('.jump_to_get_egg_btn').on('tap',function(){
							window.location.href = "personal.html";
						})
						$('.lack_eggs_tip .cross_icon').on('tap',function(){
							$('.lack_eggs_tip').hide();
							$('.buy_mask').hide();
						})
					}else{
						showTips(pay.error_msg);
						setTimeout(function(){
							$('.buy_mask').hide();
						},3000)
					}
				})
			}
			
		})

	})
}else if(cartOrBuy=='1'){
	//身份证
	var idNum = window.localStorage.getItem('identity');
		$('.fill_id input').val(idNum);
		$('.save_id').on('tap',function(){
			if(validator.IsIDCard($('.fill_id input').val())){
				 $.ajax(
			   {
			      type:"POST",
			      url:config.idNoSave,
			      data:{'user_order_id':window.localStorage.getItem('user_order_id')*1,'id_no':$('.fill_id input').val()}, 
			      beforeSend:function(){
			      	$('.spinner_box').show();
			      },
			      success:function(datas){
					if(datas.error_code==0){
						//console.log(datas);
						window.localStorage.setItem('identity',datas.result[0].data.id_no);
						showTips('保存成功～');
					}else{
						showTips(datas.error_msg);
					}
			      },
			      complete:function(){$('.spinner_box').hide()},
			  })
			}else{
				showTips('请输入正确的身份证号码～')
			}		
		})
	var goodsBox = JSON.parse(window.localStorage.getItem('goodsBox'));
	//console.log(goodsBox);
	var counts;
	var counts_num = window.localStorage.getItem('counts_num');
	for(var i=0;i<goodsBox.length;i++){
		var obj =goodsBox[i];
		if(counts_num=='0'){
			counts = obj.goods_count;
		}else if(counts_num=='1'){
			counts = window.localStorage.getItem('goods_count');
		}
		var specInfoStr = obj.spec_str;
		var list = '<div class="product_info_box" style="position:relative" data_id="'+obj.goods_id+'">'+
					'<div class="product_info clearfix">'+
						'<div class="specific_photo pull-left bg" style="background-image:url('+obj.goods_pic[0]+')"></div>'+
						'<div class="description pull-left">'+
							'<div class="product_name shrink_font">'+obj.goods_name+'</div>'+
							'<div class="spec_info">规格：'+specInfoStr+'</div>'+
							'<div class="some_desc shrink_font">'+obj.goods_desc+'</div>'+
						'</div>'+
						'<div class="about_num pull-right text-right">'+
							'<div class="price">¥'+obj.goods_prcie+'</div>'+
								'<div class="change_num clearfix">'+
								'<div class="add_or_substract pull-right" data_num="'+i+'">'+
									'<a class="add_btn" href="javascript:;">-</a>'+
									'<span class="specific_num">'+counts+'</span>'+
									'<a class="substract_btn" href="javascript:;">+</a>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="behind"><a class="delete-btn text-center">删除</a></div>'+
				'</div>';
		$('.product_detail_info').append(list);
		if(specInfoStr){
			$('.product_info_box').eq(i).find('.spec_info').show();
		}else{
			$('.product_info_box').eq(i).find('.spec_info').hide();
		}	
	}
	
	var isAddSub = window.localStorage.getItem('package');
	if(isAddSub){
		$('.change_num').hide();
		window.localStorage.removeItem('package');
	}else{
		$('.change_num').show();
	}
	$('.total_info .total_price').html('¥'+window.localStorage.getItem('item_total_price'));
	
	//鹅蛋
	if(window.localStorage.getItem('isGroup')*1==0){
		$('.goose_and_point_box').show();
		$('.welfare_list').show();
		//鹅蛋与积分
		$('.my_point_content').html(window.localStorage.getItem('myPointInfo'));
		$('.spec_egg').html(window.localStorage.getItem('itemCostGooseTotal'));
		//选择积分
		var isSelectPoint,
			discountSum;
		if(window.localStorage.getItem('is_point_discount')==1||window.localStorage.getItem('isSelectPoint')=='1'){
			isSelectPoint = true;
			window.localStorage.setItem('isSelectPoint','1');
			$('.point_choose').addClass('active');
			discountSum = window.localStorage.getItem('discountMon')*1;
		}else{
			isSelectPoint = false;
			window.localStorage.setItem('isSelectPoint','0');
			$('.point_choose').removeClass('active');
			discountSum = 0;
		}
		$('.point_choose').on('tap',function(){
			var selectPointData = {'user_order_id':window.localStorage.getItem('user_order_id')*1,'uid':uid};
			if(!isSelectPoint){
				$(this).addClass('active');
				isSelectPoint = true;
				window.localStorage.setItem('isSelectPoint','1');
				$.ajax({
				    type:"POST",
				    url:config.selectUsePoint,
				    data:JSON.stringify(selectPointData),
				    contentType: "application/json",
				    beforeSend:function(){
				    	$('.spinner_box').show();
				    },
				    success:function(datas){
						//console.log(datas);
						window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
						var cutA = datas.result.user_order[0].data.item_total_price;
						var cutB = datas.result.user_order[0].data.ship_fee;
						var cutC = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
						var sumB = datas.result.user_order[0].data.discount_money;
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
				    },
				    complete:function(){$('.spinner_box').hide()},
				})
			}else{
				$(this).removeClass('active');
				isSelectPoint = false;
				window.localStorage.setItem('isSelectPoint','0');
				$.ajax({
				    type:"POST",
				    url:config.unselectUsePoint,
				    data:JSON.stringify(selectPointData), 
				    contentType: "application/json",
				    beforeSend:function(){
				    	$('.spinner_box').show();
				    },
				    success:function(datas){
						//console.log(datas);
						window.localStorage.setItem('discountMon',0);
						var cutA = datas.result.user_order[0].data.ship_fee;
						var cutB = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
				    },
				    complete:function(){$('.spinner_box').hide()},
				})
			}
		})
		//合计
		$('.can_get_points').html(window.localStorage.getItem('getPointCount'));
		$('.can_get_egg_num').html(window.localStorage.getItem('getGooseCount'));
		var priA = window.localStorage.getItem('item_total_price')*1;
		var priB = window.localStorage.getItem('ship_fee')*1;
		var priC = window.localStorage.getItem('total_price')*1;
		var cutPrice = numeral(discountSum).add(priA).add(priB).subtract(priC).value();
		$('.can_cut').html(cutPrice);
		$('#sum_1, #sum_2').html(numeral(window.localStorage.getItem('total_price')*1).subtract(discountSum).value());
	}else{
		$('.goose_and_point_box').hide();
		$('.welfare_list').hide();
		$('#sum_1, #sum_2').html(numeral(window.localStorage.getItem('total_price')).value());
	}
	//delivery
	var delivery_type = window.localStorage.getItem('delivery_type');
	var ship_fee = window.localStorage.getItem('ship_fee');
	if(delivery_type===''){
		$('.delivery_type ul li').removeClass('active');
	}else{
		$('.delivery_type ul li').removeClass('active');
		$('.delivery_type ul li').eq(delivery_type).addClass('active');
		$('.express_price').html('');
		var express = $('.express_name').eq(delivery_type).attr('name');
		var user_order_id = window.localStorage.getItem('user_order_id')*1;
		//console.log(express);
		var isPackage = window.localStorage.getItem('package');
		$.post(config.selectExpress,{'user_order_id':user_order_id,'uid':uid,'post_type':delivery_type,'express':express},function(datas){
			//console.log(datas);
			if(datas.error_code==0){
				if(window.localStorage.getItem('isSelectPoint')=='1'){
					var sumB = datas.result.user_order[0].data.discount_money;
					$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
				}else{
					$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
				}
				window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
				$('.express_price').html('');
				$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);	
				window.localStorage.setItem('ship_fee',datas.result.user_order[0].data.ship_fee);
			}else{
				showTips(datas.error_msg)
			}
			
		})
	}
	delivery(isSelectPoint);
	//弹窗加减
	$('.add_or_substract a').on('tap',function(){
		var dataId = $(this).parents('.product_info_box').attr('data_id')*1;
		var index = $(this).index();
		if(index==0){
			 $.ajax(
		   {
		      type:"POST",
		      url:config.billingSub,
		      data:{'uid':uid,'order_id':dataId}, 
		      beforeSend:function(){
		      	$('.spinner_box').show();
		      },
		      success:function(datas){
				console.log(datas);
				if(datas.error_code==0){
					$('.specific_num').eq(0).html(datas.result.order[0].data.total_count);	
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
					window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
					window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
					window.localStorage.setItem('item_total_price',datas.result.user_order[0].data.item_total_price);
					window.localStorage.setItem('counts_num','1');
					if(delivery_type!==''){
						window.localStorage.setItem('delivery_type',datas.result.user_order[0].data.post_type);
						$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
						window.localStorage.setItem('ship_fee',datas.result.user_order[0].data.ship_fee);
					}
					//鹅蛋
					
					window.localStorage.setItem('myPointInfo',datas.result.user_order[0].data.my_point_info);
					$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
			
					window.localStorage.setItem('itemCostGooseTotal',datas.result.user_order[0].data.item_cost_goose_total_count);
					$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
					
					window.localStorage.setItem('getPointCount',datas.result.user_order[0].data.get_point_count);
					$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
					
					window.localStorage.setItem('getGooseCount',datas.result.user_order[0].data.get_goose_count);
					$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);

					window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
					if(window.localStorage.getItem('isSelectPoint')=='1'){
						var cutA = datas.result.user_order[0].data.item_total_price;
						var cutB = datas.result.user_order[0].data.ship_fee;
						var cutC = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
						var sumB = datas.result.user_order[0].data.discount_money;
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
						window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
					}else{
						var cutA = datas.result.user_order[0].data.ship_fee;
						var cutB = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
						window.localStorage.setItem('discountMon',0);
					}
				}else{
					showTips(datas.error_msg)
				}
		      },
		      complete:function(){$('.spinner_box').hide()},
		  })
			
		}else if(index==2){
			 $.ajax(
		   {
		      type:"POST",
		      url:config.billingAdd,
		      data:{'uid':uid,'order_id':dataId}, 
		      beforeSend:function(){
		      	$('.spinner_box').show();
		      },
		      success:function(datas){
		      	//console.log(datas);
				if(datas.error_code==0){
					$('.specific_num').eq(0).html(datas.result.order[0].data.total_count);
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
					window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
					window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
					window.localStorage.setItem('item_total_price',datas.result.user_order[0].data.item_total_price);
					window.localStorage.setItem('counts_num','1');
					if(delivery_type!==''){
						window.localStorage.setItem('delivery_type',datas.result.user_order[0].data.post_type);
						$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);
						window.localStorage.setItem('ship_fee',datas.result.user_order[0].data.ship_fee);
					}
					//鹅蛋
					
					window.localStorage.setItem('myPointInfo',datas.result.user_order[0].data.my_point_info);
					$('.my_point_content').html(datas.result.user_order[0].data.my_point_info);
			
					window.localStorage.setItem('itemCostGooseTotal',datas.result.user_order[0].data.item_cost_goose_total_count);
					$('.spec_egg').html(datas.result.user_order[0].data.item_cost_goose_total_count);
					
					window.localStorage.setItem('getPointCount',datas.result.user_order[0].data.get_point_count);
					$('.can_get_points').html(datas.result.user_order[0].data.get_point_count);
					
					window.localStorage.setItem('getGooseCount',datas.result.user_order[0].data.get_goose_count);
					$('.can_get_egg_num').html(datas.result.user_order[0].data.get_goose_count);

					window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
					if(window.localStorage.getItem('isSelectPoint')=='1'){
						var cutA = datas.result.user_order[0].data.item_total_price;
						var cutB = datas.result.user_order[0].data.ship_fee;
						var cutC = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.discount_money).add(cutA).add(cutB).subtract(cutC).value());
						var sumB = datas.result.user_order[0].data.discount_money;
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
						window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
					}else{
						var cutA = datas.result.user_order[0].data.ship_fee;
						var cutB = datas.result.user_order[0].data.total_price;
						$('.can_cut').html(numeral(datas.result.user_order[0].data.item_total_price).add(cutA).subtract(cutB).value());
						$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
						window.localStorage.setItem('discountMon',0);
					}
		      	}else{
		      		showTips(datas.error_msg)
		      	}
		      },
		      complete:function(){$('.spinner_box').hide()},
		  })
		}

	});
	var preserveId = window.localStorage.getItem('preserveId');
	if(preserveId==0){
		$('.preserve').removeClass('active');
	}else if(preserveId==1){
		$('.preserve').addClass('active');
	}

	$('.preserve .is_choose_icon').off('tap').on('tap',function(){
		//暂存选择
		var prestoreData;
		var user_order_id = window.localStorage.getItem('user_order_id')*1;

		if(preserveId!=='0'){
			$('.preserve').removeClass('active');
			prestoreData = {'is_prestore':0,'user_order_id':user_order_id}
			preserveId = 0;
		}else{
			$('.preserve').addClass('active');
			prestoreData = {'is_prestore':1,'user_order_id':user_order_id}
			preserveId = 1;
		}
		 $.ajax(
	   {
	      type:"POST",
	      url:config.isPrestore,
	      data:prestoreData, 
	      beforeSend:function(){
	      	$('.spinner_box').show();
	      },
	      success:function(datas){
			//console.log(datas);
			window.localStorage.setItem('preserveId',datas.result[0].data.is_prestore);
	      },
	      complete:function(){$('.spinner_box').hide()},
	  })
	})
	$('.total_info li').eq(1).on('tap',function(){
		window.location.href="choose_coupon.html";
	})
	//发票
	$('.proof_box').on('click',function(){
		window.location.href="receipt.html";			
	})
	//立即购买
	$('.buy_instance').on('tap',function(){
		var is_presell,
			productType = window.localStorage.getItem('product_type');
		if(productType=='preSale'){
			is_presell = 1;	
		}else{
			is_presell = 0;
		}
		//console.log(delivery_type) 
		if(delivery_type===''){
			showTips('请选择邮寄方式哦～')	;
		}else{
			$('.buy_mask').show();
			$.post(config.goToPayItem,{'uid':uid,'pay_source':'h5','open_id':openid,'comment':$('#userMessage').val(),'is_presell':is_presell},function(pay){
				//console.log(pay);
				if(pay.error_code==0){
					wx.config({
						// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: pay.result.appId, // 必填，公众号的唯一标识
						timestamp: pay.result.timeStamp, // 必填，生成签名的时间戳
						nonceStr: pay.result.nonceStr, // 必填，生成签名的随机串
						signature: pay.result.sign,// 必填，签名，见附录1
						jsApiList: [
							'checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'onMenuShareQZone',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem',
							'translateVoice',
							'startRecord',
							'stopRecord',
							'onVoiceRecordEnd',
							'playVoice',
							'onVoicePlayEnd',
							'pauseVoice',
							'stopVoice',
							'uploadVoice',
							'downloadVoice',
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
							'getNetworkType',
							'openLocation',
							'getLocation',
							'hideOptionMenu',
							'showOptionMenu',
							'closeWindow',
							'scanQRCode',
							'chooseWXPay',
							'openProductSpecificView',
							'addCard',
							'chooseCard',
							'openCard'
						]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});

					wx.error(function(res){

					    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
					});
					function onBridgeReady(pay){
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								"appId":pay.result.appId,     //公众号名称，由商户传入
								"timeStamp":pay.result.timeStamp,         //时间戳，自1970年以来的秒数
								"nonceStr":pay.result.nonceStr, //随机串
								"package":pay.result.package_value,
								"signType":pay.result.signType,         //微信签名方式：
								"paySign":pay.result.paySign //微信签名
							},
							function(res){
								if(res.err_msg == "get_brand_wcpay_request:ok" ) {
									window.location.href="pay_success.html";
								}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
									showTips('支付取消');
									window.location.href="my_order.html";
								}else if(res.err_msg == "get_brand_wcpay_request:fail"){
									showTips('支付失败');
									window.location.href="my_order.html";	
								}

								// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
							}
						);
					}
					if (typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						}else if (document.attachEvent){
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						}
					}else{
						onBridgeReady(pay);
					}
				}else if(pay.error_code==22222){
					$('.lack_eggs_tip').show();
					$('.jump_to_get_egg_btn').on('tap',function(){
						window.location.href = "personal.html";
					})
					$('.lack_eggs_tip .cross_icon').on('tap',function(){
						$('.lack_eggs_tip').hide();
						$('.buy_mask').hide();
					})
				}else{
					showTips(pay.error_msg);
					setTimeout(function(){
						$('.buy_mask').hide();
					},3000)
				}
			})
		}
		
	})
}

//右滑删除
function prevent_default(e) {
    e.preventDefault();
}
function disable_scroll() {
    $(document).on('touchmove', prevent_default);
}
function enable_scroll() {
    $(document).unbind('touchmove', prevent_default)
}
function deleteGoods(){
	var x;
	$('.product_info')
	    .on('touchstart', function(e) {
	        $('.product_info').css('left', '0px') 
	        x = e.originalEvent.targetTouches[0].pageX;
	    })
	    .on('touchmove', function(e) {
	        var change = e.originalEvent.targetTouches[0].pageX - x
	        change = Math.min(Math.max(-100, change), 0) 
	        e.currentTarget.style.left = change + 'px'
	        if (change < -10) disable_scroll() 
	    })
	    .on('touchend', function(e) {
	        var left = parseFloat(e.currentTarget.style.left);
	        var new_left;
	        if (left < -35) {
	            new_left = -$('.behind').width();
	        } else {
	            new_left = '0px'
	        }
	        $(e.currentTarget).animate({left: new_left}, 200)
	        enable_scroll()
	    });
	//删订单
	$('.delete-btn').on('tap',function(){
		var orderId = $(this).parent().parent().attr('data_id');
		//console.log(orderId);
		$('.delete_mask').show();
		$('.yes').on('click',function(){
			 $.ajax(
		   {
		      type:"POST",
		      url:config.sRemoveOrder,
		      data:{'uid':uid,'order_ids':orderId}, 
		      beforeSend:function(){
		      	$('.spinner_box').show();
		      },
		      success:function(data){
				//console.log(data);
				if(data.error_code==0){
					if($('.product_info_box').length==1){
						window.history.go(-1);		
					}else{
						window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
						location.reload();
					}		
				}else{
					showTips(data.error_msg);
				}
				$('.delete_mask').hide();
				if($('.product_info_box').length==0){
					$('.product_detail_info').hide();
				}else{
					$('.product_detail_info').show();
				}
		      },
		      complete:function(){$('.spinner_box').hide()},
		  })
		})
		$('.no').on('click',function(){
			$('.delete_mask').hide();
		})	
	})
}
//delivery
function delivery(isSelectPoint){
	$('.delivery_type ul > li .is_choose_icon').off('tap').on('tap',function(){
		var index = $(this).attr('choose_num')*1;
		var express = $('.express_name').eq(index).attr('name');
		var user_order_id = window.localStorage.getItem('user_order_id')*1;
		//console.log(express);
		var isPackage = window.localStorage.getItem('package');
		 $.ajax(
	   {
	      type:"POST",
	      url:config.selectExpress,
	      data:{'user_order_id':user_order_id,'uid':uid,'post_type':index,'express':express}, 
	      beforeSend:function(){
	      	$('.spinner_box').show();
	      },
	      success:function(datas){
			console.log(datas);

			if(datas.error_code==0){
				delivery_type = datas.result.user_order[0].data.post_type;
				$('.delivery_type ul > li').removeClass('active');
				$('.delivery_type ul > li').eq(delivery_type).addClass('active');
				window.localStorage.setItem('cart_delivery_type',datas.result.user_order[0].data.post_type);
				window.localStorage.setItem('delivery_type',datas.result.user_order[0].data.post_type);
				if(datas.result.user_order[0].data.is_point_discount==1){
					var sumB = datas.result.user_order[0].data.discount_money;
					$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).subtract(sumB).value());
					window.localStorage.setItem('discountMon',datas.result.user_order[0].data.discount_money);
				}else{
					$('#sum_1, #sum_2').html(numeral(datas.result.user_order[0].data.total_price).value());
					window.localStorage.setItem('discountMon',0);
				}
				window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
				$('.express_price').html('');
				$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);	
				window.localStorage.setItem('ship_fee',datas.result.user_order[0].data.ship_fee);
			}else{
				showTips(datas.error_msg)
			}
	      },
	      complete:function(){$('.spinner_box').hide()},
	  })
	});
}
$('.mask_icon').on('tap',function(){
	showTips('暂无此选项');
})
