//var tabId = window.localStorage.getItem('tabId')*1;
var tabId = getQueryString('tabId')*1;

var tabOrList = window.localStorage.getItem('tabOrList');
var bannerData;
//if(tabOrList=='0'){
	bannerData = {'class_id':tabId};
//}else if(tabOrList=='1'){
	//bannerData = {'class_type':'all'};
//}
//banner
addBanner(bannerData);
function addBanner(bannerData){
	$.post(config.commonBanner,bannerData,function(datas){
		//console.log(datas);
		var obj = datas.result[0].data.show_pic_arr;
		var picUrl = datas.result[0].data.jump_urls;
		var bannerBox = '';
		if(obj!==undefined){
			if(picUrl&&picUrl.length>0){	
				for(var i=0;i<obj.length;i++){	
					bannerBox += ' <div class="swiper-slide"><img src="'+obj[i]+'" class="pic_for_banner" item_id="'+picUrl[i].item_id+'" item_spec_id="'+picUrl[i].item_spec_id+'" style="width: 100%;"></div>';					
				}
			}	
			$('.banner2_box').html(bannerBox);	
			jumpToGoods($('.pic_for_banner'));		
		}
		var mySwiper = new Swiper('.swiper-container', {
			pagination : '.swiper-pagination',
			autoplay: 3000,//可选选项，自动滑动
			autoplayDisableOnInteraction:false,//使滑动效果不停止
			observer:true
		})
	})
}

