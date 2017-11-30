//goods3
//console.log(goods3);
var goodsHtml = '';
for(var i=0;i<goods3.length;i++){
	var obj = goods3[i];
	goodsHtml += '<li class="col-xs-4 col-md-4 col-lg-4">'+
					'<a href="'+obj.jump_url+'">'+
						'<div class="intro_img_for_ws"><img src="'+obj.pic+'" alt=""></div>'+
						'<div class="pro_des pro_des_for_ws">'+obj.name+'</div>'+
						'<div class="spec_price spec_price_for_ws clearfix">'+
							'<div class="pull-left">'+
								'<i class="vip_icon"></i>'+
								'<span class="vip_price vip_price_for_ws">¥'+obj.vip_price+'</span>'+
							'</div>'+
							'<div class="pull-right">'+
								'<span class="cut_price cut_price_for_ws">省'+(obj.public_price-obj.vip_price)+'元</span>'+
							'</div>'+
						'</div>'+
					'</a>'+
				'</li>';
}
$('.recommond_list_for_ws').html(goodsHtml);

//goods20
//console.log(goods20);
var goodsHtml20 = '';
for(var i=0;i<goods20.length;i++){
	var obj = goods20[i];
	goodsHtml20 += '<li class="col-xs-6 col-md-6 col-lg-6">'+
					'<a href="'+obj.jump_url+'">'+
						'<div class="intro_img_for_five"><img src="'+obj.pic+'" alt=""></div>'+
						'<div class="pro_des pro_des_for_five">'+obj.name+'</div>'+
						'<div class="spec_price spec_price_for_five clearfix">'+
							'<div class="pull-left">'+
								'<i class="vip_icon"></i>'+
								'<span class="vip_price vip_price_for_five">¥'+obj.vip_price+'</span>'+
							'</div>'+
							'<div class="pull-right">'+
								'<span class="cut_price cut_price_for_five">省'+(obj.public_price-obj.vip_price)+'元</span>'+
							'</div>'+
						'</div>'+
					'</a>'+
				'</li>'
}
$('.recommond_list_for_five').html(goodsHtml20);
$('.recommond_list_for_five > li:lt(4)').show();
//点击sort_tab
$('.sort_ul > li').on('tap',function(){
	$('.sort_ul > li').removeClass('active');
	$(this).addClass('active');
	var index = $(this).index();
	for(var i=0;i<goods20.length;i++){
		if(i<(index+1)*4 && i>=index*4){
			$('.recommond_list_for_five > li').eq(i).show();
		}else{
			$('.recommond_list_for_five > li').eq(i).hide();
		}
	}
})
//分享
if(getQueryString('drinkingUid')){
	window.localStorage.setItem('drinkingUid',getQueryString('drinkingUid'));
}else{
	window.localStorage.setItem('drinkingUid',0);
}
if(!openid){
	localStorage.setItem("redirect_url",window.location.href);
	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
}
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
var shareTitle = '今晚我组局，买醉喝酒，要来吗？';
var drinkingUid = uid?uid:0;
var shareLink = 'http://shop.qietuan.org/index_2.html?drinkingUid='+drinkingUid;
var shareDesc = '还有3人就开局';
var shareImg = "http://ofdx4t772.bkt.clouddn.com/1539093008816441?imageView2/1/w/300/h/300";
wx.ready(
	function(){
		wx.onMenuShareTimeline({
		    title: shareTitle, // 分享标题
		    link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: shareImg, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
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
//点击开通买醉卡
$('.set_jump_page').on('tap',function(){
	if(uid){
		$.post(config.itemBilling,{'uid':uid,'item_id':1543320665920817},function(datas){
			console.log(datas);
			if(datas.error_code==0){
				window.localStorage.setItem('user_order_id',datas.result.user_order[0].id);
				window.location.href = "card_for_year.html";
			}else{
				showTips('您已购买会员卡或个人中心中有未支付的会员卡订单');
			}
		})
	}else{
		window.localStorage.setItem('setIndexNum',2);
		window.location.href = "register.html";
	}
})

