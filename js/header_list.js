//header list
$.post(config.classify,{'is_add_best_ares':1},function(data){
	//console.log(data);
	var obj = data.result;
	var choiceBar = '';
	for(var i=0;i<obj.length;i++){
		choiceBar += '<li><a href="#">'+obj[i].data.class_name+'</a></li>';	
	}
	$('.choice_bar').html(choiceBar);
	$('.choice_bar li').eq(0).find('a').addClass('active');
	$('.choice_bar li').on('click',function(){
		$('.choice_bar li').find('a').removeClass('active');
		$(this).find('a').addClass('active');
	})

})