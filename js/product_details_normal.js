window.localStorage.setItem('product_type','normalGoods');
var specialPro = getQueryString('itemID');
var isVipPrice = window.localStorage.getItem('isVipPrice')*1;
$.post(config.itemInfoShow,{'item_id':itemID,'item_spec_id':itemSpecId},function(datas){
	//console.log(datas);
	var obj = datas.result.item_info[0].data;
	//选择规格
	$('.det_pic').css('background-image','url('+obj.title_pics[0]+')');
	var priceHtml;
	if(datas.result.item_spec_template.length>0){
		priceHtml = '<div class="vip_price pull-left" style="margin-right: 1.375rem">'+
						'<span>价格</span>'+
						'<span class="specific_cost">¥'+obj.range_price+'</span>'+
					'</div>';
	}else{
		if(specialPro==1541933576032431){
			if(isVipPrice){
				priceHtml = '<div class="vip_price pull-left" style="margin-right: 1.375rem">'+
								'<span>会员价</span>'+
								'<span class="specific_cost price_for_vip">¥ ***</span>'+
							'</div>'+
							'<div class="pull-left">'+
									'<span class="another_price normal_price">非会员价 ¥'+obj.public_price+'</span>'+
							'</div>';
			}else{
				priceHtml = '<div class="vip_price pull-left" style="margin-right: 1.375rem">'+
								'<span>非会员价</span>'+
								'<span class="specific_cost normal_price">¥'+obj.public_price+'</span>'+
							'</div>'+
							'<div class="no_vip pull-left">'+
									'<span class="another_price price_for_vip">会员价 ¥ ***</span>'+
							'</div>';
			}
		}else{
			if(isVipPrice){
				priceHtml = '<div class="vip_price pull-left" style="margin-right: 1.375rem">'+
								'<span>会员价</span>'+
								'<span class="specific_cost price_for_vip">¥'+obj.real_price+'</span>'+
							'</div>'+
							'<div class="pull-left">'+
									'<span class="another_price normal_price">非会员价 ¥'+obj.public_price+'</span>'+
							'</div>';
			}else{
				priceHtml = '<div class="vip_price pull-left" style="margin-right: 1.375rem">'+
								'<span>非会员价</span>'+
								'<span class="specific_cost normal_price">¥'+obj.public_price+'</span>'+
							'</div>'+
							'<div class="no_vip pull-left">'+
									'<span class="another_price price_for_vip">会员价 ¥'+obj.real_price+'</span>'+
							'</div>';
			}
		}
	}
	$('.det_price').html(priceHtml);
	//优惠
	var benUid = uid?uid:0;
	var benData = {'uid':benUid,'item_id':itemID,'item_spec_id':itemSpecId};
	$.ajax({
		type:'post',
		url:config.showItem,
	    dataType:'json',
	    contentType:'application/json',
	   	data: JSON.stringify(benData), 
        success:function(datas){
	      	if(datas.error_code==0){
	      		//console.log(datas);
		      	var obj = datas.result;
		      	if(obj.goose_info){
		      		$('.egg_box').show();
		      		$('.egg_box .bene_content').html(obj.goose_info);
		      	}
		      	if(obj.point_info){
		      		$('.points_box').show();
		      		$('.points_box .bene_content').html(obj.point_info);
		      	}
		      	if(obj.coupon_info.length){
		      		$('.cou_box').show();
		      		var couList = '';
		      		for(var i=0;i<obj.coupon_info.length;i++){
		      			couList += '<li class="active">'+obj.coupon_info[i]+'</li>'
		      		}
		      		$('.cou_box .bene_content').html(couList);
		      	}
	      	}
	    },
	})
	
	$.post(config.wxShare,{'url':location.href.split('#')[0]},function(data){
		wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'wx795992462b631e70', // 必填，公众号的唯一标识
		    timestamp: data.result.timestamp, // 必填，生成签名的时间戳
		    nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
		    signature: data.result.signature,// 必填，签名，见附录1
		    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	});
	var shareTitle = obj.name;
	var shareLink = window.location.href;
	//var shareDesc = shareTitle+' '+$('.vip_price').text();
	var shareDesc = obj.sub_name;
	var shareImg = datas.result.item_info[0].data.title_pics[0];
	wx.ready(
		function(){
			wx.onMenuShareTimeline({
			    title: shareTitle, // 分享标题
			    link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: shareImg, // 分享图标
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			       	showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareAppMessage({
			    title: shareTitle, // 分享标题
			    desc: shareDesc, // 分享描述
			    link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: shareImg, // 分享图标
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareQQ({
			    title: shareTitle, // 分享标题
			    desc: shareDesc, // 分享描述
			    link: shareLink, // 分享链接
			    imgUrl: shareImg, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			       showTips('分享取消！');
			    }
			});
			wx.onMenuShareWeibo({
			    title: shareTitle, // 分享标题
			    desc: shareDesc, // 分享描述
			    link: shareLink, // 分享链接
			    imgUrl: shareImg, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        showTips('分享取消！');
			    }
			});
			wx.onMenuShareQZone({
			    title: shareTitle, // 分享标题
			    desc: shareDesc, // 分享描述
			    link: shareLink, // 分享链接
			    imgUrl: shareImg, // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			       showTips('分享成功！');
			    },
			    cancel: function () { 
			    	showTips('分享取消！');
			        // 用户取消分享后执行的回调函数
			    }
			});
		}
	);
	wx.error(function(){

	});
	var itemTemplate = datas.result.item_spec_template;
	var templateTxt = '',
		txt;
	if(itemTemplate.length==0){
		if(isVipPrice){
			txt = '<div class="clearfix" style="line-height: 1.5rem;">'+
						'<div class="price_style price pull-left">¥<span>'+obj.real_price+'</span></div>'+
					'</div>';

		}else{
			txt = '<div class="clearfix" style="line-height: 1.5rem;">'+
					'<div class="price_style real_price pull-left">¥<span>'+obj.public_price+'</span></div>'+
				'</div>';
		}
		$('.num_box').html(txt);
		$('.storage_num').html(obj.storage);
		$('.type_det_box').hide();
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			$('.sure').off('tap').on('tap',function(){
				if(uid){
					if(index =='0'){		
						var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()*1};
						$.post(config.shoppingCart,cartData,function(data){
							//console.log(data);
							var msg = '添加成功~';
							if(data.error_code!==0){
								msg = data.error_msg;
							}
							showTips(msg);
							$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
							$('.mask').fadeOut(1000);						
						})			
					}else if(index =='1'){
						var cartData = {'uid':uid,'item_id':itemID,'num':$('.add_or_substract .specific_num').html()*1};
						//console.log(cartData)
						$.post(config.itemBilling,cartData,function(data){
							console.log(data)
							if(data.error_code==0){
								var goodsInfo,
									goodsBox = [],
									obj = data.result.order;
								for(var i=0;i<obj.length;i++){
									var obj2 = obj[i].data;
									goodsInfo = {};
									goodsBox.push(goodsInfo);
									goodsBox[i].goods_name = obj2.name;
									var s1 = obj2.spec1?obj2.spec1:'';
									var s2 = obj2.spec2?obj2.spec2:'';
									var s3 = obj2.spec3?obj2.spec3:'';
									goodsBox[i].spec_str = s1+s2+s3;
									if(isVipPrice){
										goodsBox[i].goods_prcie = obj2.real_price;
									}else{
										goodsBox[i].goods_prcie = obj2.public_price;
									}
									goodsBox[i].goods_pic = [obj2.title_pics[0]];
									goodsBox[i].goods_count = obj2.total_count;
									goodsBox[i].goods_id = data.result.order[i].id;
									goodsBox[i].goods_desc = obj[i].data.sub_name;

								}
								//console.log(goodsBox)
								goodsBox = JSON.stringify(goodsBox);
								window.localStorage.setItem('total_price',data.result.user_order[0].data.total_price);
								window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
								window.localStorage.setItem('item_total_price',data.result.user_order[0].data.item_total_price);
								window.localStorage.setItem('delivery_type',data.result.user_order[0].data.post_type);
								window.localStorage.setItem('ship_fee',data.result.user_order[0].data.ship_fee);
								window.localStorage.setItem('preserveId',data.result.user_order[0].data.is_prestore);
								window.localStorage.setItem('goodsBox',goodsBox);
								window.localStorage.setItem('identity',data.result.user_order[0].data.id_no);
								window.localStorage.setItem('jump_btn','1');
								window.localStorage.setItem('counts_num','0');
								var userOrderData = data.result.user_order[0].data;
								window.localStorage.setItem('discountMon',userOrderData.discount_money);
								window.localStorage.setItem('getGooseCount',userOrderData.get_goose_count);
								window.localStorage.setItem('getPointCount',userOrderData.get_point_count);
								window.localStorage.setItem('itemCostGooseTotal',userOrderData.item_cost_goose_total_count);
								window.localStorage.setItem('myPointInfo',userOrderData.my_point_info);
								window.localStorage.setItem('isPointDiscount',userOrderData.is_point_discount);
								window.localStorage.setItem('isGroup',0);
								window.location.href="firm_order.html";
							}else{
								$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
								$('.mask').fadeOut(1000);
								showTips(data.error_msg);
							}
						})
						
					}
				}else{
					window.localStorage.setItem('setIndexNum',1);
					window.location.href="register.html"
				}
			})
		})	

	}else{
		$('.type_det_box').show();
		for(var i=0;i<itemTemplate.length;i++){
			templateTxt += '<div class="type_det">'+
								'<div class="title_type">'+itemTemplate[i].data.spec_name+'</div>'+
								'<ul class="specific_type_info list-unstyled list-inline"></ul>'+
							'</div>';
		}
		$('.type_det_box').append(templateTxt);
		for(var i=0;i<itemTemplate.length;i++){
			var specTxt = '';
			//console.log(itemTemplate[i]);
			for(var j=0;j<itemTemplate[i].data.spec_array.length;j++){
				specTxt += '<li class="btn">'+itemTemplate[i].data.spec_array[j]+'</li>';
			}
			$('.specific_type_info').eq(i).append(specTxt);
		}
		var spec1Txt = $('.type_det').eq(0).find('li').eq(0).html();
		$('.type_det').eq(0).find('li').eq(0).addClass('active');
		var templateList = datas.result.item_spec_list;
		var spec2Arr = [],
			spec3Arr = [];
		$('.type_det').eq(1).find('li').addClass('disabled');
		$('.type_det').eq(2).find('li').addClass('disabled');
		for(var k=0;k<templateList.length;k++){
			var listObj = templateList[k].data;
			if(spec1Txt==listObj.spec1){
				if(listObj.spec2){
					spec2Arr.push(listObj.spec2);
					for(var a=0;a<$('.type_det').eq(1).find('li').length;a++){
						if($('.type_det').eq(1).find('li').eq(a).html()==spec2Arr[0]){
							$('.type_det').eq(1).find('li').eq(a).addClass('active');
						}
						if($('.type_det').eq(1).find('li').eq(a).html()==listObj.spec2){
							$('.type_det').eq(1).find('li').eq(a).removeClass('disabled');
						}
					}
					var spec2Txt = $('.type_det').eq(1).find('li.active').html();
					if(spec2Txt==listObj.spec2){
						if(listObj.spec3){
							spec3Arr.push(listObj.spec3);
							for(var a=0;a<$('.type_det').eq(2).find('li').length;a++){
								if($('.type_det').eq(2).find('li').eq(a).html()==spec3Arr[0]){
									$('.type_det').eq(2).find('li').eq(a).addClass('active');
								}
								if($('.type_det').eq(2).find('li').eq(a).html()==listObj.spec3){
									$('.type_det').eq(2).find('li').eq(a).removeClass('disabled');
								}
							}
						}
					}
				}
			}
		}
		addSomeInfo();
		function addSomeInfo(){
			var active1 = $('.type_det').eq(0).find('li.active').html();
			var active2 = $('.type_det').eq(1).find('li.active').html()?$('.type_det').eq(1).find('li.active').html():'';
			var active3 = $('.type_det').eq(2).find('li.active').html()?$('.type_det').eq(2).find('li.active').html():'';
			var titPrice,titPublicPrice,titStorage;
			for(var k=0;k<templateList.length;k++){
				var listObj = templateList[k].data;
				if(listObj.spec1==active1){
					if(active2){
						if(listObj.spec2==active2){
							if(active3){
								if(listObj.spec3==active3){
									titPrice = listObj.real_price;
									titPublicPrice = listObj.public_price;
									titStorage = listObj.storage;
								}
							}else{
								titPrice = listObj.real_price;
								titPublicPrice = listObj.public_price;
								titStorage = listObj.storage;
							}
						}
					}else{
						titPrice = listObj.real_price;
						titPublicPrice = listObj.public_price;
						titStorage = listObj.storage;
					}
				}
			}
			if(isVipPrice){
				txt = '<div class="clearfix" style="line-height: 1.5rem;">'+
							'<div class="price_style price pull-left">¥<span>'+titPrice+'</span></div>'+
						'</div>';

			}else{
				txt = '<div class="clearfix" style="line-height: 1.5rem;">'+
						'<div class="price_style real_price pull-left">¥<span>'+titPublicPrice+'</span></div>'+
					'</div>';
			}
			$('.num_box').html(txt);
			$('.storage_num').html(titStorage);
		}
		
		//点击规格
		$('.type_det').eq(0).find('.btn').on('click',function(){
			$('.type_det:gt(0)').find('.btn').addClass('disabled');
			var thisSpec = $(this).html();
			var specObj = datas.result.item_spec_list;
			$('.type_det .btn').removeClass('active');
			$(this).addClass('active');
			for(var i=0;i<specObj.length;i++){
				var obj = specObj[i].data;
				if(thisSpec==obj.spec1){
					if(obj.spec2){
						for(var k=0;k<$('.type_det').eq(1).find('.btn').length;k++){
							if($('.type_det').eq(1).find('.btn').eq(k).html()==obj.spec2){
								$('.type_det').eq(1).find('.btn').eq(k).removeClass('disabled');
							}
						}
					}else{
						addSomeInfo();
					}
				}
			}
		})
		$('.type_det').eq(1).find('.btn').on('click',function(){
			$('.type_det').eq(2).find('.btn').addClass('disabled');
			var spec1Html = $('.type_det').eq(0).find('.btn.active').html();
			var thisSpec = $(this).html();
			var specObj = datas.result.item_spec_list;
			if(!$(this).hasClass('disabled')){
				$(this).addClass('active').siblings().removeClass('active');
			}
			for(var i=0;i<specObj.length;i++){
				var obj = specObj[i].data;
				if(spec1Html==obj.spec1){
					if(thisSpec==obj.spec2){
						if(obj.spec3){
							for(var k=0;k<$('.type_det').eq(2).find('.btn').length;k++){
								if($('.type_det').eq(2).find('.btn').eq(k).html()==obj.spec3){
									$('.type_det').eq(2).find('.btn').eq(k).removeClass('disabled');
								}
							}
						}else{
							addSomeInfo();
						}
					}
				}
			}
		})
		$('.type_det').eq(2).find('.btn').on('click',function(){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('active').siblings().removeClass('active');
			}
			addSomeInfo();
		})	 
		$('footer div').on('tap',function(){
			var index = $(this).attr('btn_type');
			//console.log(index)
			$('.sure').off('tap').on('tap',function(){
				if(uid){
					//购物车
					if(index =='0'){
						if($('.type_det li.active').length<$('.type_det').length){
							$('.storage_tip').css({'opacity':1}).html('请选择规格');
						}else{	
							var spec1 = $('.type_det').eq(0).find('li.active').html()?$('.type_det').eq(0).find('li.active').html():'';
							var spec2 = $('.type_det').eq(1).find('li.active').html()?$('.type_det').eq(1).find('li.active').html():'';
							var spec3 = $('.type_det').eq(2).find('li.active').html()?$('.type_det').eq(2).find('li.active').html():'';
							$.post(config.itemSpecFind,{'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3},function(data){
								//console.log(data);
								if(data.result.length==0){
									$('.storage_tip').css({'opacity':1}).html('库存不足');
								}else{
									$('.storage_tip').css({'opacity':0});
									var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3,'num':$('.add_or_substract .specific_num').html()*1};
									$.post(config.shoppingCart,cartData,function(data){
										var msg = '添加成功~';
										if(data.error_code!==0){
											msg = data.error_msg;
										}
										showTips(msg);
										$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
										$('.mask').fadeOut(1000);
									})			
								}
							})
						}
					//立即购买	
					}else if(index =='1'){
						if($('.type_det li.active').length<$('.type_det').length){
							$('.storage_tip').css({'opacity':1}).html('请选择规格');
						}else{
							var spec1 = $('.type_det').eq(0).find('li.active').html()?$('.type_det').eq(0).find('li.active').html():'';
							var spec2 = $('.type_det').eq(1).find('li.active').html()?$('.type_det').eq(1).find('li.active').html():'';
							var spec3 = $('.type_det').eq(2).find('li.active').html()?$('.type_det').eq(2).find('li.active').html():'';
							$.post(config.itemSpecFind,{'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3},function(data){
								//console.log(data);
								if(data.result.length==0){
									$('.storage_tip').css({'opacity':1}).html('库存不足');
								}else{
									$('.storage_tip').css({'opacity':0});
									var cartData = {'uid':uid,'item_id':itemID,'spec1':spec1,'spec2':spec2,'spec3':spec3,'num':$('.add_or_substract .specific_num').html()*1};
									$.post(config.itemBilling,cartData,function(data){
										//console.log(data)
										if(data.error_code==0){
											var goodsInfo,
												goodsBox = [],
												obj = data.result.order;
											for(var i=0;i<obj.length;i++){
												var obj2 = obj[i].data;
												goodsInfo = {};
												goodsBox.push(goodsInfo);
												goodsBox[i].goods_name = obj2.name;
												var s1 = obj2.spec1?obj2.spec1:'';
												var s2 = obj2.spec2?obj2.spec2:'';
												var s3 = obj2.spec3?obj2.spec3:'';
												goodsBox[i].spec_str = s1+s2+s3;
												if(isVipPrice){
													goodsBox[i].goods_prcie = obj2.real_price;
												}else{
													goodsBox[i].goods_prcie = obj2.public_price;
												}
												goodsBox[i].goods_pic = [obj2.title_pics[0]];
												goodsBox[i].goods_count = obj2.total_count;
												goodsBox[i].goods_id = data.result.order[i].id;
												goodsBox[i].goods_desc = obj[i].data.sub_name;

											}
											//console.log(goodsBox)
											goodsBox = JSON.stringify(goodsBox);
											window.localStorage.setItem('total_price',data.result.user_order[0].data.total_price);
											window.localStorage.setItem('user_order_id',data.result.user_order[0].id);
											window.localStorage.setItem('item_total_price',data.result.user_order[0].data.item_total_price);
											window.localStorage.setItem('delivery_type',data.result.user_order[0].data.post_type);
											window.localStorage.setItem('ship_fee',data.result.user_order[0].data.ship_fee);
											window.localStorage.setItem('preserveId',data.result.user_order[0].data.is_prestore);

											window.localStorage.setItem('goodsBox',goodsBox);
											window.localStorage.setItem('identity',data.result.user_order[0].data.id_no);
											window.localStorage.setItem('jump_btn','1');
											window.localStorage.setItem('counts_num','0');
											var userOrderData = data.result.user_order[0].data;
											window.localStorage.setItem('discountMon',userOrderData.discount_money);
											window.localStorage.setItem('getGooseCount',userOrderData.get_goose_count);
											window.localStorage.setItem('getPointCount',userOrderData.get_point_count);
											window.localStorage.setItem('itemCostGooseTotal',userOrderData.item_cost_goose_total_count);
											window.localStorage.setItem('myPointInfo',userOrderData.my_point_info);
											window.localStorage.setItem('isPointDiscount',userOrderData.is_point_discount);
											window.localStorage.setItem('isGroup',0);
											window.location.href="firm_order.html";
										}else{
											$('.choose_item_type').css({'transform':'translateY(26.25rem)'});
											$('.mask').fadeOut(1000);
											showTips(data.error_msg);
										}
									})
								}
							})
						}
					}
				}else{
					window.localStorage.setItem('setIndexNum',1);
					window.location.href="register.html"
				}
			})
			
		})

	}
	$('.introduction').append(obj.detail_desc);
	makeDeal();
	//评论tab条数
	var commentId,commentLevel,isPic,comments,pageNm = 1;
	if(datas.result.item_spec_template.length>0){
		commentId = datas.result.item_spec_template[0].data.item_id;
	}else{
		commentId = datas.result.item_info[0].id;
	}
	$.post(config.commentCount,{'item_id':commentId},function(datas){
		//console.log(datas);
		var obj = datas.result;
		var good = obj.good_comment_count;
		var normal = obj.normal_comment_count;
		var bad = obj.bad_comment_count;
		var totalCount = good+normal+bad;
		$('.comment_nav li .comment_num').eq(0).html(totalCount);
		$('.comment_nav li .comment_num').eq(1).html(good);
		$('.comment_nav li .comment_num').eq(2).html(normal);
		$('.comment_nav li .comment_num').eq(3).html(bad);
		$('.comment_nav li .comment_num').eq(4).html(obj.pic_comment_count);
		if(totalCount==0){
			$('.no_comment').show();
			$('.load_more').hide();
		}else{
			$('.no_comment').hide();
			$('.load_more').show();
		}
	})
	//评论列表
	//console.log(commentId);
	comments = {'item_id':commentId,'limit':10};
	addDatas(pageNm,comments);
	$('.comment_nav li').on('tap',function(){
		$('.comment_nav li').removeClass('active');
		$(this).addClass('active');
		$('.comment_box').empty();
		$('.load_more').html('加载更多');
		pageNm = 1;
		var index = $(this).index();
		switch(index){
			case 0:
				comments = {'item_id':commentId,'page':pageNm,'limit':10};
				break;
			case 1:
				comments = {'item_id':commentId,'comment_level':0,'page':pageNm,'limit':10};
				break;
			case 2:
				comments = {'item_id':commentId,'comment_level':1,'page':pageNm,'limit':10};
				break;
			case 3:
				comments = {'item_id':commentId,'comment_level':2,'page':pageNm,'limit':10};
				break;
			case 4:
				comments = {'item_id':commentId,'is_pic':1,'page':pageNm,'limit':10};
				break;
		}
		addDatas(pageNm,comments);
	})

})
		
