<?php

/**
 * OpenAPI V3 SDK 示例代码
 *
 * @version 3.0.0
 * @author open.qq.com
 * @copyright ? 2011, Tencent Corporation. All rights reserved.
 * @ History:
 *               3.0.0 | nemozhang | 2011-12-12 11:11:11 | initialization
 */


require_once 'OpenApiV3.php';
require_once 'global.php';

// 用户的OpenID/OpenKey
$openid = $_REQUEST['openid'];
$openkey = $_REQUEST['openkey'];

// 所要访问的平台, pf的其他取值参考wiki文档: http://wiki.open.qq.com/wiki/API3.0%E6%96%87%E6%A1%A3 
$pf = 'tapp';
$content = $_REQUEST['content'];

$sdk = new OpenApiV3($GLOBALS['appid'], $GLOBALS['appkey']);
$sdk->setServerName($GLOBALS['server_name']);

$clientip = $_SERVER['REMOTE_ADDR'];
$ret = add_tapp(&$sdk, $openid, $openkey, $pf,$content,$clientip);
echo (json_encode($ret));

/**
 * 获取好友资料
 *
 * @param object $sdk OpenApiV3 Object
 * @param string $openid openid
 * @param string $openkey openkey
 * @param string $pf 平台
 * @return array 好友资料数组
 */
function add_tapp($sdk, $openid, $openkey, $pf,$content,$clientip)
{
	$params = array(
		'openid' => $openid,
		'openkey' => $openkey,
		'pf' => $pf,
		'content'=>$content,
		'clientip'=>$clientip,
	);
	
	$script_name = '/v3/t/add_t';

	return $sdk->api($script_name, $params);
}


// end of script