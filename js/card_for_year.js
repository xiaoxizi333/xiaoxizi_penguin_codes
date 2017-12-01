$.post(config.selectExpress,{'uid':uid,'user_order_id':window.localStorage.getItem('user_order_id')*1,'express':'汇通','post_type':0},function(datas){
	console.log(datas);
	if(datas.error_code==0){
		$('.spec_fee').html('¥'+datas.result.user_order[0].data.total_price);
	}else{
		showTips(datas.error_msg)
	}
})
//立即购买
$('.buy_btn').on('tap',function(){
	$.post(config.addressList,{'uid':uid},function(datas){
		console.log(datas);
		var addressObj = datas.result;
		if(addressObj.length){
			var addressNum = 0;
			for(var i=0;i<addressObj.length;i++){
				var objState = addressObj[i].data.state*1;
				addressNum += objState;
			}
			if(addressNum==1){
				$.post(config.goToPayItem,{'uid':uid,'pay_source':'h5','open_id':openid,'comment':'','is_presell':0},function(pay){
					//console.log(pay);
					if(pay.error_code==0){
						$('.mask_for_pay').show();
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
										window.location.href="buy_card_success.html";
									}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
										showTips('支付取消');
										window.location.href="my_order.html";
									}else if(res.err_msg == "get_brand_wcpay_request:fail"){
										showTips('支付失败');
										window.location.href="my_order.html";	
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
					}else{
						showTips(pay.error_msg);
					}
				})
			}else{
				localStorage.setItem("redirect_url",window.location.href);
				window.location.href = "member_resign.html";
			}
		}else{
			localStorage.setItem("redirect_url",window.location.href);
			window.location.href = "member_resign.html";
		}
		
	})
	
})