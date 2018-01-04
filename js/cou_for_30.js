localStorage.setItem("redirect_url",window.location.href);
if(!openid){
	window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
}
function jumpCouForCode(coupon_id,url){
	$('#cou').on('tap',function(){
		if(uid){
			$.post(config.oneCouponTake,{uid:uid,coupon_id:coupon_id},function(datas){
				if(datas.error_code==0){
					showTips('领取成功,3秒后跳转到商品页面~');
					setTimeout(function(){
						window.location.href = url;
					},3000)
				}else{
					showTips(datas.error_msg);
				}
			})
		}else{
			window.localStorage.setItem('setIndexNum',1);
			window.location.href="register.html"
		}
	})
}
