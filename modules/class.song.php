<?php
require_once("class.base.php");

class Song extends Conn{
	// 构造函数
	function __construct(){
		parent::__construct();
	}
	
	//插入一首新歌，该歌可以没有专辑信息，分类处理
	function insert($sname, $singer, $src = null, $album = null){
		if($album == null){
			$album = "null";
		}else{
			$album = "'$album'";
		}
		$sql = "INSERT INTO song (name, singer, src, album) ".
							"VALUES ('$sname', '$singer', '$src', $album)";
		mysql_query($sql, $this->link);
		return mysql_insert_id($this->link);
	}
	
	function updateSrc($sid, $src){
		$sql = "UPDATE song SET src = '$src' WHERE sid = $sid";
		mysql_query($sql, $this->link);
	}
	
	// 判定一首歌是否存在，若存在返回sid
	function isExist($sname, $singer, $album = null){
		
		if($album == null){
			$album = "is null";
		} else {
			$album = "= '$album'";
		}
		$sql = "SELECT sid FROM song WHERE name = '$sname' AND singer = '$singer' AND album $album";
		$result = mysql_query($sql, $this->link);
		if (mysql_num_rows($result) == 0) {
			return false;
		}
		$row = mysql_fetch_assoc($result);
		return $row['sid'];
	}
	
	//查询我的播放列表中是否存在这首歌，若存在则返回usid
	function isBelongTo($sid, $uid){
		$sql = "SELECT id as usid,flag FROM user_song WHERE openid = '$uid' AND sid = $sid";
		$result = mysql_query($sql, $this->link);
		if (mysql_num_rows($result) == 0) {
			return false;
		}
		return mysql_fetch_assoc($result);
	}
	
	// 根据搜索内容搜索一首歌
	function search($input){
		$songs = array();
		$params = split('\s', $input);
		foreach ($params as $param){
			$param = "'%".$param."%'";
			$sql = "SELECT sid,name,singer,album,src FROM song ".
						"WHERE name LIKE $param ".
						"OR singer LIKE $param ".
						"OR album LIKE $param LIMIT 30";
			$result = mysql_query($sql, $this->link);
			while($row = mysql_fetch_assoc($result)){
				if(!isset($songs[ $row['sid'] ])){
					$songs[ $row['sid'] ] = $row;
				}
			}
		}
		return $songs;
	}
	
}
?>