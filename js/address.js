var arrData = {
	'addressId':window.localStorage.getItem('addressId'),
	'editNum':window.localStorage.getItem('editNum'),
}
$.post(config.addressList,{'uid':uid,'address_id':arrData.addressId},function(data){
	//console.log(data);
	var html = '',
	dataObj = data.result[0].data;
	html = '<div class="group">'+
					'<label>收件人 </label>'+
					'<input type="text" class="receiver" name="receiver" value='+dataObj.contact_user_name+'>'+
				'</div>'+
				'<div class="group">'+
					'<label>手机号</label>'+
					'<input type="text" class="phone_num" name="phone_num" value='+dataObj.contact_phone+'>'+
				'</div>'+				
				'<div class="group">'+
					'<label>地址</label>'+				
					'<span id="chooseAddress" style="display: inline-block;height: 20px;">'+dataObj.province+' '+dataObj.city+' '+dataObj.district+'</span>'+
				'</div>'+
				'<div class="group">'+
					'<div>'+
						'<label>详细地址</label>'+
						'<input type="text" class="address_detail" name="address_detail" value='+dataObj.street+'>'+
					'</div>'+					
				'</div>';
	$('#addressForm').html(html);
	//点击返回键调回上页
	$('.arrow_go_back').on('tap',function(){
		window.location.href = 'edit_address.html';
	})
	//选择地区
	var mobileSelect4 = new MobileSelect({
	    trigger: '#chooseAddress',
	    title: '地区选择',
	    wheels: [
	                {data:areadata}
	            ],
	    callback:function(indexArr, data){
	    	var datas = JSON.stringify(data);
	        window.localStorage.setItem('areaData',datas);
	    } 
	});
	//点击保存
	$('.save_box').on('tap',function(){
		var receiver = $('.receiver').val();
		var phoneNum = $('.phone_num').val();
		var chooseAddress = $('#chooseAddress').html();
		var addressDetail = $('.address_detail').val();
		var areaArr = Trim(chooseAddress,'g').split(',');
		var province = areaArr[0];
		var city = areaArr[1];
		var district = areaArr[2];
		var areaData = JSON.parse(window.localStorage.getItem('areaData'));
		var provinceCode,cityCode,districtCode;
		if(areaData==null){
			provinceCode = window.localStorage.getItem('defaultProvience')*1;
			cityCode = window.localStorage.getItem('defaultCity')*1;
			districtCode = window.localStorage.getItem('defaultDistrict')*1;
			//console.log(districtCode);
		}else{
			provinceCode = areaData[0].id*1;
			cityCode = areaData[1].id*1;
			districtCode = areaData[2].id*1;
			//console.log(provinceCode)
		}	
		//验证表单
		if(receiver ==''||receiver==undefined){
			alert('请填写姓名');
		}else if(!validator.IsMobilePhoneNumber(phoneNum)){
			alert('请填写正确手机号');
		}else if(chooseAddress == ''||chooseAddress == undefined){
			alert('请选择完整地址');
		}else if(addressDetail == ''||addressDetail == undefined){
			alert('请填写详细地址');
		}else{
			$.post(config.addressUpdate,{'id':arrData.addressId,'contact_user_name':receiver,'contact_phone':phoneNum,'province':province,'city':city,'district':district,'street':addressDetail,'province_code':provinceCode,'city_code':cityCode,'district_code':districtCode},function(data){
				if(data.error_code==0){
					if(arrData.editNum=='0'){
						window.location.href = 'login.html';						
					}else if(arrData.editNum=='1'){
						window.location.href = 'firm_order.html';
					}else if(arrData.editNum=='2'){
						window.location.href = 'personal.html';
					}				
				}
			})
		}
	})
})





