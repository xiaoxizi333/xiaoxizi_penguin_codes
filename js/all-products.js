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
	 $.ajax(
   {
      type:"POST",
      url:config.search,
      data:{'item_name':searchTxt}, 
      beforeSend:function(){
      	$('.spinner').show();
      },
      success:function(datas){
		//console.log(datas);
		showItems(datas);
      },
      complete:function(){$('.spinner').hide()},
  })
}
// 筛选--1
// $('.filter_part').css('min-height',$(window).height()+'px');
// $('.filter_bar_btn').on('click',function(){
// 	$('.filter_part').css({'width':'20rem','transition':'width .5s'});
// 	$.post(config.selectTag,{'state':1},function(datas){
// 		console.log(datas);
// 		var obj = datas.result.list;
// 		var html = '',
// 			subFilArr = [];
// 		for(var i=0;i<obj.length;i++){
// 			subFilArr.push({});
// 			var tagObj = obj[i];
// 			html += '<div class="filter_tabs">'+
// 						'<div class="caption">'+tagObj.wine_class_class_name+'</div>'+
// 						'<ul class="list-unstyled list-inline sort_1">'+
// 						'</ul>'+
// 					'</div>';
// 		}
// 		$('.filter_board').html(html);
// 		for(var i=0;i<obj.length;i++){
// 			for(var k=0;k<obj[i].wine_tag_list.length;k++){
// 				var firstT = obj[i].wine_tag_list[k];
// 				var tagHtml_1 = '<li data_id="'+firstT.wine_class_id+'">'+firstT.wine_class_tag_name+'</li>';	
// 				$('.sort_1').eq(i).append(tagHtml_1);
// 			}		
// 		}

// 		$('.sort_1 > li').on('tap',function(){
// 			//console.log(subFilArr)
// 			var index = $(this).parents('.filter_tabs').index();
// 			$(this).addClass('active').siblings().removeClass('active');
// 			var tagFirId = $(this).attr('data_id');
// 			var secTag = '';
// 			$.post(config.selectTag,{'state':1},function(datas){
// 				for(var i=0;i<obj.length;i++){
// 					for(var k=0;k<obj[i].wine_tag_list.length;k++){
// 						var obj2 = obj[i].wine_tag_list[k];
// 						var firstId = obj2.wine_class_id;
// 						if(tagFirId==firstId && obj2.wine_tag.length){
// 							$('.filter_mask').show(200);
// 							for(var j=0;j<obj2.wine_tag.length;j++){
// 								secTag += '<li data_id="'+obj2.wine_tag[j].id+'"><a href="javascript:;">'+obj2.wine_tag[j].tag_name+'</a></li>';
// 							}
// 						}
// 					}
// 				}
// 				$('.sort_2').html(secTag);
// 				for(var i=0;i<subFilArr.length;i++){
// 					if(subFilArr[i].active_sub){
// 						for(var b=0;b<$('.sort_2 > li').length;b++){
// 							for(var k=0;k<subFilArr[i].active_sub.length;k++){
// 								if($('.sort_2 > li').eq(b).attr('data_id')==subFilArr[i].active_sub[k]){
// 									$('.sort_2 > li').eq(b).addClass('active');
// 								}
// 							}
// 						}
// 					}
// 				}


// 				$('.sort_2 > li').on('tap',function(){
// 					$(this).toggleClass('active');
// 				})
// 				$('.finish_btn').off('tap').on('tap',function(){
// 					$('.filter_mask').hide();
// 					subFilArr[index].active_sub = [];
// 					for(var i=0;i<$('.sort_2 > li').length;i++){
// 						if($('.sort_2 > li').eq(i).hasClass('active')){
// 							subFilArr[index].active_sub.push($('.sort_2 > li').eq(i).attr('data_id'));
// 						}	
// 					}
// 				})
// 			})
// 		})
// 		$('.sure').on('tap',function(){
// 			$('.filter_part').css({'width':'0','transition':'width .5s'});
// 			var arryId = {};
// 			arryId.select_wine_tag_array = [];
// 			console.log(subFilArr)
// 			for(var i=0;i<subFilArr.length;i++){
// 				if(subFilArr[i].active_sub){
// 					for(var k=0;k<subFilArr[i].active_sub.length;k++){
// 						arryId.select_wine_tag_array.push(subFilArr[i].active_sub[k]*1);
// 					}
// 				}
// 			}
// 			console.log(arryId)
// 			arryId.item_name = $('#search').val();
// 			if($('.max_pri').val()){
// 				arryId.max_wine_price = $('.max_pri').val()*1;
// 			}
// 			if($('.min_pri').val()){
// 				arryId.min_wine_price = $('.min_pri').val()*1;
// 			}				
// 			//console.log(arryId)
// 			$.ajax({
// 			    type: "POST",
// 			    dataType:'json',
// 			    contentType:'application/json',
// 			    url: config.selectWineTag,
// 			    data: JSON.stringify(arryId), 
// 			    beforeSend:function(){
// 			      	$('.spinner').show();
// 			    },
// 			    success:function(datas){
// 					//console.log(datas);
// 					showItems(datas);
// 			    },
// 			    complete:function(){$('.spinner').hide()},
// 			})
// 		})
// 		$('.cancel').on('tap',function(){
// 			$('.filter_part').hide();
// 			$('.filter_part').css({'width':'0'});
// 		})
// 	})
// })

