<?php
require_once("../../modules/class.song.php");
require_once("../../modules/class.user.php");
require_once("../../modules/class.listenedSong.php");

$uid = $_REQUEST['openid'];

$sname = $_REQUEST['sname'];
$singer = $_REQUEST['singer'];
$album = $_REQUEST['album'];
$src = $_REQUEST['src'];
if($album == "null") $album = null;

$song = new Song();
$user = new User($uid);
$sid = $song->isExist($sname, $singer, $album);
$usid = null;

if(!$sid){
	$sid = $song->insert($sname, $singer, $src, $album);
	$usid = $user->listenANewSong($sid);
} else {
	$ret = $user->getSongsList()->hasSong($sid);
	if(!$ret){
		$usid = $user->listenANewSong($sid);
	} else {
		$usid = $ret['usid'];
		if($ret['flag'] == 0){
			$user->findSongBack($ret['usid']);
		}
	}
}

$listenedSong = new ListenedSong();
$listenedSong->insert($usid);

echo $usid;
?>