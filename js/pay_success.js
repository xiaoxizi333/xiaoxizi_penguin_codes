$.post(config.getLastestOrder,{'uid':uid},function(datas){
	//console.log(datas);
	//console.log(datas.result[0].data.item_id)
	//share
	if(datas.error_code==0){
		$('.share').on('tap',function(){
			$('.share_mask').fadeIn();
			$('.share_arrow').css({'transform':'rotateX(0deg)','transition':'1s'})
		})
		$('.share_mask').on('tap',function(){
			$('.share_mask').fadeOut();
			$('.share_arrow').css({'transform':'rotateX(180deg)'})
		})	
		$.post(config.wxShare,{'url':location.href.split('#')[0]},function(data){
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wx795992462b631e70', // 必填，公众号的唯一标识
			    timestamp: data.result.timestamp, // 必填，生成签名的时间戳
			    nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
			    signature: data.result.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});
		var shareTitle = '今晚我组局，买醉喝酒，要';
		var shareLink = 'http://shop.qietuan.org/product_details.html?specId='+datas.result[0].data.item_spec_id+'&from=singlemessage&itemID='+datas.result[0].data.item_id+'';
		var shareDesc = '今晚就靠它买醉了';
		var shareImg = 'http://ofdx4t772.bkt.clouddn.com/1539093008816441?imageView2/1/w/300/h/300';
		wx.ready(
			function(){
				wx.onMenuShareTimeline({
				    title: shareTitle, // 分享标题
				    link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				    imgUrl: shareImg, // 分享图标
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        $.post(config.shareUserOrderAddPoint,{'uid':uid},function(datas){

				       	})
				       	showTips('分享成功！');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        showTips('分享取消！');
				    }
				});
				wx.onMenuShareAppMessage({
				    title: shareTitle, // 分享标题
				    desc: shareDesc, // 分享描述
				    link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				    imgUrl: shareImg, // 分享图标
				    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        $.post(config.shareUserOrderAddPoint,{'uid':uid},function(datas){
				       		
				       	})
				        showTips('分享成功！');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        showTips('分享取消！');
				    }
				});
				wx.onMenuShareQQ({
				    title: shareTitle, // 分享标题
				    desc: shareDesc, // 分享描述
				    link: shareLink, // 分享链接
				    imgUrl: shareImg, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				       $.post(config.shareUserOrderAddPoint,{'uid':uid},function(datas){

				       	})
				       showTips('分享成功！');
				    },
				    cancel: function () { 
				       // 用户取消分享后执行的回调函数
				       showTips('分享取消！');
				    }
				});
				wx.onMenuShareWeibo({
				    title: shareTitle, // 分享标题
				    desc: shareDesc, // 分享描述
				    link: shareLink, // 分享链接
				    imgUrl: shareImg, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				       $.post(config.shareUserOrderAddPoint,{'uid':uid},function(datas){

				       	})
				       showTips('分享成功！');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        showTips('分享取消！');
				    }
				});
				wx.onMenuShareQZone({
				    title: shareTitle, // 分享标题
				    desc: shareDesc, // 分享描述
				    link: shareLink, // 分享链接
				    imgUrl: shareImg, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				       $.post(config.shareUserOrderAddPoint,{'uid':uid},function(datas){

				       	})
				       showTips('分享成功！');
				    },
				    cancel: function () { 
				    	showTips('分享取消！');
				        // 用户取消分享后执行的回调函数
				    }
				});
			}
		);
		wx.error(function(){

		});
	}

})