//筛选--2
$('.filter_part').css('min-height',$(window).height()+'px');
$('.filter_bar_btn').on('click',function(){
	$('.filter_part, .filter_mask').show();
	$.post(config.selectTag,{'state':1},function(datas){
		console.log(datas);
		var obj = datas.result.list;
		var html = '';
		for(var i=0;i<obj.length;i++){
			var tagObj = obj[i];
			html += '<div class="filter_tabs">'+
						'<div class="caption">'+tagObj.wine_class_class_name+'</div>'+
						'<ul class="list-unstyled list-inline sort_1">'+
						'</ul>'+
						'<ul class="list-unstyled sort_2">'+
						'</ul>'+
					'</div>';
		}
		$('.filter_board').html(html);
		var filterAData = JSON.parse(window.localStorage.getItem('filterA'));
		var filterBData = JSON.parse(window.localStorage.getItem("subFilter"));
		for(var i=0;i<obj.length;i++){
			for(var k=0;k<obj[i].wine_tag_list.length;k++){
				var firstT = obj[i].wine_tag_list[k];
				var tagHtml_1 = '<li data_id="'+firstT.wine_class_id+'">'+firstT.wine_class_tag_name+'</li>';	
				$('.sort_1').eq(i).append(tagHtml_1);
				$('.sort_2').eq(i).append('<li class="sub_sort_2"><span class="type_title"></span><ul class="list-unstyled list-inline second_bar"></ul></li>');
				$('.sort_2:eq('+i+') .sub_sort_2:eq('+k+')').find('.type_title').html(firstT.wine_class_tag_name);
				for(var j=0;j<firstT.wine_tag.length;j++){
					var secTag = '<li data_id="'+firstT.wine_tag[j].id+'"><a href="javascript:;">'+firstT.wine_tag[j].tag_name+'</a></li>';
					$('.sort_2:eq('+i+') .sub_sort_2:eq('+k+')').find('.second_bar').append(secTag);
					if(filterBData){
						for(var c=0;c<filterBData.select_wine_tag_array.length;c++){
							if(filterBData.select_wine_tag_array[c]==firstT.wine_tag[j].id){
								$('.sort_2:eq('+i+') .sub_sort_2:eq('+k+') .second_bar li:eq('+j+')').addClass('active');
							}
						}
					}

					
				}
				if(filterAData){
					for(var b=0;b<filterAData.active_tab_1.length;b++){
						if(filterAData.active_tab_1[b]==firstT.wine_class_id){
							$('.sort_1:eq('+i+') li:eq('+k+')').addClass('active');
							$('.sort_2:eq('+i+') .sub_sort_2:eq('+k+')').show();
						}
					}	
				}
								
			}		
		}		

		$('.sort_1 > li').on('tap',function(){
			//console.log(subFilArr)
			var tagFirId = $(this).attr('data_id');
			var index = $(this).parents('.filter_tabs').index();
			var subSortI = $(this).index();
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$('.filter_tabs:eq('+index+') .sub_sort_2:eq('+subSortI+') .second_bar li').removeClass('active');
				$('.filter_tabs:eq('+index+') .sub_sort_2:eq('+subSortI+')').hide();
			}else{
				$(this).addClass('active');
				$('.filter_tabs:eq('+index+') .sub_sort_2:eq('+subSortI+')').show();
			}
		})
		$('.second_bar > li').on('tap',function(){
			$(this).toggleClass('active');
		})
		$('.price_range_contain > li').off('tap').on('tap',function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active').siblings().removeClass('active');
			}else{
				$(this).addClass('active').siblings().removeClass('active');
			}	
		})
		$('.sure').on('click',function(){
			$('.filter_part, .filter_mask').hide();
			localStorage.removeItem('filterA');
			localStorage.removeItem('subFilter');
			var arryId = {};
			var filterA = {};
			filterA.active_tab_1 = [];
			arryId.select_wine_tag_array = [];

			for(var i=0;i<$('.filter_tabs').length;i++){
				for(var a=0;a<$('.filter_tabs:eq('+i+') .sort_1 li').length;a++){
					if($('.filter_tabs:eq('+i+') .sort_1 li:eq('+a+')').hasClass('active')){
						var filterADI = $('.filter_tabs:eq('+i+') .sort_1 li:eq('+a+')').attr('data_id')*1;
						filterA.active_tab_1.push(filterADI);
						var obj = JSON.stringify(filterA);
						window.localStorage.setItem("filterA",obj);
					}
				}
				for(var k=0;k<$('.filter_tabs').eq(i).find('.sub_sort_2').length;k++){
					for(var j=0;j<$('.filter_tabs:eq('+i+') .sub_sort_2:eq('+k+') .second_bar').find('li').length;j++){
						if($('.filter_tabs:eq('+i+') .sub_sort_2:eq('+k+') .second_bar li:eq('+j+')').hasClass('active')){
							var dataId = $('.filter_tabs:eq('+i+') .sub_sort_2:eq('+k+') .second_bar li:eq('+j+')').attr('data_id')*1;
							arryId.select_wine_tag_array.push(dataId);
							var obj = JSON.stringify(arryId);
							window.localStorage.setItem("subFilter",obj);
						}
					}
				}
			}
			arryId.item_name = $('#search').val();
			for(var i=0;i<$('.price_range_contain li').length;i++){
				if($('.price_range_contain li').eq(i).hasClass('active')){
					arryId.max_wine_price = $('.price_range_contain li:eq('+i+') .max_price_num').html()*1;
					arryId.min_wine_price = $('.price_range_contain li:eq('+i+') .min_price_num').html()*1;
				}
			}				
			//console.log(arryId)
			$.ajax({
			    type: "POST",
			    dataType:'json',
			    contentType:'application/json',
			    url: config.selectWineTag,
			    data: JSON.stringify(arryId), 
			    beforeSend:function(){
			      	$('.spinner').show();
			    },
			    success:function(datas){
					//console.log(datas);
					showItems(datas);
			    },
			    complete:function(){$('.spinner').hide()},
			})
		})
		$('.filter_cancel_btn').on('click',function(){
			$('.filter_part, .filter_mask').hide();
		})
	}) 
})
var startY,
	a;	
