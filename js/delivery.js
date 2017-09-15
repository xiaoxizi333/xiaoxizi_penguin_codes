var express = window.localStorage.getItem('express');
var express_pic = window.localStorage.getItem('express_pic');
var express_no = window.localStorage.getItem('express_no');
$.post(config.trackExpress,{'express':express,'express_no':express_no},function(datas){
	//console.log(datas);
	if(datas.error_code==0){
		var obj = datas.result.express_list;
		var express_company = datas.result.express_company[0].data;
		$('.product_photo').css({'backgroundImage':'url('+express_pic+')'});
		$('.specific_state').html(obj.status);
		$('.delivery_method').html(express_company.name);
		$('.order_num').html(obj.no);
		var listTxt = '';
		for(var i=0;i<obj.list.length;i++){
			var objList = obj.list[i];
			listTxt += '<li class="clearfix" style="position:relative">'+
						'<div class="state_circle pull-left"></div><div class="grey_line"></div>'+
						'<div class="specific_states pull-left">'+
							'<div class="delivery_txt">'+objList.text+'</div>'+
							'<div class="delivery_timer">'+objList.time+'</div>'+
						'</div>'+
					'</li>';
		}
		$('.delivery_state_box ul').html(listTxt);
		for(var k=0;k<$('.delivery_state_box ul li').length;k++){
			var h = $('.delivery_state_box ul li').eq(k).height()+parseFloat($('.delivery_state_box ul li').css('padding-top'));
			$('.grey_line').eq(k).css({'height':h+'px'});
		}
		$('.grey_line').eq($('.delivery_state_box ul li').length-1).hide();
	}else{
		$('.delivery_state_box ul').html('<li>暂无物流信息<li>');
	}
})