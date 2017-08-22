var searchItemNm = window.localStorage.getItem('search_item_name');
$('#search').val(searchItemNm);


searchItem();
// 搜索
$('#search').on('keydown',function(e){
	if(e.keyCode ==13){
		searchItem();
	}
})




function searchItem(){
	$('.SKU_details').empty();
	var searchTxt = $('#search').val();
	console.log(searchTxt);
	$.post(config.search,{'item_name':searchTxt},function(datas){
		console.log(datas);
		var detailsObj = datas.result;
		var detailsHtml = '';
		for(var i=0;i<detailsObj.length;i++){
			detailsHtml += '<div><img src="'+detailsObj[i].data.title_pics+'" class="details"></div>';
		}
		$('.SKU_details').html(detailsHtml);
	})
}