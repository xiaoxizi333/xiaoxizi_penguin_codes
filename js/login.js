$.post(config.userShow,{'uid':uid},function(datas){
	//console.log(datas);
	var obj = datas.result[0].user_data;
	$('#preview').html('<img src="" style="width: 100%;height: 100%">');
	$('#preview img').attr('src',obj.user_profile_pic);
	$('.nickname').val(obj.user_name);
	$('.username').val(obj.real_name);

	if(obj.gender+1){
		$('.sex > .choose_sex img').attr('src','img/choose_normal.png');
		$('.sex > .choose_sex img').eq(obj.gender).attr('src','img/choose_selected.png');
		window.localStorage.setItem('sex',obj.gender);
	}else{
		$('.sex > .choose_sex img').attr('src','img/choose_normal.png');
		$('.sex > .choose_sex img').eq(1).attr('src','img/choose_selected.png');
		window.localStorage.setItem('sex',1);
	}
	//console.log(obj.gender)
	if(obj.birthday){
		var birthday = new Date(obj.birthday);
		var year = birthday.getFullYear();
		var month = birthday.getMonth()+1;
		var day = birthday.getDate();
		month =(month<10 ? "0"+month:month);
		day =(day<10 ? "0"+day:day);
		$('#start_date').val(year+'-'+month+'-'+day);
	}

	if(obj.phone){
		$('.phone_num').val(obj.phone);
		$('.phone_num').attr('disabled',true);
	}else{
		$('.phone_num').attr('disabled',false);
	}

	$('.identity').val(obj.id_no);
	$('.personal_address').on('tap',function(){
		window.localStorage.setItem('editNum','0');
		window.location.href="edit_address.html";

	})
})

$('.save').on('tap',function(){
	var birthdayStr = Date.parse($('#start_date').val());
	var genderId = window.localStorage.getItem('sex')*1;
	$.post(config.userUpdate,{'uid':uid,'real_name':$('.username').val(),'birthday':birthdayStr,'user_name':$('.nickname').val(),'id_no':$('.identity').val(),'user_profile_pic':$('#preview img').attr('src'),'gender':genderId,'phone':$('.phone_num').val(),},function(datas){
		window.location.href="personal.html";
	})
})

//选择生日时间
var calendar = new LCalendar();
calendar.init({
	'trigger': '#start_date', //标签id
	'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
	'minDate': (new Date()) + '-' + 1 + '-' + 1, //最小日期
	'maxDate': (new Date().getFullYear()+3) + '-' + 12 + '-' + 31 //最大日期
});

// 根据生日的月份和日期，计算星座。
function getAstro(m,d){
  return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);
}

// 获取某个时间格式的时间戳
$('#start_date').bind('input propertychange', function() {  
	var stringTime = $('#start_date').val();
	var counter = new Date(stringTime);
	var month = counter.getMonth()+1;
	var day = counter.getDate();
	if($('#start_date').val()!=""){
		$('.constellation').html(getAstro(month,day)+'座');
	}	
})

//选择男女radio
$('.sex > .choose_sex').on('tap',function(){
	var index = $(this).index()-1;
	$('.sex > .choose_sex img').attr('src','img/choose_normal.png');
	$('.sex > .choose_sex img').eq(index).attr('src','img/choose_selected.png');
	window.localStorage.setItem('sex',index);
})

//上传图片
$('#photo').on('change',function(){
	var formData = new FormData();
	//console.log(document.getElementById("photo").files[0])
	formData.append("pic", document.getElementById("photo").files[0]);

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
	    	$('#preview img').attr('src',data.result.thumbnail_pic);
	    }
	})
})

