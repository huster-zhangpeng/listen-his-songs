<?php
require_once("class.base.php");
require_once("class.friend.php");

class Group extends Conn{
	
	function insert($uid, $gname){
	    $sql = "INSERT INTO fgroup (openid,name) VALUES ('$uid', '$gname')";
		mysql_query($sql, $this->link);
		return mysql_insert_id($this->link);
	}

	function rename($gid,$name){
		$sql="UPDATE fgroup SET name = '$name' WHERE id = $gid";
		mysql_query($sql, $this->link);
	}
	
	function delete($gid){
		$sql = "DELETE FROM friend WHERE gid = $gid";
		mysql_query($sql, $this->link);
		
		$sql = "DELETE FROM fgroup WHERE id = $gid";
		mysql_query($sql, $this->link);
	}
	
	function listGroupsOfUser($uid){
		$sql = "SELECT id,name FROM fgroup WHERE openid = '$uid'";
		$result = mysql_query($sql, $this->link);

		$groups = array();
		$friend = new Friend();
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			$groups[$i] = $row;
			$groups[$i]['friends'] = $friend->getFriendsOfGroup($row['id']);
			$i++;
		}
		return $groups;
	}
}
?>