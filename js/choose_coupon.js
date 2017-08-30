var user_order_id = window.localStorage.getItem('user_order_id')*1;
$.post(config.myCouponList,{'uid':uid,'user_order_id':user_order_id},function(datas){
	console.log(datas);
	var isCollected=0;
	for(var i=0;i<datas.result.list.length;i++){
		var obj = datas.result.list[i].coupon.data;
		var couponHtml = '<li class="coupon_info" coupon_id="'+datas.result.list[i].history.id+'">'+
						'<div class="price">¥'+obj.coupon_value+'</div>'+
						'<div>'+obj.desc+'</div>'+
						'<div class="limit_date">使用期限 '+switchDate(obj.start_time,'.')+'-'+switchDate(obj.end_time,'.')+'</div>'+
						'<i class="use_icon my_coupons_icon" data_index="'+(i+1)+'"></i>'+
						'<i class="lack"></i>'+
					'</li>';
		$('.my_coupons ul').append(couponHtml);
		var isSelected = datas.result.list[i].history.data.is_selected;
		if(isSelected==0){
			$('.my_coupons_icon').eq(i).removeClass('active');
		}else if(isSelected==1){
			isCollected++;
			$('.my_coupons_icon').eq(i).addClass('active');
		}
	}
	if(isCollected==0){
		$('.use_icon').eq(0).addClass('active');
	}else{
		$('.use_icon').eq(0).removeClass('active');
	}
	//点击选择优惠券
	$('.use_icon').on('tap',function(){
		var index = $(this).attr('data_index');
		if(index==0){
			$.post(config.noCoupon,{'uid':uid,'user_order_id':user_order_id},function(datas){
				console.log(datas);
				window.location.href="firm_order.html"
			})
		}else{
			$.post(config.selectOneCoupon,{'uid':uid,'user_order_id':user_order_id,'history_coupon_id':$('.coupon_info').eq(index-1).attr('coupon_id')*1},function(datas){
				console.log(datas);
				window.localStorage.setItem('total_price',datas.result.user_order[0].data.total_price);
				window.location.href="firm_order.html"
			})
		}
		$('.use_icon').removeClass('active');
		$(this).addClass('active');
	})

})



