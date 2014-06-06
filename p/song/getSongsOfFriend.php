<?php
require_once("../../modules/class.user.php");
require_once("../../modules/class.listenedSong.php");

$fid = $_REQUEST['openid'];
$days = $_REQUEST['days'];

$user = new User($fid);
$ret['db'] = $user->getSongsList()->getRecentSongs($days);

echo json_encode($ret);
?>