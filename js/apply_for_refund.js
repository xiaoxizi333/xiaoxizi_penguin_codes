var user_order_id = window.localStorage.getItem('user_order_id')*1;
var spinnerH = $('.spinner').height();
var spinnerW = $('.spinner').width();
$('.spinner').css({'position':'fixed','left':'50%','marginLeft':-spinnerW/2+'px','top':'50%','marginTop':-spinnerH/2+'px'})
$.post(config.myOrderComment,{'user_order_id':user_order_id},function(datas){
	//console.log(datas);
	var orders = datas.result.list[0].order;
	var html = '',itemPrice;
	for(var i=0;i<orders.length;i++){
		var orderObj = orders[i].data;
		if(isVipPrice){
			itemPrice = orderObj.real_price;
		}else{
			itemPrice = orderObj.public_price;
		}
		html += '<div class="show_product clearfix">'+
					'<div class="product_photo pull-left"><img src="'+orderObj.title_pics[0]+'" style="width:100%;height:100%;" alt="" /></div>'+
					'<span class="pull-left product_name shrink_font" style="padding-top: 0.625rem">'+orderObj.name+'</span>'+
					'<div class="pull-right text-right" style="padding-top: 0.625rem;">'+
						'<span style="display:block;margin-bottom: 0.8125rem;">¥'+itemPrice+'</span>'+
						'<span style="display:block">x'+orderObj.total_count+'</span>'+
					'</div>'+
				'</div>';
	}
	$('.order_box').html(html);
	var obj = datas.result.list[0].user_order.data;
	if(obj.refund_pics){
		for(var k=0;k<obj.refund_pics.length;k++){
			addEvidence(obj.refund_pics[k],'');
		}
	}
	$('.sum_refund').val(obj.total_price);
	$('.at_most').html(obj.total_price);
	$('.ship_fee').html(obj.ship_fee);
	//上传图片
	$('#fileElem').on('change',function(){
		var formData = new FormData();
		//console.log(document.getElementById("fileElem").files[0]);
		formData.append("pic", document.getElementById("fileElem").files[0]);
		$.ajax({
		    url: config.picUpload,
		    type: "POST",
	  	 	data:{'pic':'multipart'},
		    processData: false,
		    contentType: false,
		    enctype: 'multipart',
		    data: formData,
		    cache:false,
		    beforeSend:function(){
		      	$('.spinner_mask').show();
		    },
		    success:function(data){
		    	console.log(data);
		    	if(data.error_code==0){
					addEvidence(data.result.thumbnail_pic,data.result.original_pic);
		    	}    	
		    },
		    complete:function(){$('.spinner_mask').hide()},
		})
	})
	function addEvidence(thumbnail_pic,original_pic){
		try{
    		$('.fileList').append('<div class="pic_box" style="width:5rem;height:5rem;margin-right: 0.3125rem;margin-bottom: 0.3125rem;"><div class="cross_pic"></div><img src="'+thumbnail_pic+'" origin_src="'+original_pic+'" style="width:100%;height:100%;"></div>');
    	}catch(err){};
    	if($('.fileList').find('.pic_box').length>=5){
			$('.filebox').hide();
		}
		//点击x取消图片
		$('.cross_pic').off('tap').on('tap',function(){
			$(this).parent('.pic_box').remove();
			$('.filebox').show();
	    })
	}
	$('footer').on('click',function(){
		var reason = $('.refund_reason input').val()?$('.refund_reason input').val():'';
		var picUrl = [];
		for(var i=0;i<$('.fileList img').length;i++){
			var originalPicUrl = $('.fileList img').eq(i).attr('origin_src');
			if(originalPicUrl){
				picUrl.push(originalPicUrl);
			}	
		}
		picUrl = JSON.stringify(picUrl);
		var passData = {'user_order_id':user_order_id,'refund_value':$('.sum_refund').val()*1,'refund_pics':picUrl,'refund_desc':reason};
		//console.log(passData)
		$.ajax({
		    url: config.userOrderRefund,
		    type: "POST",
	  	 	data:passData,
		    cache:false, 
			async:false, 
		    success:function(datas){
		    	//console.log(datas);
		    	window.location.href = "wait_for_refund.html";
		    }
		})
	})
})
