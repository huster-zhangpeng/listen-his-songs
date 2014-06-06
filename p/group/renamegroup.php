<?php
	require_once("../../modules/class.fgroup.php");
	
	$name=$_REQUEST['newgroup'];
	$gid=$_REQUEST['groupid'];
	
	$group=new Group();
	$group->rename($gid,$name);
	echo "1";
?>