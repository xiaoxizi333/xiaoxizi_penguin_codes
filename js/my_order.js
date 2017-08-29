//订单列表
getdata(1);

//分页
function getdata(page){
	var pageData={};
	if(page!==undefined){
		pageData.page=page;
	}
	$.post(config.userOrderList,{'uid':uid,'page':pageData.page},function(datas){
		var obj = datas.result.list;
		var orderBox = '',
			realOrderList = '';
		for(var i=0;i<obj.length;i++){
			var orderData = obj[i].user_order.data;
			orderBox += '<li class="order_list_box">'+
							'<ul class="list-unstyled my_order_det">'+
								'<li>'+
									'<div class="clearfix" style="padding-bottom: 1.25rem;padding-top: 0.9375rem;">'+
										'<span class="order_num pull-left">订单编号 '+obj[i].user_order.id+'</span>'+
										'<span class="order_state pull-right">已发货</span>'+
									'</div>'+
									'<div class="product_det">'+
										'<ul class="list-unstyled">'+
										'</ul>'+
									'</div>'+
									'<div class="sum clearfix">'+
										'<div class="pull-left">'+
											'<span>共'+orderData.total_count+'件</span><span class="counts">合计 <span class="sum_money">¥'+orderData.item_total_price+'</span></span>'+
										'</div>'+
										'<div class="pull-right">'+
											'<span class="check_state">查看动态</span><span class="sure_get_goods">确认收货</span>'+
										'</div>'+
									'</div>'+
								'</li>'+
							'</ul>'+
						'</li>';
		}
		$('.order_box').append(orderBox);
		
		for(var i=0;i<obj.length;i++){
			var listObj = datas.result.list[i].order;
			for(var j=0;j<listObj.length;j++){
				var listData = listObj[j].data;
				var descData = listObj[j].item_info[0].data.sales_points;

				realOrderList = '<li class="clearfix">'+
									'<div class="product_photo pull-left" style="background-image:url('+listData.title_pics[0]+');background-position: center center;background-size: auto 100%;"></div>'+
									'<div class="description pull-left">'+
										'<div style="padding-top: 0.8125rem;margin-bottom: 0.8125rem;color:#5a5a5a">'+listData.name+'</div>'+
										'<div class="supplement"></div>'+
									'</div>'+
									'<div class="about_cost pull-right">'+
										'<div class="text-right" style="padding-top: 0.8125rem;margin-bottom: 0.8125rem">¥'+listData.real_price+'</div>'+
										'<div class="text-right">x'+listData.total_count+'</div>'+
									'</div>'+
								'</li>';
				$('.product_det ul').eq(i).append(realOrderList);
				for(var k=0;k<descData.length;k++){
					$('.product_det ul').eq(i).find('.supplement').eq(j).append(descData[k]);
				}
																
			}
			
		}
		$(window).scroll(function() {
		    if (window.scrollY  >= $(document).height() - $(window).height()) {		
				//console.log(scrollY)
				//console.log(datas.result.total_count%20);
				if(datas.result.total_count%20==0){
					getdata(datas.result.total_count/20+1);
				}
			
	   		}
		});

	})

}