<?php
require_once 'base.php';
define("MAX_URL", 1);
$sname = $_REQUEST['sname'];
$singer = $_REQUEST['singer'];
$urls = $_REQUEST['urls'];
$num = $_REQUEST['num'];
$ret = array();
$index = 0;

function httpFileExistsAndIsMP3File($url){
	//$fp = @fopen($url, "r");
	$ret = FALSE;
	$ch = curl_init($url);
　　curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
　　curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
　　$fp = curl_exec($ch);
	if($fp){
		$meta = stream_get_meta_data($fp);
		foreach ($meta['wrapper_data'] as $metaValue) {
			if (strpos(strtolower($metaValue), "audio/mpeg")) {
				$ret = TRUE;
				break;
			}
		}
	}
	curl_close($ch);
	return $ret;
}

function analysisExistUrls(){
	global $urls, $num, $ret, $index;
	if(empty($urls)) return;
	$urls = split('\|', $urls);
	for($i = 0; $i < $num; $i ++){
		if(httpFileExistsAndIsMP3File($urls[$i])){
			$ret[$index]['url'] = $urls[$i];
			$index ++;
			if($index == MAX_URL){
				echo json_encode($ret);
				exit();
			}
		}
	}
}

function dataHandler($songInfo){
	global $sname, $singer;
	global $ret, $index;
	//echo "X";
	$isRightSong = ($songInfo['name'] == $sname && $songInfo['singer'] == $singer);
	if($isRightSong){
		foreach($songInfo['url'] as $url){
			//echo "Z";
			if(httpFileExistsAndIsMP3File($url)){
				//echo "O";
				$ret[$index]['url'] = $url;
				$index ++;
				if($index == MAX_URL){
				 	echo json_encode($ret);
				 	exit();
				}
			}
		}
	}
}

function sosoSearchUrlAgain(){
	global $sname, $singer;
	$input = "$sname $singer";
	$url = getUrl($input);
	for($i = 1; $i <= 3; $i ++){
		searchBySOSO($url."&p=$i");
	}
}

function main(){
	ini_set("allow_url_fopen", "On");
	analysisExistUrls();
	sosoSearchUrlAgain();
	ini_set("allow_url_fopen", "Off");
}

main();