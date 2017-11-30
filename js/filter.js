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

			window.localStorage.setItem('total_data_of_filter',JSON.stringify(arryId));				
			//console.log(arryId);
			window.localStorage.setItem('filterNum',2);
			window.location.href = "all-products.html";
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