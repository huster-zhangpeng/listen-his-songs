<?php
require_once("../../modules/class.user.php");
require_once("../../modules/class.listenedSong.php");

$uid = $_REQUEST['openid'];
$sname = $_REQUEST['sname'];
$singer = $_REQUEST['singer'];

$user = new User($uid);
$user->getSongsList()->deleteSong($sname, $singer);
?>