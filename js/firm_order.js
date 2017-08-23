//地址
$.post(config.addressList,{'uid':1370724016130198},function(data){
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
	$.post(config.shoppingCartShow,{'order_type':0,'uid':1370724016130198},function(datas){
		console.log(datas);
		window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
		var obj = datas.result.order;
		var list = '';
		var desc = '';
		for(var i=0;i<obj.length;i++){
			
			list += '<div class="product_info_box" style="position:relative" data_id="'+obj[i].id+'">'+
						'<div class="product_info clearfix">'+
							'<div class="choose_icon"></div>'+
							'<div class="specific_photo pull-left">'+
								'<img src="'+obj[i].data.title_pics[0]+'" style="width: 100%;height: 100%" alt="">'+
							'</div>'+
							'<div class="description pull-left">'+
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
						'<div class="behind"><a href="#" class="delete-btn text-center">删除</a></div>'+
					'</div>';		
		}
		$('.product_detail_info').html(list);
		$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.total_price);
		$('.is_coupon').html(datas.result.shopping_cart[0].data.coupon_avaliable_msg)
		for(var i=0;i<obj.length;i++){
			for(var j=0;j<obj[i].item_info[0].data.sales_points.length;j++){
				desc = obj[i].item_info[0].data.sales_points[j];
				$('.some_desc').eq(i).append(desc);	
			}
			if(obj[i].data.is_selected==1){
				$('.choose_icon').addClass('active');
				
			}
		}
		//选择购物车商品
		$('.choose_icon').on('tap',function(){
			$(this).toggleClass('active');
			var dataId = $(this).parents('.product_info_box').attr('data_id');
			if($(this).hasClass('active')){
				$.post(config.selectOrders,{'uid':1370724016130198,'order_ids':dataId,'order_type':0},function(datas){
					//console.log(datas);
					window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
					$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.real_total_price);
				})
			}else{
				$.post(config.unselectOrders,{'uid':1370724016130198,'order_ids':dataId,'order_type':0},function(datas){
					//console.log(datas);
					window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
					$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.real_total_price);
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
					$.post(config.orderSubOne,{'uid':1370724016130198,'order_id':dataId,'order_type':0},function(datas){
						//console.log(datas);
						window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
						$('.specific_num').eq(dataNum).html(--numArr[dataNum]);	
						$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.total_price);
					})
					
				}
			}else if(index==2){
				$.post(config.orderAddOne,{'uid':1370724016130198,'order_id':dataId,'order_type':0},function(datas){
					//console.log(datas);
					window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
					$('.specific_num').eq(dataNum).html(++numArr[dataNum]);
					$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.total_price);
				})
			}
		})
		deleteGoods();
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
					'<div class="behind"><a href="#" class="delete-btn text-center">删除</a></div>'+
				'</div>';
	$('.product_detail_info').html(list);
	$('.some_desc').html(window.localStorage.getItem('goods_desc'));
	$('.total_info .total_price').html('¥'+window.localStorage.getItem('goods_prcie')*window.localStorage.getItem('goods_count'));
	$('.is_coupon').html(window.localStorage.getItem('goods_coupon'))
	//弹窗加减
	$('.add_or_substract a').on('tap',function(){
		var dataId = $(this).parents('.product_info_box').attr('data_id')*1;
		var index = $(this).index();
		var num = parseInt($('.specific_num').html());
		if(index==0){	
			if(num <= 1){
				$('.specific_num').html(1);	
			}else{

				$.post(config.billingSub,{'uid':1370724016130198,'order_id':dataId},function(datas){
					//console.log(datas);
					window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
					$('.specific_num').html(datas.result.order[0].data.total_count);	
					$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.total_price);
					window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
				})
				
			}
		}else if(index==2){
			$.post(config.billingAdd,{'uid':1370724016130198,'order_id':dataId},function(datas){
				console.log(datas);
				window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
				$('.specific_num').html(datas.result.order[0].data.total_count);
				$('.total_info .total_price').html('¥'+datas.result.shopping_cart[0].data.total_price);
				window.localStorage.setItem('goods_count',datas.result.order[0].data.total_count);
			})
		}

	})
	deleteGoods();

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

		$.post(config.sRemoveOrder,{'uid':1370724016130198,'order_ids':orderId},function(data){
			//console.log(data);
			if(data.error_code==0){
				alert('删除成功');
				window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
				location.reload();
			}else{
				window.localStorage.setItem('invoice_user_id',datas.result.user_order[0].id);
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
$('.delivery_type ul > li .is_choose_icon').off('tap').on('tap',function(){
	var index = $(this).attr('choose_num');
	$('.delivery_type ul > li').removeClass('active');
	$('.delivery_type ul > li').eq(index).addClass('active');
})

//发票
$('.proof_box').on('click',function(){
	$.post(config.userOrderInvoice,{'user_order_id':window.localStorage.getItem('invoice_user_id')},function(data){
		window.location.href="receipt.html";
	})	
})