//var firstItem = window.localStorage.getItem('tabId');
var firstItem = getQueryString('tabId');
var dataObj = {'item_class':firstItem};
searchItems(dataObj);
//一级列表
// $.post(config.indexItemClassList,function(datas){
// 	//console.log(datas);
// 	var obj = datas.result;
// 	//console.log(obj)
// 	var html = '';
// 	for(var i=0;i<obj.length;i++){
// 		html += '<li id="'+obj[i].id+'"><a href="javascript:;">'+obj[i].data.class_name+'</a></li>';
// 	}
// 	$('.sort_tab').html(html);
// 	for(var j=0;j<obj.length;j++){
// 		var tabId = parseInt(getQueryString('tabId'));
// 		if(tabId == obj[j].id){
// 			$('.sort_tab li').removeClass('active');
// 			$('.sort_tab li').eq(j).addClass('active');
// 		}
// 		addTabActive($('.sort_tab li'));
// 	}
// 	//点击搜索
// 	$('.sort_tab li').on('tap',function(){
// 		//window.localStorage.setItem('tabId',$(this).attr('id'));
// 		bannerData = {'class_id':$(this).attr('id')};
// 		addBanner(bannerData);
// 		$('.SKU_details').empty();
// 		$('.product_tab li').removeClass('active');
// 		var itemIndex = $(this).index();
// 		var itemClass = datas.result[itemIndex].id;
// 		window.localStorage.setItem('item_class',itemClass);
// 		var state = window.localStorage.getItem('state');
// 		var passData;
// 		//console.log(typeof state)
// 		//console.log(state)
// 		if(state){
// 			if(state == '[1443230295066968]'){
// 				state = JSON.parse(state);
// 				passData = {'item_class':itemClass,'tag_id_array':state,'limit':20000};
// 			}else{
// 				state = JSON.parse(state);
// 				passData = {'item_class':itemClass,'sort':state,'limit':20000};
// 			}	
// 		}else{
// 			passData = {'item_class':itemClass,'limit':20000}
// 		}
// 		searchItems(passData);
// 		window.location.href = "all-products-classify.html?tabId="+$(this).attr('id');
// 	})
// })
//二级标签
// addTabActive($('.filter_tab li'));
// $('.filter_tab li').on('tap',function(){
// 	$('.SKU_details').empty();
// 	$('.product_tab li').removeClass('active');
// 	var itemIndex = $(this).index();
// 	var passData;
// 	var itemClass = window.localStorage.getItem('item_class');
// 	if(itemIndex==0){
// 		passData = {'item_class':itemClass,sort:{"data.sales_count":"desc"},'limit':20000};
// 		var sortState = {"data.sales_count":"desc"};
// 		sortState = JSON.stringify(sortState); 
// 		window.localStorage.setItem('state',sortState);
// 	}else if(itemIndex==1){
// 		passData = {'item_class':itemClass,'tag_id_array':[1443230295066968],'limit':20000};
// 		var sortState = [1443230295066968];
// 		sortState = JSON.stringify(sortState); 
// 		window.localStorage.setItem('state',sortState);
// 	}else if(itemIndex==2){
// 		passData = {'item_class':itemClass,'sort':{"data.published_at":"desc"},'limit':20000};
// 		var sortState = {"data.published_at":"desc"};
// 		sortState = JSON.stringify(sortState); 
// 		window.localStorage.setItem('state',sortState);
// 	}
// 	searchItems(passData);
// })
//三级标签
// $.post(config.tagList,function(datas){
// 	//console.log(datas);
// 	var obj = datas.result;
// 	var html = '';
// 	for(var i=0;i<obj.length;i++){
// 		html += '<li id="'+obj[i].id+'"><a href="javascript:;">'+obj[i].data.tag_name+'</a></li>';
// 	}
// 	$('.product_tab').html(html);
// 	addTabActive($('.product_tab li'));
// 	$('.product_tab li').on('tap',function(){
// 		$('.SKU_details').empty();
// 		var passData;
// 		var itemClass = window.localStorage.getItem('item_class');
// 		var sortState = window.localStorage.getItem('state');
// 		var sortState2 = JSON.parse(sortState);
// 		var sortId = $(this).attr('id')*1;
// 		sortState2[1] = JSON.parse(sortId);
// 		if(sortState){
// 			if(sortState == '[1443230295066968]'){
// 				passData = {'item_class':itemClass,'tag_id_array':sortState2,'limit':20000};
// 			}else{
// 				var sortNum = JSON.parse(sortState);
// 				var arr = [];
// 				arr[0] = sortId;
// 				var tagId = JSON.stringify(arr);
// 				tagId = JSON.parse(tagId);
// 				passData = {'item_class':itemClass,'sort':sortNum,'tag_id_array':tagId,'limit':20000};
// 			}	
// 		}else{	
// 			passData = {'item_class':itemClass,'tag_id_array':tagId,'limit':20000}
// 		}
// 		//console.log(passData)
// 		searchItems(passData);
// 	})
// })
// function addTabActive(obj){
// 	obj.on('tap',function(){
// 		obj.removeClass('active');
// 		$(this).addClass('active');
// 	})
// }	
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
			var corePic;
			for(var i=0;i<detailsObj.length;i++){
				if(detailsObj[i].data.cover_pic){
					corePic = detailsObj[i].data.cover_pic;
				}else{
					corePic = detailsObj[i].data.title_pics[0];
				}
				detailsHtml += '<div class="detail_pic" data_id="'+detailsObj[i].id+'"><img src="'+corePic+'" class="details"></div>';
			}
			$('.SKU_details').html(detailsHtml);
			for(var i=0;i<detailsObj.length;i++){
				$('.detail_pic').off('click').on('click',function(){
					var itemID = $(this).attr('data_id');
					var goodsIndex = $(this).index();
					var specId = detailsObj[goodsIndex].good_item_spec_id?detailsObj[goodsIndex].good_item_spec_id:0;
					var saleStartTime = detailsObj[goodsIndex].data.sales_start_time==undefined?'':detailsObj[goodsIndex].data.sales_start_time*1;
					var secStartTime = detailsObj[goodsIndex].data.seckill_startime==undefined?'':detailsObj[goodsIndex].data.seckill_startime*1;
					var secEndTime = detailsObj[goodsIndex].data.seckill_endtime==undefined?'':detailsObj[goodsIndex].data.seckill_endtime*1;
					var isSeckill = detailsObj[goodsIndex].data.is_seckill==undefined?'':detailsObj[goodsIndex].data.is_seckill*1;
					var nowTime = Date.parse(new Date())*1;
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
						if(isSeckill===0){
							window.location.href="product_details.html?itemID="+itemID+"&specId="+specId;
						}else if(isSeckill===1){
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
	    }
	});
}