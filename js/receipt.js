//receipt type
var whichShow = window.localStorage.getItem('whichShow');
//console.log(whichShow);
if(whichShow==null){
	whichShow = 1;
}
showType(whichShow);
$('.receipt_type > span').on('tap',function(){
	$('.receipt_type > span').removeClass('active');
	$(this).addClass('active');
	var index = $(this).index();
	showType(index);	
})
function showType(index){
	if(index==0){
		$('.personal_info_for_company').show();
		$('.personal_info').hide();
	}else if(index==1){
		$('.personal_info_for_company').hide();
		$('.personal_info').show();
	}
}
//receipt title
$('.invoice_title > span').on('tap',function(){
	$('.invoice_title > span').removeClass('active');
	$(this).addClass('active');
})
var invoice_user_id = window.localStorage.getItem('user_order_id');
$.post(config.userOrderInvoice,{'user_order_id':invoice_user_id},function(datas){
	console.log(datas);
	var obj = datas.result[0].data;
	var typeIndex = obj.invoice_type;
	var titleIndex = obj.invoice_title;
	if(typeIndex!==undefined){
		$('.receipt_type > span').removeClass('active');
		$('.receipt_type > span').eq(typeIndex).addClass('active');
	}
	if(titleIndex!==undefined){
		$('.invoice_title > span').removeClass('active');
		$('.invoice_title > span').eq(titleIndex).addClass('active');
	}	
	if(obj.pay_taxes_no!==undefined){
		$('.pay_taxes').val(obj.pay_taxes_no);
	}
	if(obj.receive_company!==undefined){
		$('.username').val(obj.receive_company);
	}
	if(obj.receive_company!==undefined){
		$('.phone_num').val(obj.receive_phone);
	}
	if(obj.receive_email!==undefined){
		$('.email_num').val(obj.receive_email);
	}
})
$('footer').on('tap',function(){
	var receiptType = $('.receipt_type > span.active').attr('data_num');
	var receiptTitle = $('.invoice_title > span.active').attr('data_num');
	var payTaxes = $('.pay_taxes').val();
	var companyNm= $('.username').val();
	var phoneNum = $('.phone_num').val();
	var emailNum = $('.email_num').val();
	window.localStorage.setItem('whichShow',receiptType);
	if(receiptType==0){
		if($('.username').val()==''){
			showTips('请填写名称');
		}else if($('.pay_taxes').val()==''){
			showTips('请填写纳税人识别号');
		}else{
			$.post(config.receipt,{'user_order_id':invoice_user_id,'invoice_title':receiptTitle,'invoice_type':receiptType,'receive_company':companyNm,'pay_taxes_no':payTaxes},function(data){
				//console.log(data);				
				window.location.href="firm_order.html";
			})
		}		
	}else if(receiptType==1){
		if(!validator.IsPhoneNumber($('.phone_num').val())){
			showTips('请填写正确手机号');
		}else if(!validator.IsEmail($('.email_num').val())){
			showTips('请填写正确邮箱');
		}else{
			$.post(config.receipt,{'user_order_id':invoice_user_id,'invoice_title':receiptTitle,'invoice_type':receiptType,'receive_phone':phoneNum,'receive_email':emailNum},function(data){
				//console.log(data);
				window.location.href="firm_order.html";
			})
		}		
	}

})
