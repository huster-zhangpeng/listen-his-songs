<?php
	require_once("../../modules/class.friend.php");
	
	$fid=$_REQUEST['fid'];
	$gid=$_REQUEST['gid'];
	
	$friend=new Friend;
	$friend->remove($fid,$gid);
	echo "删除成功";
?>