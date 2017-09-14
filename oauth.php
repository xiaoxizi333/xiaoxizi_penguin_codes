<?php 
$code = $_GET['code'];
$appid = 'wx795992462b631e70';
$secret = 'c1de04b49183b676b68d6e4765bfc225';
$access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$secret."&code=".$code."&grant_type=authorization_code";
$access = json_decode(httpGet($access_token_url), true);
$openid = $access['openid'];
$access_token = $access['access_token'];
if($openid && $access_token){
	echo '<script>sessionStorage.setItem("openid", "'.$openid.'");</script>';
	$user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$openid."&lang=zh_CN";
	$user_info = json_decode(httpGet($user_info_url), true);
	if ($user_info) {
		echo '<script>sessionStorage.setItem("user_name", "'.$user_info['nickname'].'");sessionStorage.setItem("user_pic", "'.$user_info['headimgurl'].'");</script>';
	}
	$param = array();
	$param['openid'] = $openid;
	$result = httpPost('http://101.201.115.31:14445/web/get_user_info/by_open_id.json', $param);
	$result = json_decode($result,true);
	if ($result['error_code'] != 0) {
		echo '<script>sessionStorage.setItem("uid", "'.$result['result']['id'].'");</script>';
	}
	echo '<script>window.location.href="/";</script>';
}

function httpGet($url)
{
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //不验证证书
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false); //不验证证书
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	curl_setopt($curl, CURLOPT_URL, $url);
	$res = curl_exec($curl);
	curl_close($curl);
	return $res;
}
function httpPost($url, $array = array()) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0 );
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($array));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 100);
    $content = curl_exec($ch);
    curl_close ( $ch );
    return $content;
}
