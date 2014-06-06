<?php

/**
 * OpenAPI V3 SDK 示例代码
 *
 * @version 3.0.0
 * @author open.qq.com
 * @copyright © 2011, Tencent Corporation. All rights reserved.
 * @ History:
 *               3.0.0 | nemozhang | 2011-12-12 11:11:11 | initialization
 */


require_once 'OpenApiV3.php';
require_once 'global.php';

// 用户的OpenID/OpenKey
$openid = $_REQUEST['openid'];
$openkey = $_REQUEST['openkey'];

// 所要访问的平台, pf的其他取值参考wiki文档: http://wiki.open.qq.com/wiki/API3.0%E6%96%87%E6%A1%A3 
$pf = 'qzone';


$sdk = new OpenApiV3($GLOBALS['appid'], $GLOBALS['appkey']);
$sdk->setServerName($GLOBALS['server_name']);

$ret = get_app_friends(&$sdk, $openid, $openkey, $pf);
while($ret['is_lost'] == 1){
	$ret = get_app_friends(&$sdk, $openid, $openkey, $pf);
}
$finfo = get_multi_info(&$sdk, $openid, $openkey, $pf, $ret['items']);
echo(json_encode($finfo));

/**
 * 获取好友资料
 *
 * @param object $sdk OpenApiV3 Object
 * @param string $openid openid
 * @param string $openkey openkey
 * @param string $pf 平台
 * @return array 好友资料数组
 */
function get_app_friends($sdk, $openid, $openkey, $pf)
{
	$params = array(
		'openid' => $openid,
		'openkey' => $openkey,
		'pf' => $pf,
	);
	
	$script_name = '/v3/relation/get_app_friends';

	return $sdk->api($script_name, $params);
}

/**
 * 获取好友资料
 *
 * @param object $sdk OpenApiV3 Object
 * @param string $openid openid
 * @param string $openkey openkey
 * @param string $pf 平台
 * @return array 好友资料数组
 */
function get_multi_info($sdk, $openid, $openkey, $pf, $friends)
{
	$fopenids = "";
	$i = 0;
	if($friends){
		foreach($friends as $friend){
			if($i == 0){
				$fopenids = $fopenids.$friend['openid'];
			} else {
				$fopenids = $fopenids.'_'.$friend['openid'];
			}
			$i++;
		}
	}
	$params = array(
		'openid' => $openid,
		'openkey' => $openkey,
		'pf' => $pf,
		'fopenids' => $fopenids,
	);
	
	$script_name = '/v3/user/get_multi_info';

	return $sdk->api($script_name, $params);
}
// end of script
