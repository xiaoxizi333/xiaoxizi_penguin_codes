$.post(config.globalRate,{'uid':uid},function(datas){
	console.log(datas);
	var userPoint;
	if(datas.result.user[0].user_data.point){
		userPoint = datas.result.user[0].user_data.point;
	}else{
		userPoint = 0;
	}
	$('.spec_points').html(userPoint);
	var rateOfPoints = datas.result.rate[0].data;
	$('.get_goose_inp').attr('placeholder','（'+rateOfPoints.point+'个积分兑换'+rateOfPoints.goose+'个鹅蛋）')
})
$('.get_btn').on('click',function(){
	var eggVal=$('.get_goose_inp').val();
  	var reg = /^[1-9]\d*$/;
	if(reg.test(eggVal)){
		$.post(config.exchange,{'uid':uid,'goose':$('.get_goose_inp').val()},function(datas){
			//console.log(datas);
			if(datas.error_code==0){
				showTips('兑换成功～');
				setTimeout(function(){
					window.location.reload();
				},1000);	
			}else{
				showTips(datas.error_msg);
			}
		})
	}else{
		showTips('兑换鹅蛋需要输入整数哦～')
	}
})
