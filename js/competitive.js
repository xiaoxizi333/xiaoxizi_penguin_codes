$.post(config.commonBanner,{'class_type':'prime'},function(datas){
	//console.log(datas);
	var obj = datas.result[0].data.show_pic_arr;
	var picUrl = datas.result[0].data.jump_urls;
	var html = '';
	if(obj!==undefined){
		for(var i=0;i<obj.length;i++){
			if(picUrl==undefined){		
				html += '<div class="swiper-slide">'+
					    	'<img src="'+obj[i]+'" alt="" style="width: 100%;height:10.625rem">'+
					    	'<div class="banner_txt"><span style="font-size: 2.125rem;letter-spacing:0.34px;">精品</span><span style="font-size: 1.75rem;letter-spacing:0.28px;">系列</span></div>'+
					    '</div>';
			}else{
				if(picUrl[i]==""||picUrl[i]==undefined){
					html += '<div class="swiper-slide">'+
							'<a>'+
						    	'<img src="'+obj[i]+'" alt="" style="width: 100%;height:10.625rem">'+
						    	'<div class="banner_txt"><span style="font-size: 2.125rem;letter-spacing:0.34px;">精品</span><span style="font-size: 1.75rem;letter-spacing:0.28px;">系列</span></div>'+
					    	'</a>'+
					    '</div>';
				}else{
					html += '<div class="swiper-slide">'+
							'<a href="'+picUrl[i]+'">'+
						    	'<img src="'+obj[i]+'" alt="" style="width: 100%;height:10.625rem">'+
						    	'<div class="banner_txt"><span style="font-size: 2.125rem;letter-spacing:0.34px;">精品</span><span style="font-size: 1.75rem;letter-spacing:0.28px;">系列</span></div>'+
					    	'</a>'+
					    '</div>';
				}
			}
		}
	}
	$('.banner_box').html(html);	
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

