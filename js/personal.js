$.post(config.userShow,{'uid':uid},function(datas){
	//console.log(datas);
	var obj = datas.result[0].user_data;
	$('.portrait img').attr('src',obj.user_profile_pic);
	$('.portrait .username').html(obj.user_name);
})
//分红
$.post(config.vipService,{'uid':uid},function(datas){
	//console.log(datas);
	var service = datas.result.service;
	if(service.length){
		$('.renew_box').show();
		var serviceHtml = '';
		for(var i=0;i<service.length;i++){
			var obj = service[i];
			var points = obj.user_info.user_data.point?obj.user_info.user_data.point:0;
			serviceHtml += '<div class="renew">'+
								'<div class="logo_txt">企鹅团200</div>'+
								'<div class="title_txt">'+obj.vip_service.data.vip_item.name+'</div>'+
								'<ul class="list-unstyled about_personal_info">'+
									'<li class="clearfix">'+
										'<span class="pull-left">我的积分</span>'+
										'<span class="pull-right my_points">'+points+'</span>'+
									'</li>'+
									'<li class="clearfix">'+
										'<span class="pull-left delivery_info">快件到达北京市</span>'+
										'<span class="pull-right delivery_state">已发货</span>'+
									'</li>'+
									'<li class="clearfix">'+
										'<span class="pull-left exp_date">距离过期有'+getExpireDay(obj.vip_service.data.end_time)+'天</span>'+
									'</li>'+
								'</ul>'+
								'<div class="total_btn_style renew_btn">'+
									'立刻<br>'+
									'续订'+
								'</div>'+
							'</div>';
		}
		$('.renew_box').html(serviceHtml);
	}else{
		$('.purchase').show();
	}
})
isVip();
//我的订单
$.post(config.userOrderList,{'uid':uid,'limit':1},function(datas){
	//console.log(datas);
	if(datas.result.list && datas.result.list.length>0){
		var whichPrice;
		var detailsObj = datas.result.list[0].order[0].data; 
		var aboutPriceData = datas.result.list[0].user_order.data;
		if(isVipPrice){
			whichPrice = detailsObj.real_price;
		}else{
			whichPrice = detailsObj.public_price;
		}
		var orderList = '<li>'+
							'<div class="clearfix" style="border-bottom:1px solid rgba(151,151,151,.2)">'+
								'<div class="product_photo pull-left bg" style="background-image:url('+detailsObj.title_pics[0]+')"></div>'+
								'<div class="product_info pull-left">'+
									'<div class="product_name">'+detailsObj.name+'</div>'+
									'<div class="description">'+detailsObj.sub_name+'</div>'+
								'</div>'+
								'<div class="product_price pull-right">'+
									'<div class="real_price">¥'+whichPrice+'</div>'+
									'<div class="num">x'+detailsObj.total_count+'</div>'+
								'</div>'+
							'</div>'+
						'</li>'+
						'<div class="summary text-right">'+
							'<div class="sum_num" style="margin-right: 1.6875rem">共'+aboutPriceData.item_total_count+'件</div><div class="sum_price">合计 <span>¥'+aboutPriceData.total_price+'</span></div>'+
						'</div>';
		$('.my_order_list').html(orderList);
		$('.go_order a').on('tap',function(){
			window.location.href = "my_order.html";
		})
	}else{
		$('.my_order_list').html('<div class="text-center" style="padding-bottom: 1.25rem;font-family:PingFangSC-Thin">您还没有订单哟～</div>');
	}	
})
//优惠券
$.post(config.myCoupon,{'uid':uid},function(datas){
	//console.log(datas);
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
	if(addressObj.length){
		for(var i=0;i<addressObj.length;i++){
			if(addressObj[i].data.state==1){
				var defaultHtml = '<div class="user_info clearfix">'+
										'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+'</div>'+
										'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
									'</div>'+
									'<div class="address_details">'+data.result[i].data.address_detail+'</div>';

			}
		}
		$('.address_box').html(defaultHtml);
		$('.edit_address').html('点击编辑');
		$('.edit_address').on('tap',function(){
			window.location.href="edit_address.html";
			window.localStorage.setItem('editNum','2');
		})
	}else{
		$('.address_box').html('<div class="text-center">请先添加地址哦～</div>');
		$('.edit_address').html('点击添加');
		$('.edit_address').on('tap',function(){
			window.location.href="add_address.html";
			window.localStorage.setItem('editNum','2');
		})
	}
})
//过期时间
function getExpireDay(str){
	var now = new Date(); 
	var endDate = new Date(str); 
	var leftTime=endDate.getTime()-now.getTime();
	var leftsecond = parseInt(leftTime/1000); 
	var day=Math.floor(leftsecond/(60*60*24)); 
	return day;
}