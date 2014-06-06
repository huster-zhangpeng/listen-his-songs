<?php
require_once("../../modules/class.song.php");
require_once("../../modules/class.user.php");
require_once("../../modules/class.listenedSong.php");

$uid = $_REQUEST['openid'];
$sid = $_REQUEST['sid'];

$user = new User($uid);
$song = new Song();
$ret = $user->getSongsList()->hasSong($sid);
$usid = null;
if(!$ret){
	$usid = $user->listenANewSong($sid);
} else {
	$usid = $ret['usid'];
	if($ret['flag'] == 0){
		$user->getSongsList()->findSongBack($ret['usid']);
	}
}

$listenedSong = new ListenedSong();
$listenedSong->insert($usid);

echo $usid;
?>