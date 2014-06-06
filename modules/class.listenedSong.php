<?PHP
require_once("class.base.php");

class ListenedSong extends Conn{
	// นนิ์บฏสý
	function __construct(){
		parent::__construct();
	}
	
	function insert($usid){
		$sql = "CALL test($usid)";
		mysql_query($sql, $this->link);
		return mysql_insert_id($this->link);
	}
}

?>