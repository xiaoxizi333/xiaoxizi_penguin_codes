var user_order_id = window.localStorage.getItem('user_order_id');
//显示评论商品图片
$.post(config.myOrderComment,{'user_order_id':user_order_id},function(datas){
	//console.log(datas);
	var obj = datas.result.list[0].order;
	var commentPic = '';
	for(var i=0;i<obj.length;i++){
		var picObj = obj[i].data;
		var specId = picObj.item_spec_id?picObj.item_spec_id:0;
		commentPic += '<div class="user_comment" dataId="'+picObj.item_id+'" specId="'+specId+'" total_count="'+picObj.total_count+'">'+
						'<div class="feel clearfix">'+
							'<div class="pull-left">'+
								'<img src="'+picObj.title_pics[0]+'" class="photo_replace">'+
							'</div>'+
							'<div class="pull-left">'+
								'<textarea placeholder="请写下对酒的感受吧~"></textarea>'+
							'</div>'+
						'</div>'+
						'<div class="photos">'+
							'<div class="fileList" data_index="'+i+'"></div>'+
							'<div class="filebox">'+
								'<input type="file" data_index="'+i+'" class="fileElem" accept="image/*" style="opacity: 0">'+
								'<div class="mask_add_input">最多五张</div>'+
							'</div>	'+
						'</div>'+
						'<div class="evaluate">'+
							'<span class="active">好评</span><span>中评</span><span>差评</span>'+
						'</div>'+
					'</div>';
	}
	$('#commentForm').html(commentPic);
	//上传图片
	$('.fileElem').on('change',function(){
		var index = $(this).attr('data_index');
		var formData = new FormData();
		//console.log(document.getElementsByClassName("fileElem")[index].files);
		formData.append("pic", document.getElementsByClassName("fileElem")[index].files[0]);
		$.ajax({
		    url: config.picUpload,
		    type: "POST",
	  	 	data:{'pic':'multipart'},
		    processData: false,
		    contentType: false,
		    enctype: 'multipart',
		    data: formData,
		    cache:false,
		    success:function(data){
		    	//console.log(data)
		    	try{
		    		$('.fileList').eq(index).append('<div class="pic_box" style="width:5rem;height:5rem;"><div class="cross_pic"></div><img src="'+data.result.thumbnail_pic+'" origin_src="'+data.result.original_pic+'" style="width:100%;height:100%;"></div>');
		    	}catch(err){};
		    	if($('.fileList').eq(index).find('.pic_box').length>=5){
					$('.filebox').eq(index).hide();
				}
				//点击x取消图片
				$('.cross_pic').off('tap').on('tap',function(){
					$(this).parent('.pic_box').remove();
					var showAdd = $(this).closest().attr('data_index');
					console.log(showAdd);
					console.log($(this).parent().parent());
					$('.filebox').eq(showAdd).show();
			    })
		    }
		})
	})
	//评价
	$('.evaluate span').on('tap',function(){
		$(this).addClass('active').siblings().removeClass('active');
	})

	//提交评价
	$('.publish_btn').on('tap',function(){
		var keyVal=0,
			commentArr = [],
			picArr = [];
		for(var i=0;i<$('.user_comment').length;i++){
			if($('textarea').eq(i).val()==''){
				keyVal++;
			}				
			picArr.push([]);
			for(var k=0;k<$('.fileList').eq(i).find('.pic_box img').length;k++){
			 	picArr[i].push($('.fileList').eq(i).find('.pic_box img').eq(k).attr('origin_src'));			 	
			}
			commentArr.push({
				'user_order_id':user_order_id*1,
				'item_id':$('.user_comment').eq(i).attr('dataId')*1,
				'item_spec_id':$('.user_comment').eq(i).attr('specId')*1,
				'comment_pics':picArr[i],
				'comment_level':$('.user_comment').eq(i).find('.evaluate span.active').index(),
				'uid':uid,
				'item_count':$('.user_comment').eq(i).attr('total_count')*1,
				'comment_content':$('textarea').eq(i).val(),
			});
			
			if($('.fileList').eq(i).find('.pic_box').length==0){
				commentArr[i].is_pic = 0;
			}else{
				commentArr[i].is_pic = 1;
			}					
		}
		if(keyVal!==0){
			alert("请填写评论内容哦～"); 
		}else{
			var commentData = {'comment_array':commentArr};		
			$.ajax({
		        type: "POST",
		        dataType:'json', 
		        contentType:'application/json',
		        url: config.userCommitComment,
		        data: JSON.stringify(commentData), 
		        success: function(datas){
		            console.log(datas);			            
		        }
		    });	
		}			
	})
})