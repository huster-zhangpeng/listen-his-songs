<?php
	require_once('../../modules/class.fgroup.php');
	if(!isset($_REQUEST['openid']) || !isset($_REQUEST['groupname'])){
		exit();
	}
	$openid = $_REQUEST['openid'];
	$groupName = $_REQUEST['groupname'];

	$group = new Group();
	$gid = $group->insert($openid, $groupName);
	echo $gid;
?>