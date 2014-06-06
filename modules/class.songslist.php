<?PHP
require_once("class.base.php");
require_once("class.song.php");

class SongsList extends Conn{
	private $uid = 0;
	
	// ���캯��
	function __construct($uid){
		parent::__construct();
		$this->uid = $uid;
	}
	
	function addSong($sid){
		$sql = "INSERT INTO user_song(sid, openid) VALUES($sid, '".$this->uid."')";
		mysql_query($sql, $this->link);
		return mysql_insert_id($this->link);
	}
	
	function deleteSong($sname, $singer){
		$usid = null;
		$times_30d = null;
		$sql = "SELECT user_song.id as usid, times_30d as times ".
					"FROM song,user_song ".
					"WHERE song.sid = user_song.sid ".
					"AND user_song.openid = '".$this->uid."' ".
					"AND song.name = '$sname' ".
					"AND song.singer = '$singer'";
		$result = mysql_query($sql, $this->link);
		if (mysql_num_rows($result) == 0) {
			return;
		}
		$row = mysql_fetch_assoc($result);
		if($row['times'] > 0){
			$sql = "UPDATE user_song ".
					"SET flag = 0 ".
					"WHERE id = ".$row['usid'];
			mysql_query($sql, $this->link);
		} else {
			$sql = "DELETE FROM listened_song WHERE usid = ".$row['usid'];
			mysql_query($sql, $this->link);
			
			$sql = "DELETE FROM user_song WHERE id = ".$row['usid'];
			mysql_query($sql, $this->link);
		}
	}

	//ͨ������������������ȡ�ҵĲ����б���Ψһ��һ�׸�
	//�������׸�϶����ڣ���ֻ����һ�ף���ʵ��Ҳ�����
	function getSong($sname, $singer){
		$sql = "SELECT user_song.id as usid FROM song,user_song WHERE song.sid = user_song.sid ".
											"AND user_song.openid = '".$this->uid."' ".
											"AND song.name = '$sname' ".
											"AND song.singer = '$singer'";
		$result = mysql_query($sql, $this->link);
		$usid = null;
		if($row = mysql_fetch_assoc($result)){
			$usid = $row['usid'];
		}
		return $usid;
	}
	
	// ��ȡ�û��Ĳ����б�
	function getAllSongs(){
		$sql = "SELECT user_song.id as usid, name, singer, src, album ".
				"FROM song, user_song ".
				"WHERE song.sid = user_song.sid ".
				"AND user_song.openid = '".$this->uid."' ".
				"AND user_song.flag = 1 ".
				"ORDER BY times_5d,times_10d,times_15d,times_30d DESC";
		$result = mysql_query($sql, $this->link);
		
		$i = 0;
		$songs['songs'] = array();
		while($row = mysql_fetch_assoc($result)){
			$songs['songs'][$i] = $row;
			$i++;
		}
		$songs['num'] = $i;
		return $songs;
	}
	
	
	// ��ȡ����������ĸ�
	function getRecentSongs($days){
		$sql = "SELECT song.sid as sid, name, singer, src, album ".
					"FROM user_song,song ".
					"WHERE user_song.openid = '".$this->uid."' ".
					"AND user_song.sid = song.sid ".
					"AND $days > 0 ".
					"ORDER BY $days DESC";
		$result = mysql_query($sql, $this->link);
		$i = 0;
		$recentSongs = array();
		while($row = mysql_fetch_assoc($result)){
			$recentSongs[$i] = $row;
			$i++;
		}
		$recentSongs['num'] = $i;
		return $recentSongs;
	}

	function hasSong($sid){
		$song = new Song();
		return $song->isBelongTo($sid, $this->uid);
	}
	
	function findSongBack($usid){
		$sql = "UPDATE user_song SET flag = 1 WHERE id = $usid";
		mysql_query($sql, $this->link);
	}
}
?>