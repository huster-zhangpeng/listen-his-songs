<?php
	require_once("../../modules/class.friend.php");

	$gid = $_REQUEST['gid'];
	$fopenid = $_REQUEST['fopenid'];

	echo $gid."|".$fopenid;

	$friend = new Friend();
	echo $friend->insert($fopenid, $gid);
?>