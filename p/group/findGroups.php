<?php
	require_once('../../modules/class.user.php');
	
	if(!isset($_REQUEST['myopenid'])){
		exit();
	}
	
	$uid = $_REQUEST['myopenid'];
	$user = new User($uid);
	$ret = $user->getGroups();
	echo(json_encode($ret));
?>