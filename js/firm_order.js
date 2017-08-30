
//地址
$.post(config.addressList,{'uid':uid},function(data){
	var addressObj = data.result;
	//console.log(addressObj);
	for(var i=0;i<addressObj.length;i++){
		if(addressObj[i].data.state==1){

			var defaultHtml = '<div class="user_info clearfix">'+
								'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+' <span class="default_address">[默认地址]</span></div>'+
								'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
								'<i class="edit" data_num='+i+'></i>'+
							'</div>'+
							'<div class="address_details">'+data.result[i].data.address_detail+'</div>';
		}
	}
	$('.address_box').html(defaultHtml);
	$('.edit').on('tap',function(){
		window.location.href="edit_address.html";
		window.localStorage.setItem('editNum','1');
	})
})
//商品列表
var cartOrBuy =  window.localStorage.getItem('jump_btn');
if(cartOrBuy=='0'){
	$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
		console.log(datas);
		var obj = datas.result.order;
		window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
		//添加身份证号码显示
		var idNum = datas.result.user_order[0].data.id_no;
		$('.fill_id input').val(idNum);
		$('.save_id').on('tap',function(){
			if(validator.IsIDCard($('.fill_id input').val())){
				$.post(config.idNoSave,{'user_order_id':datas.result.user_order[0].id,'id_no':$('.fill_id input').val()},function(datas){
					if(datas.error_code==0){
						alert('保存成功～');
					}else{
						alert(datas.error_msg);
					}
				})
			}else{
				alert('请输入正确的身份证号码～')
			}		
		})
		var list = '';
		var desc = '';
		for(var i=0;i<obj.length;i++){
			list += '<div class="product_info_box" style="position:relative" data_id="'+obj[i].id+'">'+
						'<div class="product_info clearfix">'+
							'<div class="choose_icon"></div>'+
							'<div class="specific_photo pull-left">'+
								'<img src="'+obj[i].data.title_pics[0]+'" style="width: 100%;height: 100%" alt="">'+
							'</div>'+
							'<div class="description pull-left" style="width:6rem">'+
								'<div class="product_name">'+obj[i].data.name+'</div>'+
								'<div class="some_desc"></div>'+ 
							'</div>'+
							'<div class="about_num pull-right text-right">'+
								'<div class="price">¥'+obj[i].data.real_price+'</div>'+
									'<div class="change_num clearfix">'+
									'<div class="add_or_substract pull-right"  data_num="'+i+'">'+
										'<a class="add_btn" href="javascript:;">-</a>'+
										'<span class="specific_num">'+obj[i].data.total_count+'</span>'+
										'<a class="substract_btn" href="javascript:;">+</a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="behind"><a class="delete-btn text-center">删除</a></div>'+
					'</div>';		
		}
		$('.product_detail_info').html(list);
		$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
		$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
		for(var i=0;i<obj.length;i++){
			for(var j=0;j<obj[i].item_info[0].data.sales_points.length;j++){
				desc = obj[i].item_info[0].data.sales_points[j];
				$('.some_desc').eq(i).append(desc);	
			}
			if(obj[i].data.is_selected==1){
				$('.choose_icon').addClass('active');				
			}else if(obj[i].data.is_selected==0){
				$('.choose_icon').removeClass('active');
			}
		}
		//选择购物车商品
		$('.choose_icon').on('tap',function(){
			$(this).toggleClass('active');
			var dataId = $(this).parents('.product_info_box').attr('data_id');
			if($(this).hasClass('active')){
				$.post(config.selectOrders,{'uid':uid,'order_ids':dataId,'order_type':0},function(datas){
					console.log(datas);
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
				})
			}else{
				$.post(config.unselectOrders,{'uid':uid,'order_ids':dataId,'order_type':0},function(datas){
					console.log(datas);
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
				})	
			}	
		})
		//弹窗 加减数量
		var numArr = [];
		for(var i=0;i<$('.product_detail_info .product_info_box').length;i++){
			var num = parseInt($('.specific_num').eq(i).html());
			numArr.push(num);
		}
		$('.add_or_substract a').on('tap',function(){
			var dataId = $(this).parents('.product_info_box').attr('data_id')*1;
			//console.log(dataId)
			var dataNum = $(this).parent().attr('data_num');
			var index = $(this).index();
			if(index==0){	
				if(numArr[dataNum] <= 1){
					$('.specific_num').eq(dataNum).html(1);	
				}else{
					//order_type：0 购物车 1 立即购买
					$.post(config.orderSubOne,{'uid':uid,'order_id':dataId,'order_type':0},function(datas){
						//console.log(datas);
						$('.specific_num').eq(dataNum).html(--numArr[dataNum]);	
						$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
						$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
						window.localStorage.setItem('user_order_id',datas.result.order[0].data.user_order_id);
					})					
				}
			}else if(index==2){
				$.post(config.orderAddOne,{'uid':uid,'order_id':dataId,'order_type':0},function(datas){
					//console.log(datas);
					$('.specific_num').eq(dataNum).html(++numArr[dataNum]);
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
					window.localStorage.setItem('user_order_id',datas.result.order[0].data.user_order_id);
				})
			}
		})
		deleteGoods();
		isPreserve();
		//优惠券
		$('.total_info li').eq(1).on('click',function(){
			$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
				window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href="choose_coupon.html";
			})	
		})
		//发票
		$('.proof_box').on('click',function(){
			$.post(config.shoppingCartShow,{'order_type':0,'uid':uid},function(datas){
				window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href="receipt.html";
			})			
		})
		//delivery
		var delivery_type = datas.result.user_order[0].data.post_type;
		if(delivery_type==-1){
			$('.delivery_type ul li').removeClass('active');
		}else{
			$('.delivery_type ul li').removeClass('active');
			$('.delivery_type ul li').eq(delivery_type).addClass('active');
		}
		delivery();
	})
}else if(cartOrBuy=='1'){
	var list = '<div class="product_info_box" style="position:relative" data_id="'+window.localStorage.getItem('goods_id')+'">'+
					'<div class="product_info clearfix">'+
						'<div class="specific_photo pull-left">'+
							'<img src="'+window.localStorage.getItem('goods_pic')+'" style="width: 100%;height: 100%" alt="">'+
						'</div>'+
						'<div class="description pull-left">'+
							'<div class="product_name">'+window.localStorage.getItem('goods_name')+'</div>'+
							'<div class="some_desc"></div>'+
						'</div>'+
						'<div class="about_num pull-right text-right">'+
							'<div class="price">¥'+window.localStorage.getItem('goods_prcie')+'</div>'+
								'<div class="change_num clearfix">'+
								'<div class="add_or_substract pull-right">'+
									'<a class="add_btn" href="javascript:;">-</a>'+
									'<span class="specific_num">'+window.localStorage.getItem('goods_count')+'</span>'+
									'<a class="substract_btn" href="javascript:;">+</a>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="behind"><a class="delete-btn text-center">删除</a></div>'+
				'</div>';
	$('.product_detail_info').html(list);
	$('.some_desc').html(window.localStorage.getItem('goods_desc'));
	$('.total_info .total_price').html('¥'+window.localStorage.getItem('item_total_price'));
	$('#sum_1, #sum_2').html(window.localStorage.getItem('total_price'));
	//弹窗加减
	$('.add_or_substract a').on('tap',function(){
		var dataId = $(this).parents('.product_info_box').attr('data_id')*1;
		var index = $(this).index();
		var num = parseInt($('.specific_num').html());
		if(index==0){	
			if(num <= 1){
				$('.specific_num').html(1);	
			}else{
				$.post(config.billingSub,{'uid':uid,'order_id':dataId},function(datas){
					console.log(datas);
					$('.specific_num').html(datas.result.order[0].data.total_count);	
					$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
					$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
					window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
					window.localStorage.setItem('user_order_id',datas.result.order[0].data.user_order_id);
					window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
					window.localStorage.setItem('item_total_price',datas.result.user_order[0].data.item_total_price);
				})				
			}
		}else if(index==2){
			$.post(config.billingAdd,{'uid':uid,'order_id':dataId},function(datas){
				//console.log(datas);
				$('.specific_num').html(datas.result.order[0].data.total_count);
				$('.total_info .total_price').html('¥'+datas.result.user_order[0].data.item_total_price);
				$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
				window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
				window.localStorage.setItem('user_order_id',datas.result.order[0].data.user_order_id);
				window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
				window.localStorage.setItem('item_total_price',datas.result.user_order[0].data.item_total_price);
			})
		}

	});
	isPreserve();
	$('.total_info li').eq(1).on('tap',function(){
		window.location.href="choose_coupon.html";
	})
	//发票
	$('.proof_box').on('click',function(){
		window.location.href="receipt.html";			
	})
	//delivery
	var delivery_type = window.localStorage.getItem('delivery_type');
	var ship_fee = window.localStorage.getItem('ship_fee');
	if(delivery_type==-1){
		$('.delivery_type ul li').removeClass('active');
	}else{
		$('.delivery_type ul li').removeClass('active');
		$('.delivery_type ul li').eq(delivery_type).addClass('active');
		$('express_price').eq(delivery_type).html('¥'+ship_fee);
	}
	delivery();
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
		$.post(config.sRemoveOrder,{'uid':uid,'order_ids':orderId},function(data){
			//console.log(data);
			if(data.error_code==0){
				alert('删除成功');
				if($('.product_info_box').length==1){
					window.history.go(-1);		
				}else{
					location.reload();
				}		
			}else{
				alert(data.error_msg);
			}
			if($('.product_info_box').length==0){
				$('.product_detail_info').hide();
			}else{
				$('.product_detail_info').show();
			}
		})
	})
}
//delivery
function delivery(){
	$('.delivery_type ul > li .is_choose_icon').off('tap').on('tap',function(){
		var index = $(this).attr('choose_num')*1;
		var express = $('.express_name').eq(index).attr('name');
		var user_order_id = window.localStorage.getItem('user_order_id')*1;
		$.post(config.selectExpress,{'user_order_id':user_order_id,'uid':uid,'post_type':index,'express':express},function(datas){
			console.log(datas);
			var delivery_type = datas.result.user_order[0].data.post_type;
			$('.delivery_type ul > li').removeClass('active');
			$('.delivery_type ul > li').eq(delivery_type).addClass('active');
			window.localStorage.setItem('delivery_type',datas.result.user_order[0].data.post_type);
			$('#sum_1, #sum_2').html(datas.result.user_order[0].data.total_price);
			window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
			$('.express_price').eq(delivery_type).html('¥'+datas.result.user_order[0].data.ship_fee);	
			window.localStorage.setItem('ship_fee',datas.result.user_order[0].data.ship_fee);
		})
	});
}
		
//显示暂存选择
function isPreserve(){
	var user_order_id = window.localStorage.getItem('user_order_id')*1;
	$.post(config.isPrestore,{'user_order_id':user_order_id},function(datas){
		//console.log(datas);
		var preserve_id = datas.result[0].data.is_prestore;
		if(preserve_id==0){
			$('.preserve').removeClass('active');
		}else if(preserve_id==1){
			$('.preserve').addClass('active');
		}
	})
	var if_selected = false;
	$('.preserve .is_choose_icon').off('tap').on('tap',function(){
		//暂存选择
		var prestoreData;
		var user_order_id = window.localStorage.getItem('user_order_id')*1;
		if(if_selected){
			$('.preserve').removeClass('active');
			prestoreData = {'is_prestore':0,'user_order_id':user_order_id}
			if_selected = false;
		}else{
			$('.preserve').addClass('active');
			prestoreData = {'is_prestore':1,'user_order_id':user_order_id}
			if_selected = true;
		}
		$.post(config.isPrestore,prestoreData,function(datas){
			//console.log(datas)
		})
	})
}

