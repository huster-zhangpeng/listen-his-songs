<?php
require_once("../../modules/class.user.php");

$uid = $_REQUEST['openid'];

$user = new User($uid);

$ret = $user->getSongsList()->getAllSongs();
	
echo json_encode($ret);
?>
