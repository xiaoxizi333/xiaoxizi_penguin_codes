var groupId = {'group_id_array':[window.localStorage.getItem('groupId')*1]};
var productNm = window.localStorage.getItem('productNm');
$.ajax({
	type: "POST",
    dataType:'json',
    contentType:'application/json',
    url: config.findGroupBy,
    data: JSON.stringify(groupId), 
    success: function(datas){
    	//console.log(datas);
    	var obj = datas.result.list[0];
    	$('header').html(productNm);
    	$('.main_product .product_photo').attr('style','background-image:url("'+obj.group_info_group_pic+'")');
   		$('.main_product_pic').html(obj.group_info_title);
      $('.price .origin_price del').html(obj.group_info_origin_price);
   		$('.price .new_price').html(obj.group_info_group_price);
      $('.total_price').html('合计¥'+' '+obj.group_info_group_price);
      $('.origin_price').html('原价¥'+obj.group_info_origin_price);
   		var packageItem = obj.maps_group,
          itemDetail = '';
   		for(var i=0;i<packageItem.length;i++){
   			itemDetail += '<div class="choose_product clearfix">'+
           							'<div class="product_photo pull-left bg" style="background-image:url('+packageItem[i].item_info[0].title_pics[0]+')"></div>'+
        								'<div class="pull-left" style="padding-top:0.4rem;width: 50%;">'+packageItem[i].item_info[0].name+'</div>'+
        								'<div class="price pull-right">'+
        									'<div class="text-right" style="padding-top:0.4rem;">¥<span></span>'+packageItem[i].map_group_price+'</div>'+
        									'<div class="text-right"><del>¥<span></span>'+packageItem[i].item_info[0].real_price+'</del></div>'+
        								'</div>'+
        							'</div>';
   		}
    	$('.choose_product_box').html(itemDetail);
    	$('.buy').on('tap',function(){
        $.post(config.billing,{'uid':uid,'item_group_id':groupId.group_id_array[0]},function(data){
            //console.log(data)
            if(data.error_code==0){
              var goodsInfo,
              goodsBox = [],
              obj = data.result.order;
              for(var i=0;i<obj.length;i++){
                var obj2 = obj[i].data;
                goodsInfo = {};
                goodsBox.push(goodsInfo);
                goodsBox[i].goods_name = obj2.name;
                goodsBox[i].goods_prcie = obj2.real_price;
                goodsBox[i].goods_pic = [obj2.title_pics[0]];
                goodsBox[i].goods_count = obj2.total_count;
                goodsBox[i].goods_id = data.result.order[i].id;
                goodsBox[i].goods_desc = obj[i].data.sub_name;

              }
              //console.log(goodsBox)
              goodsBox = JSON.stringify(goodsBox);
              window.localStorage.setItem('total_price',data.result.user_order[0].data.total_price);
              window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
              window.localStorage.setItem('item_total_price',data.result.user_order[0].data.item_total_price);
              window.localStorage.setItem('delivery_type',data.result.user_order[0].data.post_type);
              window.localStorage.setItem('ship_fee',data.result.user_order[0].data.ship_fee);
              window.localStorage.setItem('preserveId',data.result.user_order[0].data.is_prestore);

              window.localStorage.setItem('goodsBox',goodsBox);
              window.localStorage.setItem('identity',data.result.user_order[0].data.id_no);
              window.localStorage.setItem('jump_btn','1');
              window.localStorage.setItem('counts_num','0');
              window.localStorage.setItem('package','0');
              window.location.href="firm_order.html";
            }else{
              alert(data.error_msg)
            }
        })
      })
    }
 })
