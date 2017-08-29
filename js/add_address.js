
//点击返回键调回上页
$('.arrow_go_back').on('tap',function(){
	window.location.href = 'edit_address.html';
})

//选择地区
//只有trigger 和 wheels 是必要参数  其他都是选填参数
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
	var provinceCode = areaData[0].id*1;
	var cityCode = areaData[1].id*1;
	var districtCode = areaData[2].id*1;
	//console.log(provinceCode)	
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
		$.post(config.addAddr,{'uid':uid,'contact_user_name':receiver,'contact_phone':phoneNum,'province':province,'city':city,'district':district,'street':addressDetail,'province_code':provinceCode,'city_code':cityCode,'district_code':districtCode},function(data){
			console.log(data.error_msg)
			if(data.error_code==0){
				window.location.href = 'edit_address.html';
			}
		})
	}

})