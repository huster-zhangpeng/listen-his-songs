<?php

class Conn{
	public static $address = "localhost:3306";
	public static $username = "root";
	public static $password = "111111";
	public static $schema = "listen_his_songs";
	protected $link;
	
	// 构造函数
	function __construct(){
		$this->link = mysql_connect(Conn::$address, Conn::$username, Conn::$password);
		if (!$this->link) {
			die('Could not connect: ' . mysql_error());
		}
		mysql_query("set names 'utf8'", $this->link);
		mysql_select_db(Conn::$schema, $this->link);
	}
	
	// 析构函数
	function __destruct(){
		if($this->link){
			@mysql_close($this->link);
		}
	}
}
?>