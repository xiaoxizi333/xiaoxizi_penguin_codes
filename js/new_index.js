if(!openid){
    localStorage.setItem("redirect_url",window.location.href);
    window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx795992462b631e70&redirect_uri=http%3A%2F%2Fshop.qietuan.org%2Foauth.php&response_type=code&scope=snsapi_userinfo&state=12345678901#wechat_redirect"
}

new Swiper('.top_banner_sw_contain.swiper-container', {
    pagination : '.top_banner_box',
    autoplay: 3000,//可选选项，自动滑动
    autoplayDisableOnInteraction:false//使滑动效果不停止
});

$('.vip_order').on('tap',function(){
    //window.localStorage.setItem('tabId',1308254907990793);
    window.location.href = "all-products-classify.html?tabId="+1308254907990793;
})

// $('.new_arrival_more').on('tap',function(){
//     //window.localStorage.setItem('tabId',1377969693067433);
//     window.location.href = "all-products-classify.html?tabId="+1542046973236148;
// })
//搜索
$('#search').on('keydown',function(e){
    if(e.keyCode ==13){
        window.localStorage.setItem('search_item_name',$(this).val());
        window.localStorage.setItem('filterNum',1);
        window.location.href="all-products.html";
    }
})
//新品上市
//var newArrivalData = {page:1,limit:4,item_class:1377969693067433};
var newArrivalData = {page:1,limit:4,item_class:1542046973236148};
$.ajax({
    type:"POST",
    url:config.allItemList,
    dataType:'json',
    contentType:'application/json',
    data:JSON.stringify(newArrivalData),
    success:function(datas){
        //console.log(datas);
        if(datas.error_code==0){  
            var obj = datas.result;
            if(obj&&obj.length){
                $('.new_arrival').show();
                var html = '';
                for(var i=0;i<obj.length;i++){
                    var coverPic = obj[i].data.cover_pic;
                    var goodsId = obj[i].id;
                    var goodsSpecId = obj[i].good_item_spec_id?obj[i].good_item_spec_id:0;
                    if(coverPic&&coverPic!==''){
                        html += '<div class="swiper-slide" item_id="'+goodsId+'" item_spec_id="'+goodsSpecId+'"><img src='+coverPic+'></div>';
                    }
                }
                $('.new_arrival .swiper-wrapper').html(html);
                jumpToGoods($('.new_arrival .swiper-slide'));
                new Swiper('.new_arrival .swiper-container', {
                    pagination : '.page_box',
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction:false//使滑动效果不停止
                });
            }else{
                $('.new_arrival').hide();
            }
        }
    }
})
//会员订购
//var smartBuyData = {page:1,limit:4,item_class:1308254907990793};
var smartBuyData = {page:1,limit:4,item_class:1308254907990793};
$.ajax({
    type:"POST",
    url:config.allItemList,
    dataType:'json',
    contentType:'application/json',
    data:JSON.stringify(smartBuyData),
    success:function(datas){
        //console.log(datas);
        if(datas.error_code==0){
            var obj = datas.result;
            if(obj&&obj.length){
                $('.smart_buys').show();
                var html = '';
                for(var i=0;i<obj.length;i++){
                    var coverPic = obj[i].data.cover_pic;
                    var goodsId = obj[i].id;
                    var goodsSpecId = obj[i].good_item_spec_id?obj[i].good_item_spec_id:0;
                    if(coverPic&&coverPic!==''){
                        html += '<div class="swiper-slide" item_id="'+goodsId+'" item_spec_id="'+goodsSpecId+'"><img src='+coverPic+'></div>';
                    }
                }
                $('.smart_buys .swiper-wrapper').html(html);
                jumpToGoods($('.smart_buys .swiper-slide'));
                new Swiper('.smart_buys .swiper-container', {
                    pagination : '.page_box',
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction:false//使滑动效果不停止
                });
            }else{
                $('.smart_buys').hide();
            }
        }
    }
})
//精品系列
var BoutiqueData = {drink_or_prime:"prime",page:1,limit:4,sort:{"data.published_at": "desc"}};
$.ajax({
    type:"POST",
    url:config.primeDrinkList,
    dataType:'json',
    contentType:'application/json',
    data:JSON.stringify(BoutiqueData),
    success:function(datas){
        //console.log(datas);
        if(datas.error_code==0){               
            var obj = datas.result;
            if(obj&&obj.length){
                $('.Boutique').show();
                var html = '';
                for(var i=0;i<obj.length;i++){
                    var coverPic = obj[i].data.cover_pic;
                    var goodsId = obj[i].id;
                    var goodsSpecId = obj[i].data.good_item_spec_id?obj[i].data.good_item_spec_id:0;
                    if(coverPic&&coverPic!==''){
                        html += '<div class="swiper-slide" item_id="'+goodsId+'" item_spec_id="'+goodsSpecId+'"><img src='+coverPic+'></div>';
                    }
                }
                $('.Boutique .swiper-wrapper').html(html);
                jumpToGoods($('.Boutique .swiper-slide'));
                new Swiper('.Boutique .swiper-container', {
                    pagination : '.page_box',
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction:false//使滑动效果不停止
                });
            }else{
                $('.Boutique').hide();
            }
        }
    }
})
//畅饮系列
var drSeriesData = {drink_or_prime:"drink",page:1,limit:4,sort:{"data.published_at": "desc"}};
$.ajax({
    type:"POST",
    url:config.primeDrinkList,
    dataType:'json',
    contentType:'application/json',
    data:JSON.stringify(drSeriesData),
    success:function(datas){
        //console.log(datas);
        if(datas.error_code==0){                
            var obj = datas.result;
            if(obj&&obj.length){
                $('.drinks_series').show();
                var html = '';
                for(var i=0;i<obj.length;i++){
                    var coverPic = obj[i].data.cover_pic;
                    var goodsId = obj[i].id;
                    var goodsSpecId = obj[i].data.good_item_spec_id?obj[i].data.good_item_spec_id:0;
                    if(coverPic&&coverPic!==''){
                        html += '<div class="swiper-slide" item_id="'+goodsId+'" item_spec_id="'+goodsSpecId+'"><img src='+coverPic+'></div>';
                    }
                }
                $('.drinks_series .swiper-wrapper').html(html);
                jumpToGoods($('.drinks_series .swiper-slide'));
                new Swiper('.drinks_series .swiper-container', {
                    pagination : '.page_box',
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction:false//使滑动效果不停止
                });
            }else{
                $('.drinks_series').hide();
            }
        }
    }
})
//猜你喜欢
var guessData = {location_type:"good_detail"};
$.ajax({
    type:"POST",
    url:config.guessUouLike,
    dataType:'json',
    contentType:'application/json',
    data:JSON.stringify(guessData),
    success:function(datas){
        //console.log(datas);
        if(datas.error_code==0){ 
            var obj = datas.result.list[0].items_list;
            if(obj&&obj.length){
                $('.guess_series').show();
                var html = '';
                for(var i=0;i<obj.length;i++){
                    var coverPic = obj[i].item[0].cover_pic;
                    var goodsId = obj[i].good_item_id;
                    var goodsSpecId = obj[i].good_item_spec_id?obj[i].good_item_spec_id:0;
                    if(coverPic&&coverPic!==''){
                        html += '<div class="swiper-slide" item_id="'+goodsId+'" item_spec_id="'+goodsSpecId+'"><img src='+coverPic+'></div>';
                    }
                }
                $('.guess_series .swiper-wrapper').html(html);
                jumpToGoods($('.guess_series .swiper-slide'));
                new Swiper('.guess_series .swiper-container', {
                    pagination : '.page_box',
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction:false//使滑动效果不停止
                });
            }else{
                $('.guess_series').hide();
            }
        }
    }
})
