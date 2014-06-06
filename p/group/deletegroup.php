<?php
	require_once("../../modules/class.fgroup.php");
	
	$gid=$_REQUEST['groupid'];
	
	$group = new Group();
	$group->delete($gid);
	echo "1";
?>