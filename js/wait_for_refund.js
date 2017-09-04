var user_order_id = window.localStorage.getItem('user_order_id')*1;
$.post(config.myOrderComment,{'user_order_id':user_order_id},function(datas){
	console.log(datas);
	var userOderObj = datas.result.list[0].user_order.data;
	var endRefundTime = userOderObj.refund_time+(1000*60*60*24*2);
	console.log(userOderObj)
	ShowCountDown(endRefundTime,'caculator')
	setInterval(function(){ShowCountDown(endRefundTime,'caculator');}, interval);
	var orders = datas.result.list[0].order;
	var html = '';
	for(var i=0;i<orders.length;i++){
		var orderObj = orders[i].data;
		html += '<div class="refund_product clearfix">'+
					'<div class="product_photo pull-left bg" style="background-image:url('+orderObj.title_pics[0]+')"></div>'+
					'<span class="pull-left" style="padding-top: 0.625rem">'+orderObj.name+'</span>'+
				'</div>';
	}
	$('.order_box').html(html);
	$('.sum_refund').html(userOderObj.total_price);
	$('.refund_reason').html(userOderObj.refund_desc);
	var RefundTimeStr = userOderObj.refund_time;
	var applyForRefund = new Date(RefundTimeStr);
	var rH = applyForRefund.getHours();
	var rM = applyForRefund.getMinutes();
	rH = rH>10?rH:'0'+rH;
	rM = rM>10?rM:'0'+rM;
	$('.apply_refund_time').html(switchDate(RefundTimeStr,'-')+' '+rH+':'+rM);

	//撤销申请
	$('.withdraw').on('click',function(){
		$.post(config.orderRefundCancel,{'user_order_id':user_order_id},function(datas){
			if(datas.error_code==0){
				console.log(datas);
				window.location.href = "my_order.html";
			}else{
				alert(datas.error_msg);
			}	
		})
	})

	//修改申请
	$('.amend').on('click',function(){
		window.localStorage.setItem('user_order_id',user_order_id);
		
		window.location.href="apply_for_refund.html";
	})






})