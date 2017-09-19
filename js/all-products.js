var searchItemNm = window.localStorage.getItem('search_item_name');
$('#search').val(searchItemNm);
searchItem();
// 搜索
$('#search').on('keydown',function(e){
	if(e.keyCode ==13){
		searchItem();
	}
})
function searchItem(){
	$('.SKU_details').empty();
	var searchTxt = $('#search').val();
	window.localStorage.setItem('search_item_name',searchTxt);
	//console.log(searchTxt);
	 $.ajax(
   {
      type:"POST",
      url:config.search,
      data:{'item_name':searchTxt}, 
      beforeSend:function(){
      	$('.spinner').show();
      },
      success:function(datas){
		console.log(datas);
		var detailsObj = datas.result;
		if (datas.error_code==0&&detailsObj.length) {
			var detailsHtml = '';
			for(var i=0;i<detailsObj.length;i++){
				detailsHtml += '<div class="picBox"><img src="'+detailsObj[i].data.title_pics+'" class="details" data_id="'+detailsObj[i].id+'"></div>';
			}
			$('.SKU_details').html(detailsHtml);
			for(var i=0;i<detailsObj.length;i++){
				$('.picBox .details').off('click').on('click',function(){
					var itemID = $(this).attr('data_id');
					var goodsIndex = $(this).index();
					var specId = detailsObj[goodsIndex].data.good_item_spec_id?detailsObj[goodsIndex].good_item_spec_id:0;
					window.localStorage.setItem('itemID',itemID);
					window.localStorage.setItem('itemSpecId',specId);
					var saleStartTime = detailsObj[goodsIndex].data.sales_start_time;
					var secStartTime = detailsObj[goodsIndex].data.seckill_startime;
					var secEndTime = detailsObj[goodsIndex].data.seckill_endtime;
					var isSeckill = detailsObj[goodsIndex].data.is_seckill;
					var nowTime = Date.parse(new Date());
					//console.log(isSeckill)
					if(saleStartTime||isSeckill){
						if(saleStartTime>0){
			    			if(saleStartTime-nowTime>0){
			    				window.location.href="pre_sale.html?itemID="+itemID+"&specId="+specId;
			    			}else{
			    				window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
			    			}
			    		//跳转正常
			    		}else if(saleStartTime<0){
			    			window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
			    		}
			    		//跳转 0:正常详情 1:秒杀详情
						if(isSeckill==0){
							window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
						}else if(isSeckill==1){
							if(nowTime>secStartTime&&nowTime<secEndTime){
								window.location.href="seckill.html?itemID="+itemID+"&specId="+specId;
							}else{
								window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
							}	
						}
					}else{
						window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
					}		
				})
			}
		}else{
			$('.SKU_details').html('<img src="img/penguinnn_search2@2x.png">');
		}
      },
      complete:function(){$('.spinner').hide()},
  })
}