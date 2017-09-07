//订单列表
var pageNm = 1;
dividePage(pageNm);

//分页
function dividePage(page){
	 $.ajax(
   {
      type:"POST",
      url:config.userOrderList,
      data:{'uid':uid,'page':page}, 
      beforeSend:function(){
      	$('.spinner').show();
      },
      success:function(datas){
		console.log(datas);
		var obj = datas.result.list;
		var realOrderList = '',
			state_class = '',
			order_state,
			state_txt = '';
		for(var i=0;i<obj.length;i++){
			var orderData = obj[i].user_order.data;
			var stateForOrder = orderData.state;
			switch(stateForOrder){
				case 1:
					state_class = 'wait_for_pay';
					order_state = '待付款';
					state_txt = '立即支付';
					break;
				case 3:
					state_class = 'have_sent_goods';
					order_state = '已发货';
					state_txt = '确认收货';
					break;
				case 4:
					state_class = 'wait_for_evaluate';
					order_state = '待评价';
					state_txt = '立即评价';
					break;
				case 5:
					state_class = 'finish_deal';
					order_state = '交易完成';
					state_txt = '申请退款';
					break;
				case 8:
					state_class = 'have_refunded';
					order_state = '已退款';
					state_txt = '查看退款记录';
					break;
				case 9:
					state_class = 'wait_for_check';
					order_state = '待审批';
					state_txt = '查看退款进度';
					break;
				case 10:
					state_class = 'refuse_refunde';
					order_state = '退款驳回';
					state_txt = '申请退款';
					break;
			}
			var orderBox = '<li class="order_list_box" data_id="'+obj[i].user_order.id+'">'+
								'<ul class="list-unstyled my_order_det">'+
									'<li>'+
										'<div class="clearfix" style="padding-bottom: 1.25rem;padding-top: 0.9375rem;">'+
											'<span class="order_num pull-left">订单编号 '+obj[i].user_order.id+'</span>'+
											'<span class="order_state pull-right">'+order_state+'</span>'+
										'</div>'+
										'<div class="product_det">'+
											'<ul class="list-unstyled">'+
											'</ul>'+
										'</div>'+
										'<div class="sum">'+
											'<div>'+
												'<span>共'+orderData.item_total_count+'件</span><span class="counts">合计 <span class="sum_money">¥'+orderData.total_price+'</span></span>'+
											'</div>'+
											'<div style="height:auto;">'+
												'<span class="state_btns delete_order">删除订单</span><span class="state_btns '+state_class+'">'+state_txt+'</span><span class="state_btns check_state">查看动态</span>'+
												'<div style="clear:both"></div>'+
											'</div>'+
										'</div>'+
									'</li>'+
								'</ul>'+
							'</li>';
			$('.order_box').append(orderBox);
			if(state_txt==''){
				$('.'+state_class+'').hide();
			}else{
				$('.'+state_class+'').show();
			}
			switch(stateForOrder){
				case 3:
					$('.check_state').eq(i+(20*(page-1))).show();
					break;
				case 5:
					$('.delete_order').eq(i+(20*(page-1))).show();
					break;
				case 8:
					$('.delete_order').eq(i+(20*(page-1))).show();
					break;
			}
		}
		//确认收货
		$('.sure_get_goods').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id')*1;
			//console.log(user_order_id)
			window.localStorage.setItem('user_order_id',user_order_id);
			$.post(config.confirm,{'user_order_id':user_order_id},function(datas){
				location.reload();
			})
		})
		//退款
		$('.finish_deal, .refuse_refunde').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			window.localStorage.setItem('user_order_id',user_order_id);
			window.location.href="apply_for_refund.html";
		})
		//待评价
		$('.wait_for_evaluate').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			window.localStorage.setItem('user_order_id',user_order_id);
			window.location.href = "comment.html";
		})
		//查看退款进度
		$('.wait_for_check').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			window.localStorage.setItem('user_order_id',user_order_id);
			window.location.href = "wait_for_refund.html";
		})
		//删除订单
		$('.delete_order').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			$('.delete_mask').show();
			$('.yes').on('click',function(){
				$.post(config.orderListRemove,{'user_order_id':user_order_id},function(datas){
					if(datas.error_code==0){
						location.reload();
					}else{
						showTips(datas.error_msg);
					}
					$('.delete_mask').hide();
				})
			})
			$('.no').on('click',function(){
				$('.delete_mask').hide();
			})
		})
		//查看退款记录
		$('.have_refunded').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			window.localStorage.setItem('user_order_id',user_order_id);
			window.location.href = 'close_transaction.html';
		})
		//查看动态
		$('.check_state').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id');
			window.localStorage.setItem('user_order_id',user_order_id);
			window.location.href="delivery.html";
		})
		//再次支付
		$('.wait_for_pay').on('click',function(){
			var user_order_id = $(this).parents('.order_list_box').attr('data_id')*1;
			$.post(config.myOrderRepay,{'user_order_id':user_order_id,'open_id':'oHtkhv9A7dKjnmrRk_1RA_l2pZjA'},function(pay){
				console.log(pay);
				wx.config({
					// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: pay.result.appId, // 必填，公众号的唯一标识
					timestamp: pay.result.timeStamp, // 必填，生成签名的时间戳
					nonceStr: pay.result.nonceStr, // 必填，生成签名的随机串
					signature: pay.result.sign,// 必填，签名，见附录1
					jsApiList: [
						'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'onMenuShareQZone',
						'hideMenuItems',
						'showMenuItems',
						'hideAllNonBaseMenuItem',
						'showAllNonBaseMenuItem',
						'translateVoice',
						'startRecord',
						'stopRecord',
						'onVoiceRecordEnd',
						'playVoice',
						'onVoicePlayEnd',
						'pauseVoice',
						'stopVoice',
						'uploadVoice',
						'downloadVoice',
						'chooseImage',
						'previewImage',
						'uploadImage',
						'downloadImage',
						'getNetworkType',
						'openLocation',
						'getLocation',
						'hideOptionMenu',
						'showOptionMenu',
						'closeWindow',
						'scanQRCode',
						'chooseWXPay',
						'openProductSpecificView',
						'addCard',
						'chooseCard',
						'openCard'
					]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				// wx.error(function(res){

				//     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// });


				function onBridgeReady(pay){
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', {
							"appId":pay.result.appId,     //公众号名称，由商户传入
							"timeStamp":pay.result.timeStamp,         //时间戳，自1970年以来的秒数
							"nonceStr":pay.result.nonceStr, //随机串
							"package":pay.result.package_value,
							"signType":pay.result.signType,         //微信签名方式：
							"paySign":pay.result.paySign //微信签名
						},
						function(res){
							if(res.err_msg == "get_brand_wcpay_request:ok" ) {
								window.location.href="pay_success.html";
							}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
								alert('支付取消');
								location.reload();	
							}else if(res.err_msg == "get_brand_wcpay_request:fail"){
								alert('支付失败');
								location.reload();	
							}

							// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
						}
					);
				}
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				}else{
					onBridgeReady(pay);
				}
			
			})
		})		
		for(var i=0;i<obj.length;i++){
			var listObj = datas.result.list[i].order;
			for(var j=0;j<listObj.length;j++){
				var listData = listObj[j].data;
				var descData = listObj[j].data.sub_name;

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
				$('.product_det ul').eq(i+(20*(page-1))).append(realOrderList);
				$('.product_det ul').eq(i+(20*(page-1))).find('.supplement').eq(j).append(descData);												
			}
			
		}
		$(window).scroll(function() {
		    if (window.scrollY  >= $(document).height() - $(window).height()) {		
				//console.log(scrollY)
				//console.log(datas.result.total_count/20);
				var totalPage = Math.ceil(datas.result.total_count/20);
				if(pageNm<totalPage){
					console.log(pageNm)
					pageNm++;
					dividePage(pageNm);
				}									
			}
		});
	},
      complete:function(){$('.spinner').hide()},
   });
}