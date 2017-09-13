<?php 
$code = $_GET['code'];
$appid = 'wx795992462b631e70';
$secret = 'c1de04b49183b676b68d6e4765bfc225';
$access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$secret."&code=".$code."&grant_type=authorization_code";
$access = json_decode(httpGet($access_token_url), true);
$openid = $access['openid'];
if($openid){
	$param = array();
	$param['openid'] = $openid;
	$http = new \Http();
	$json = $http->send('http://101.201.115.31:14445/web/get_user_info/by_open_id.json', $param);
	$result = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);
	if ($result['error_code'] != 0) {

    }
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
