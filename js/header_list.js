//header list
$.post(config.classify,{'is_add_best_ares':1},function(data){
	//console.log(data);
	var obj = data.result;
	var choiceBar = '';
	for(var i=0;i<obj.length;i++){
		choiceBar += '<li data_id="'+obj[i].id+'"><a href="all-products-classify.html">'+obj[i].data.class_name+'</a></li>';	
	}
	$('.choice_bar').html(choiceBar);
	$('.choice_bar li').eq(0).find('a').addClass('active');
	$('.choice_bar li').on('click',function(){
		$('.choice_bar li').find('a').removeClass('active');
		$(this).find('a').addClass('active');
		var index = $(this).index();
		window.localStorage.setItem('tabId',obj[index].id);
		window.localStorage.setItem('tabOrList','1');		
	})

})