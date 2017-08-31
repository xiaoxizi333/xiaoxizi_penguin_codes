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
	//console.log(searchTxt);
	$.post(config.search,{'item_name':searchTxt},function(datas){
		console.log(datas);
		var detailsObj = datas.result;
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
				console.log(isSeckill)
				if(saleStartTime||isSeckill){
					if(saleStartTime>0){
		    			if(saleStartTime-nowTime>0){
		    				window.location.href="pre_sale.html";
		    			}else{
		    				window.location.href="product_details.html";
		    			}
		    		//跳转正常
		    		}else if(saleStartTime<0){
		    			window.location.href="product_details.html";
		    		}
		    		//跳转 0:正常详情 1:秒杀详情
					if(isSeckill==0){
						window.location.href="product_details.html";
					}else if(isSeckill==1){
						if(nowTime>secStartTime&&nowTime<secEndTime){
							window.location.href="seckill.html";
						}else{
							window.location.href="product_details.html";
						}
						
					}
				}else{
					window.location.href="product_details.html";
				}
						
			})
		}
	})
}