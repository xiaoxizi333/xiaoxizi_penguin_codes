//header list
$.post(config.classify,function(data){
	//console.log(data);
	var obj = data.result;
	var choiceBar = '';
	for(var i=0;i<obj.length;i++){
		choiceBar += '<li data_id="'+obj[i].id+'"><a>'+obj[i].data.class_name+'</a></li>';	
	}
	$('.choice_bar').html(choiceBar);
	var tabListIndex = window.localStorage.getItem('tabListIndex')?window.localStorage.getItem('tabListIndex'):0;
	$('.choice_bar li').eq(tabListIndex).find('a').addClass('active');
	$('.choice_bar li').on('click',function(){
		$('.choice_bar li').find('a').removeClass('active');
		var index = $(this).index();
		window.localStorage.setItem('tabListIndex',index);
		window.location.href = "all-products-classify.html?tabId="+obj[index].id;
		//window.localStorage.setItem('tabId',obj[index].id);
		window.localStorage.setItem('tabOrList','1');		
	})

})