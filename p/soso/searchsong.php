<?php
require_once("../../modules/class.song.php");
require_once("base.php");
$input = $_REQUEST['searchContent'];

$ret = array();
$index = 0;

function isInDB($songInfo, $songsInDB){
	foreach($songsInDB as $song){
		if($song['name'] == $songInfo['name'] &&
				$song['singer'] == $songInfo['singer'] &&
				$song['album'] == $songInfo['album']){
			return TRUE;
		}
	}
	return FALSE;
}

function dataHandler($songInfo){
	global $ret;
	global $index;
	if(!isInDB($songInfo, $ret['db'])){
		for($i = 0; $i < $index; $i ++){
			if($ret['soso'][$i]['name'] == $songInfo['name'] &&
					$ret['soso'][$i]['singer'] == $songInfo['singer'] &&
					$ret['soso'][$i]['album'] == $songInfo['album']){
				//如果遇到重复的歌，不再新建记录，而是直接把url保存进去
				$count = count($ret['soso'][$i]['url']);
				foreach($songInfo['url'] as $url){
					$ret['soso'][$i]['url'][$count] = $url;
					$count ++;
				}
				return;
			}
		}
		$ret['soso'][$index] = $songInfo;
		$index ++;
	}
}

function searchDB($input){
	global $ret;
	$song = new Song();
	$songs = $song->search($input);
	$ret['db'] = array();
	$index = 0;
	foreach($songs as $song){
		$ret['db'][$index] = $song;
		$index ++;
	}
	$ret['db']['num'] = $index;
}

function main($input){
	global $ret;
	searchDB($input);
	/*
	$url = getUrl($input);
	$ret['soso'] = array();
	ini_set("allow_url_fopen", "On");
	for($i = 1; $i <= 3; $i ++){
		searchBySOSO($url."&p=$i");
	}
	$ret['page'] = 3;
	ini_set("allow_url_fopen", "Off");
	*/
}

main($input);
//$ret['soso']['num'] = $index;
echo json_encode($ret);
?>