$(".filter_part").on("touchstart",function(event){
	startY = event.originalEvent.touches[0].pageY;
	a = parseFloat($(".filter_part").css("marginTop"));
})
$(".filter_part").on("touchmove",function(event){
	event.preventDefault();
	var nowY = event.originalEvent.touches[0].pageY;
	$(".filter_part").css("marginTop",a+(nowY-startY)+"px");
	if(a+(nowY-startY)>0){
		$(".filter_part").css("marginTop",0);
	}
	if(a+(nowY-startY)<-($('.filter_part').outerHeight()-$(window).height())){
		$(".filter_part").css("marginTop",-($('.filter_part').outerHeight()-$(window).height())+"px");
	}
}) 
// var subStartY,
// 	b;	
// $(".sort_2").on("touchstart",function(event){
// 	subStartY = event.originalEvent.touches[0].pageY;
// 	b = parseFloat($(".sort_2").css("marginTop"));
// })
// $(".sort_2").on("touchmove",function(event){
// 	event.preventDefault();
// 	var nowY = event.originalEvent.touches[0].pageY;
// 	if($('.sort_2').outerHeight()>$('.filter_content').height()){
// 		if(b+(nowY-subStartY)<-($('.sort_2').outerHeight()-$('.filter_content').height())){
// 			$(".sort_2").css("marginTop",-($('.sort_2').outerHeight()-$('.filter_content').height())+"px");
// 		}else{
// 			$(".sort_2").css("marginTop",b+(nowY-subStartY)+"px");
// 		}
// 	}
// 	if(b+(nowY-subStartY)>0){
// 		$(".sort_2").css("marginTop",0);
// 	}
// })
function showItems(datas){
	var detailsObj = datas.result;
	if (datas.error_code==0&&detailsObj.length) {
		var detailsHtml = '',
			corePic;
		for(var i=0;i<detailsObj.length;i++){
			if(detailsObj[i].data.cover_pic){
				corePic = detailsObj[i].data.cover_pic;
			}else{
				corePic = detailsObj[i].data.title_pics[0];
			}
			detailsHtml += '<div class="picBox"><img src="'+corePic+'" class="details" data_id="'+detailsObj[i].id+'"></div>';
		}
		$('.SKU_details').html(detailsHtml);
		//for(var i=0;i<detailsObj.length;i++){
			$('.picBox .details').off('click').on('click',function(){
				var itemID = $(this).attr('data_id');
				var goodsIndex = $(this).parent('.picBox').index();
				var specId = detailsObj[goodsIndex].data.good_item_spec_id?detailsObj[goodsIndex].data.good_item_spec_id:0;
				window.localStorage.setItem('itemID',itemID);
				window.localStorage.setItem('itemSpecId',specId);
				var saleStartTime = detailsObj[goodsIndex].data.sales_start_time*1;
				var secStartTime = detailsObj[goodsIndex].data.seckill_startime*1;
				var secEndTime = detailsObj[goodsIndex].data.seckill_endtime*1;
				var isSeckill = detailsObj[goodsIndex].data.is_seckill*1;
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
		//}
	}else{
		$('.SKU_details').html('<img src="img/penguinnn_search2@2x.png" style="width:18.75rem">');
	}
}



