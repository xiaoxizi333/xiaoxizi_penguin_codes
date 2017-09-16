var tabId = window.localStorage.getItem('tabId')*1;
var tabOrList = window.localStorage.getItem('tabOrList');
var bannerData;
//if(tabOrList=='0'){
	bannerData = {'class_id':tabId};
//}else if(tabOrList=='1'){
	//bannerData = {'class_type':'all'};
//}
//banner
$.post(config.commonBanner,bannerData,function(datas){
	//console.log(datas);
	var obj = datas.result[0].data.show_pic_arr;
	var picUrl = datas.result[0].data.jump_urls;
	var bannerBox = '';
	if(obj!==undefined){
		if(picUrl&&picUrl.length>0){	
			for(var i=0;i<obj.length;i++){	
				bannerBox += ' <div class="swiper-slide"><img src="'+obj[i]+'" class="pic_for_banner" item_id="'+picUrl[i].item_id+'" item_spec_id="'+picUrl[i].item_spec_id+'" style="width: 100%;height:14.375rem"></div>';					
			}
		}	
		$('.banner2_box').html(bannerBox);	
		jumpToGoods($('.pic_for_banner'));		
	}
	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		autoplay: 3000,//可选选项，自动滑动
		autoplayDisableOnInteraction:false//使滑动效果不停止
	})
})
var firstItem = window.localStorage.getItem('tabId');
$.post(config.allItemList,{'item_class':firstItem},function(datas){
	//console.log(datas);
	var detailsObj = datas.result;
	var detailsHtml = '';
	for(var i=0;i<detailsObj.length;i++){
		detailsHtml += '<div><img src="'+detailsObj[i].data.title_pics+'" class="details"></div>';
	}
	$('.SKU_details').html(detailsHtml);
})
//一级列表
$.post(config.indexItemClassList,function(datas){
	//console.log(datas);
	var obj = datas.result;
	//console.log(obj)
	var html = '';
	for(var i=0;i<obj.length;i++){
		html += '<li id="'+obj[i].id+'"><a href="javascript:;">'+obj[i].data.class_name+'</a></li>';
	}
	$('.sort_tab').html(html);
	for(var j=0;j<obj.length;j++){
		var tabId = parseInt(window.localStorage.getItem('tabId'));
		if(tabId == obj[j].id){
			$('.sort_tab li').removeClass('active');
			$('.sort_tab li').eq(j).addClass('active');
		}
		addTabActive($('.sort_tab li'));
	}
	//点击搜索
	$('.sort_tab li').on('tap',function(){
		$('.SKU_details').empty();
		$('.product_tab li').removeClass('active');
		var itemIndex = $(this).index();
		var itemClass = datas.result[itemIndex].id;
		window.localStorage.setItem('item_class',itemClass);
		var state = window.localStorage.getItem('state');
		var passData;
		//console.log(typeof state)
		//console.log(state)
		if(state){
			if(state == '[1379545677630329]'){
				state = JSON.parse(state);
				passData = {'item_class':itemClass,'tag_id_array':state};
			}else{
				state = JSON.parse(state);
				passData = {'item_class':itemClass,'sort':state};
			}	
		}else{
			passData = {'item_class':itemClass}
		}
		searchItems(passData);
	})
})
//二级标签
addTabActive($('.filter_tab li'));
$('.filter_tab li').on('tap',function(){
	$('.SKU_details').empty();
	$('.product_tab li').removeClass('active');
	var itemIndex = $(this).index();
	var passData;
	var itemClass = window.localStorage.getItem('item_class');
	if(itemIndex==0){
		passData = {'item_class':itemClass,sort:{"data.sales_count":"desc"}};
		var sortState = {"data.sales_count":"desc"};
		sortState = JSON.stringify(sortState); 
		window.localStorage.setItem('state',sortState);
	}else if(itemIndex==1){
		passData = {'item_class':itemClass,'tag_id_array':[1379545677630329]};
		var sortState = [1379545677630329];
		sortState = JSON.stringify(sortState); 
		window.localStorage.setItem('state',sortState);
	}else if(itemIndex==2){
		passData = {'item_class':itemClass,'sort':{"data.published_at":"desc"}};
		var sortState = {"data.published_at":"desc"};
		sortState = JSON.stringify(sortState); 
		window.localStorage.setItem('state',sortState);
	}
	searchItems(passData);
})
//三级标签
$.post(config.tagList,function(datas){
	//console.log(datas);
	var obj = datas.result;
	var html = '';
	for(var i=0;i<obj.length;i++){
		html += '<li id="'+obj[i].id+'"><a href="javascript:;">'+obj[i].data.tag_name+'</a></li>';
	}
	$('.product_tab').html(html);
	addTabActive($('.product_tab li'));
	$('.product_tab li').on('tap',function(){
		$('.SKU_details').empty();
		var passData;
		var itemClass = window.localStorage.getItem('item_class');
		var sortState = window.localStorage.getItem('state');
		var sortState2 = JSON.parse(sortState);
		var sortId = $(this).attr('id')*1;
		sortState2[1] = JSON.parse(sortId);
		if(sortState){
			if(sortState == '[1379545677630329]'){
				passData = {'item_class':itemClass,'tag_id_array':sortState2};
			}else{
				var sortNum = JSON.parse(sortState);
				var arr = [];
				arr[0] = sortId;
				var tagId = JSON.stringify(arr);
				tagId = JSON.parse(tagId);
				passData = {'item_class':itemClass,'sort':sortNum,'tag_id_array':tagId};
			}	
		}else{	
			passData = {'item_class':itemClass,'tag_id_array':tagId}
		}
		//console.log(passData)
		searchItems(passData);
	})
})
function addTabActive(obj){
	obj.on('tap',function(){
		obj.removeClass('active');
		$(this).addClass('active');
	})
}	
function searchItems(passData){
	$.ajax({
	    type: "POST",
	    dataType:'json',
	    contentType:'application/json',
	    url: config.allItemList,
	    data: JSON.stringify(passData), 
	    success: function(datas){
	        console.log(datas);
			var detailsObj = datas.result;
			var detailsHtml = '';
			for(var i=0;i<detailsObj.length;i++){
				detailsHtml += '<div class="detail_pic" data_id="'+detailsObj[i].id+'"><img src="'+detailsObj[i].data.title_pics+'" class="details"></div>';
			}
			$('.SKU_details').html(detailsHtml);
			for(var i=0;i<detailsObj.length;i++){
				$('.detail_pic').off('click').on('click',function(){
					var itemID = $(this).attr('data_id');
					var goodsIndex = $(this).index();
					var specId = detailsObj[goodsIndex].good_item_spec_id?detailsObj[goodsIndex].good_item_spec_id:0;
					window.localStorage.setItem('itemID',itemID);
					window.localStorage.setItem('itemSpecId',specId);
					var saleStartTime = detailsObj[goodsIndex].data.sales_start_time;
					var secStartTime = detailsObj[goodsIndex].data.seckill_startime;
					var secEndTime = detailsObj[goodsIndex].data.seckill_endtime;
					var isSeckill = detailsObj[goodsIndex].data.is_seckill;
					var nowTime = Date.parse(new Date());
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
	    }
	});
}