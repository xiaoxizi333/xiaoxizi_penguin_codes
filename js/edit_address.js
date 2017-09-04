//添加地址数据
$.post(config.addressList,{'uid':uid},function(data){
	//console.log(data);
	console.log(data.result);
	var addressObj = data.result;
	var defaultHtml = '';
	var moreHtml = '';
	for(var i=0;i<addressObj.length;i++){
		window.localStorage.setItem('defaultProvience',data.result[i].data.province_code);
		window.localStorage.setItem('defaultCity',data.result[i].data.city_code);
		window.localStorage.setItem('defaultDistrict',data.result[i].data.district_code);
		//console.log(data.result[i]);
		//如果state==1，则是默认地址
		if(addressObj[i].data.state==1){
			defaultHtml = '<div class="address_box">'+
								'<div class="user_info clearfix">'+
									'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+' <span class="default_address">[默认地址]</span></div>'+
									'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
									'<i class="edit" data_num='+i+'></i>'+
								'</div>'+
								'<div class="address_details">'+data.result[i].data.address_detail+'</div>'+
							'</div>';
		//否则为备选地址
		}else{
			moreHtml += '<div class="address_pox" style="position:relative" data_id="'+addressObj[i].id+'">'+
							'<div class="left">'+
								'<div class="address_box">'+
									'<div class="user_info clearfix">'+
										'<div class="user_name pull-left">'+data.result[i].data.contact_user_name+'</div>'+
										'<div class="user_phone pull-right">'+data.result[i].data.contact_phone+'</div>'+
										'<i class="edit" data_num='+i+'></i>'+
									'</div>'+
									'<div class="address_details">'+data.result[i].data.address_detail+'</div>'+
								'</div>'+								
							'</div>'+
							'<div class="behind"><a href="#" class="delete-btn text-center">删除</a></div>'+
						'</div>';
		}
	}
	$('.default_address').html(defaultHtml);
	$('.more_address').html(moreHtml);
	//点击铅笔跳转页面
	$('.edit').off('tap').on('tap',function(){
		var index = $(this).attr('data_num');
		//存储地址信息
		//console.log(addressObj[index]);
		window.localStorage.setItem('addressId',addressObj[index].id);		
		window.location.href = 'address.html';
	})
	//点击地址后变为默认地址
	$('.more_address .address_box').on('tap',function(){
		var toBeDefault = $(this).index()+1;
		var addressId = addressObj[toBeDefault].id;
		$.post(config.addressChange,{'uid':uid,address_id:addressId},function(data){
			$('.default_address').empty();
			$('.more_address').empty();
			$.post(config.addressList,{'uid':uid},function(data){
				//刷新页面
				location.reload(); 
			})
		})
	})
	//右滑删除
	function prevent_default(e) {
        e.preventDefault();
    }
    function disable_scroll() {
        $(document).on('touchmove', prevent_default);
    }
    function enable_scroll() {
        $(document).unbind('touchmove', prevent_default)
    }
    var x;
    $('.left')
        .on('touchstart', function(e) {
            $('.left').css('left', '0px') 
            x = e.originalEvent.targetTouches[0].pageX;
        })
        .on('touchmove', function(e) {
            var change = e.originalEvent.targetTouches[0].pageX - x
            change = Math.min(Math.max(-100, change), 0) 
            e.currentTarget.style.left = change + 'px'
            if (change < -10) disable_scroll() 
        })
        .on('touchend', function(e) {
            var left = parseFloat(e.currentTarget.style.left);
            var new_left;
            if (left < -35) {
                new_left = -$('.behind').width();
            } else {
                new_left = '0px'
            }
            $(e.currentTarget).animate({left: new_left}, 200)
            enable_scroll()
        });
    $('.delete-btn').on('tap',function(){
    	var dataId = $(this).parent().parent().attr('data_id');
    	//console.log(dataId)
    	$('.delete_mask').show();
    	$('.yes').on('click',function(){
    		$.post(config.addressRemove,{'id':dataId},function(data){
	    		console.log(data);
	    		if(data.error_code==0){
	    			location.reload();
	    		}else{
	    			showTips(data.error_msg);
	    		}
	    	})
	    	$('.delete_mask').hide();
    	})
    	$('.no').on('click',function(){
    		$('.delete_mask').hide();
    	})
    	
    })
})
$('footer').on('tap',function(){
	window.location.href="add_address.html";
})

