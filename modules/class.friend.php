<?php
require_once("class.base.php");

class Friend extends Conn{
	
	function insert($fid, $gid){
		$sql = "INSERT INTO friend (gid, fopenid) VALUES ($gid, '$fid')";
		mysql_query($sql, $this->link);
		return mysql_insert_id($this->link);
	}
	
	function remove($fid,$gid){
		$sql = "DELETE FROM friend WHERE fopenid = '$fid' AND gid = $gid";
		mysql_query($sql, $this->link);
	}
	
	function getFriendsOfGroup($gid){
		$sql = "SELECT fopenid FROM friend WHERE gid = $gid";
		$result = mysql_query($sql, $this->link);
		
		$friends = array();
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			$friends[$i]['openid'] = $row['fopenid'];
			$i++;
		}
		return $friends;
	}
}
?>