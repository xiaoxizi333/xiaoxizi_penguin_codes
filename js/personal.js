//我的订单
$.post(config.userOrderList,{'uid':uid,'limit':1},function(datas){
	console.log(datas);
	var obj = datas.result.list[0].order;
	var orderList = '';
	for(var i=0;i<obj.length;i++){
		var detailsObj = obj[i].data; 
		orderList = '<li>'+
						'<div class="clearfix" style="border-bottom:1px solid rgba(151,151,151,.2)">'+
							'<div class="product_photo pull-left bg" style="background-image:url('+detailsObj.title_pics[0]+')""></div>'+
							'<div class="product_info pull-left">'+
								'<div class="product_name">'+detailsObj.name+'</div>'+
								'<div class="description"></div>'+
							'</div>'+
							'<div class="product_price pull-right">'+
								'<div class="real_price">¥'+detailsObj.real_price+'</div>'+
								'<div class="num">x'+detailsObj.total_count+'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
		$('.my_order_list').append(orderList);
		var saleObj = obj[i].item_info[0].data.sales_points;
		for(var j=0;j<saleObj.length;j++){
			$('.description').eq(i).append(saleObj[j]);
		}
	}
	
	var aboutPriceData = datas.result.list[0].user_order.data;
	var priceSummary = '<div class="summary text-right">'+
							'<div class="sum_num" style="margin-right: 1.6875rem">共'+aboutPriceData.item_total_count+'件</div><div class="sum_price">合计 <span>¥'+aboutPriceData.item_total_price+'</span></div>'+
						'</div>';
	$('.my_order_list').append(priceSummary);
})
//优惠券
$.post(config.myCoupon,{'uid':uid},function(datas){
	console.log(datas);
	var obj = datas.result;
	var coupon = '';
	var bgPic;
	if(obj.length==0){
		$('.my_coupon').hide();
	}else{
		$('.my_coupon').show();
		for(var i=0;i<obj.length;i++){
			var objTxt = obj[i].coupon_info[0].data;
			//1.固定金额 3.折扣 13.满减
			var chooseBg = objTxt.coupon_value_type_array[0];
			var discount,couponName;
			if(chooseBg==1){
				bgPic = 'background-image: url(img/home_coupon_bg_1.png)';
				discount = '<span class="money_mark">¥</span>'+objTxt.coupon_value;
				couponName = objTxt.name;
			}else if(chooseBg==3){
				bgPic = 'background-image: url(img/home_coupon_bg_2.png)';
				discount = objTxt.coupon_discount/10+'折';
				couponName = objTxt.name;
			}else if(chooseBg==13){
				bgPic = 'background-image: url(img/home_coupon_bg_3.png)';
				discount = '<span class="money_mark">¥</span>'+objTxt.coupon_value;
				couponName = '满'+objTxt.full_sub_value+'减'+objTxt.coupon_value;
			}
			coupon += '<div class="swiper-slide" style="'+bgPic+'" data_id="'+obj[i].id+'">'+
							'<p style="line-height: 12px;font-size: 12px;margin-top:10px">'+couponName+'</p>'+
							'<p style="line-height: 42px;font-size: 22px;">'+discount+'</p>'+

						'</div>';
		 }
		$('#coupon_list .swiper-wrapper').html(coupon);
	}
	
	var couponSwiper = new Swiper('#coupon_list .swiper-container', {
	    slidesPerView: 'auto',
	    paginationClickable: true,
	});

});
//地址
$.post(config.addressList,{'uid':uid},function(data){
	var addressObj = data.result;
	//console.log(addressObj);
	for(var i=0;i<addressObj.length;i++){
		if(addressObj[i].data.state==1){

			var defaultHtml = '<div class="user_info clearfix">'+
									'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+'</div>'+
									'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
								'</div>'+
								'<div class="address_details">'+data.result[i].data.address_detail+'</div>';

		}
	}
	$('.address_box').append(defaultHtml);
	$('.edit_address').on('tap',function(){
		window.location.href="edit_address.html";
		window.localStorage.setItem('editNum','2');
	})
})