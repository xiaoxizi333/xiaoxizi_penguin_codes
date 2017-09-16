$.post(config.commonBanner,{'class_type':'prime'},function(datas){
	//console.log(datas);
	var obj = datas.result[0].data.show_pic_arr;
	var picUrl = datas.result[0].data.jump_urls;
	var html = '';
	if(obj!==undefined){
		if(picUrl&&picUrl.length>0){	
			for(var i=0;i<obj.length;i++){		
				html += '<div class="swiper-slide">'+
					    	'<img src="'+obj[i]+'" class="pic_for_banner" item_id="'+picUrl[i].item_id+'" item_spec_id="'+picUrl[i].item_spec_id+'" style="width: 100%;height:10.625rem">'+
					    	'<div class="banner_txt"><span style="font-size: 2.125rem;letter-spacing:0.34px;">精品</span><span style="font-size: 1.75rem;letter-spacing:0.28px;">系列</span></div>'+
					    '</div>';
			}
		}
		$('.banner_box').html(html);
		jumpToGoods($('.pic_for_banner'));
	}		
	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		autoplay: 3000,//可选选项，自动滑动
		autoplayDisableOnInteraction:false//使滑动效果不停止
	})
})
//商品列表
var pageNm = 1;
getdata(pageNm,'prime');
filterGoods('prime');
$('.filter_tab li a').on('tap',function(){
	$('.filter_tab li a').removeClass('active');
	$(this).addClass('active');
})

