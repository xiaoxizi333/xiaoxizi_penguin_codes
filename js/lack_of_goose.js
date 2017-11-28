$.post(config.globalRate,{'uid':uid},function(datas){
	console.log(datas);
	var userData = datas.result.user[0];
	var digital = datas.result.rate[0];
	$('.goose_warning .user_name').html(userData.user_data.user_name);
	$('.goose_point').html(digital.data.goose);
	$('.point_rate').html(digital.data.point);
	var userPoint,
		userGoose;
	if(userData.user_data.goose){
		userGoose = userData.user_data.goose;
	}else{
		userGoose = 0;
	}
	if(userData.user_data.point){
		userPoint = userData.user_data.point+' '+'积分';
	}else{
		userPoint = '0 积分';
	}
	$('.show_data .data_points').html(userPoint);
	$('.egg_num').html(userGoose);
	$('.get_instance_btn').on('tap',function(){
		window.location.href = "get_goose.html";
	})
})

