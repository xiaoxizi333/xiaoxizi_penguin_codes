// $('.choose_btn').on('tap',function () {
// 	var index = $(this).attr('data_num');
// 	$('.choose_product').removeClass('active');
// 	$('.choose_btn').parent('.choose_product').eq(index).addClass('active');
// })
var groupId = {'group_id_array':[window.localStorage.getItem('groupId')*1]};
var productNm = window.localStorage.getItem('productNm');
$.ajax({
	type: "POST",
    dataType:'json',
    contentType:'application/json',
    url: config.findGroupBy,
    data: JSON.stringify(groupId), 
    success: function(datas){
    	console.log(datas);
    	var obj = datas.result.list[0];
    	$('header').html(productNm);
    	$('.main_product .product_photo').html('<img style="width:100%;height:100%;" src="'+obj.group_info_group_pic+'">');
   		$('.main_product_pic').html(obj.group_info_title);
      $('.price .origin_price del').html(obj.group_info_origin_price);
   		$('.price .new_price').html(obj.group_info_group_price);
   		var packageItem = obj.maps_group;
   		var itemDetail = '';
   		for(var i=0;i<packageItem.length;i++){
   			itemDetail += '<div class="choose_product clearfix">'+
   							'<div class="product_photo pull-left"><img src="'+packageItem[i].item_info[0].title_pics[0]+'" style="width:100%;height:100%"></div>'+
								'<div class="pull-left" style="padding-top:0.4rem;width: 50%;">'+packageItem[i].item_info[0].name+'</div>'+
								'<div class="price pull-right">'+
									'<div class="text-right" style="padding-top:0.4rem;">¥<span></span>'+packageItem[i].map_group_price+'</div>'+
									'<div class="text-right"><del>¥<span></span>'+packageItem[i].item_info[0].real_price+'</del></div>'+
								'</div>'+
							'</div>';
   		}
    	$('.choose_product_box').html(itemDetail);
    	
    }
 })
$('.buy').on('tap',function(){
    $.post(config.billing,{'uid':1370724016130198,'item_group_id':groupId.group_id_array[0]},function(data){
        //console.log(data)
        if(data.error_code==0){
          window.location.href="firm_order.html";
        }else{
          alert(error_code)
        }
    })
})