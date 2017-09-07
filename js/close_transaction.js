var user_order_id = window.localStorage.getItem('user_order_id')*1;
//地址	
$.post(config.userOrderAddress,{'user_order_id':user_order_id},function(datas){
	//console.log(datas);
	var addressObj = datas.result[0].data;
	$('.user_name').html(addressObj.contact_user_name);
	$('.user_phone').html(addressObj.contact_phone);
	$('.address_details').html(addressObj.address_detail);
})
//商品
$.post(config.myOrderComment,{'user_order_id':user_order_id},function(datas){
	console.log(datas);
	var orderObj = datas.result.list[0].order;
	$('.order_numbers').html(datas.result.list[0].user_order.id);
	for(var i=0;i<orderObj.length;i++){
		var obj = orderObj[i].data;
		var descData = orderObj[i].data.sub_name;
		var productHtml = '<li class="clearfix">'+
							'<div class="product_photo pull-left bg" style="background-image:url('+obj.title_pics[0]+')"></div>'+
							'<div class="description pull-left">'+
								'<div style="padding-top: 0.8125rem;margin-bottom: 0.8125rem;color:#5a5a5a">'+obj.name+'</div>'+
								'<div class="supplement"></div>'+
							'</div>'+
							'<div class="about_cost pull-right">'+
								'<div class="text-right" style="padding-top: 0.8125rem;margin-bottom: 0.8125rem">¥'+obj.real_price+'</div>'+
								'<div class="text-right">x'+obj.total_count+'</div>'+
							'</div>'+
						'</li>';
		$('.product_list').append(productHtml);
		$('.product_det ul').find('.supplement').eq(i).append(descData);	
	}
	$('.total_count').html(datas.result.list[0].user_order.data.item_total_count);

})
//删除按钮
$('.delete_btn').on('click',function(){
	$.post(config.orderListRemove,{'user_order_id':user_order_id},function(datas){
		if(datas.error_code==0){
			alert('删除成功～');
			window.location.href="my_order.html";
		}else{
			showTips(datas.error_msg);
		}
	})
})
