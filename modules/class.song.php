<?php
require_once("class.base.php");

class Song extends Conn{
	// ���캯��
	function __construct(){
		parent::__construct();
	}
	
	//����һ���¸裬�ø����û��ר����Ϣ�����ദ��
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
	
	// �ж�һ�׸��Ƿ���ڣ������ڷ���sid
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
	
	//��ѯ�ҵĲ����б����Ƿ�������׸裬�������򷵻�usid
	function isBelongTo($sid, $uid){
		$sql = "SELECT id as usid,flag FROM user_song WHERE openid = '$uid' AND sid = $sid";
		$result = mysql_query($sql, $this->link);
		if (mysql_num_rows($result) == 0) {
			return false;
		}
		return mysql_fetch_assoc($result);
	}
	
	// ����������������һ�׸�
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